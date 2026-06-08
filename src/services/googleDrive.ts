import { BACKUP_FILE_NAME, CloudSyncSnapshot, chooseCloudSyncSnapshot, parseCloudSyncSnapshot } from '../models/cloudSync';
import {
  createLocalCloudSyncSnapshot,
  exportCloudSyncSnapshot,
  getCloudSyncDeviceId,
  restoreCloudSyncSnapshot,
} from './cloudSync';

const GOOGLE_DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.appdata';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';
const GOOGLE_DRIVE_FILES_URL = 'https://www.googleapis.com/drive/v3/files';
const GOOGLE_DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';

const CONNECTION_STORAGE_KEY = 'back-pain-relief.google-drive.connection';
const GSI_SCRIPT_ID = 'google-identity-services';
const GOOGLE_DRIVE_EVENT = 'back-pain-relief:google-drive-updated';

export interface GoogleDriveUser {
  email?: string;
  name?: string;
  picture?: string;
  id?: string;
}

export interface GoogleDriveConnection {
  accessToken: string;
  user: GoogleDriveUser;
  connectedAt: string;
  lastSyncedAt?: string;
}

export interface GoogleDriveSyncResult {
  connection: GoogleDriveConnection;
  fileId: string | null;
  action: 'uploaded' | 'downloaded' | 'in-sync';
  snapshot: CloudSyncSnapshot;
}

let cachedConnection: GoogleDriveConnection | null = null;

const getSafeSessionStorage = (): Storage | null => {
  try {
    return globalThis.sessionStorage ?? null;
  } catch {
    return null;
  }
};

const getClientId = (): string | null => import.meta.env.VITE_GOOGLE_CLIENT_ID ?? null;

const ensureGsiScript = async (): Promise<void> => {
  if (globalThis.window.google?.accounts?.oauth2) return;
  if (document.getElementById(GSI_SCRIPT_ID)) return;

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = GSI_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
};

const requestAccessToken = async (prompt: '' | 'consent' | 'select_account'): Promise<string> => {
  const clientId = getClientId();
  if (!clientId) {
    throw new Error('Google client ID is missing. Set VITE_GOOGLE_CLIENT_ID.');
  }

  await ensureGsiScript();

  return new Promise<string>((resolve, reject) => {
    const tokenClient = window.google?.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: GOOGLE_DRIVE_SCOPE,
      callback: (response) => {
        if (response.access_token) {
          resolve(response.access_token);
          return;
        }

        reject(new Error(response.error_description || response.error || 'Google authorization failed'));
      },
    });

    if (!tokenClient) {
      reject(new Error('Google Identity Services is unavailable'));
      return;
    }

    tokenClient.requestAccessToken({ prompt });
  });
};

const fetchUserInfo = async (accessToken: string): Promise<GoogleDriveUser> => {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return {};
  }

  const data = await response.json() as GoogleDriveUser;
  return data;
};

const readJsonResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
};

const readTextResponse = async (response: Response): Promise<string> => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  return response.text();
};

const getDriveHeaders = (accessToken: string): HeadersInit => ({
  Authorization: `Bearer ${accessToken}`,
});

const findBackupFileId = async (accessToken: string): Promise<string | null> => {
  const params = new URLSearchParams({
    spaces: 'appDataFolder',
    q: `name='${BACKUP_FILE_NAME}' and trashed=false`,
    fields: 'files(id,name,modifiedTime)',
    pageSize: '10',
  });

  const response = await fetch(`${GOOGLE_DRIVE_FILES_URL}?${params.toString()}`, {
    headers: getDriveHeaders(accessToken),
  });

  const payload = await readJsonResponse<{ files?: Array<{ id?: string; name?: string; modifiedTime?: string }> }>(response);
  return payload.files?.[0]?.id ?? null;
};

const downloadBackupSnapshot = async (accessToken: string, fileId: string): Promise<CloudSyncSnapshot> => {
  const response = await fetch(`${GOOGLE_DRIVE_FILES_URL}/${fileId}?alt=media`, {
    headers: getDriveHeaders(accessToken),
  });

  const content = await readTextResponse(response);
  const snapshot = parseCloudSyncSnapshot(content);
  if (!snapshot) {
    throw new Error('Invalid Google Drive backup content');
  }

  return snapshot;
};

const uploadBackupSnapshot = async (accessToken: string, snapshotJson: string, fileId?: string | null): Promise<string> => {
  const boundary = `back-pain-relief-${Date.now()}`;
  const metadata = fileId
    ? { name: BACKUP_FILE_NAME }
    : { name: BACKUP_FILE_NAME, parents: ['appDataFolder'] };

  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    JSON.stringify(metadata),
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    snapshotJson,
    `--${boundary}--`,
    '',
  ].join('\r\n');

  const method = fileId ? 'PATCH' : 'POST';
  const url = fileId
    ? `${GOOGLE_DRIVE_UPLOAD_URL}/${fileId}?uploadType=multipart&fields=id,modifiedTime,name`
    : `${GOOGLE_DRIVE_UPLOAD_URL}?uploadType=multipart&fields=id,modifiedTime,name`;

  const response = await fetch(url, {
    method,
    headers: {
      ...getDriveHeaders(accessToken),
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  const payload = await readJsonResponse<{ id?: string }>(response);
  if (!payload.id) {
    throw new Error('Google Drive did not return a file id');
  }

  return payload.id;
};

const upsertLocalSnapshotToDrive = async (accessToken: string, snapshotJson: string): Promise<string> => {
  const fileId = await findBackupFileId(accessToken);
  return uploadBackupSnapshot(accessToken, snapshotJson, fileId);
};

const getCachedConnection = (): GoogleDriveConnection | null => {
  if (cachedConnection) return cachedConnection;

  const storage = getSafeSessionStorage();
  if (!storage) return null;

  const raw = storage.getItem(CONNECTION_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as GoogleDriveConnection;
    if (!parsed.accessToken || !parsed.user || !parsed.connectedAt) return null;
    cachedConnection = parsed;
    return parsed;
  } catch {
    return null;
  }
};

const persistConnection = (connection: GoogleDriveConnection): void => {
  cachedConnection = connection;
  const storage = getSafeSessionStorage();
  storage?.setItem(CONNECTION_STORAGE_KEY, JSON.stringify(connection));
  window.dispatchEvent(new CustomEvent(GOOGLE_DRIVE_EVENT));
};

const markConnectionSynced = (connection: GoogleDriveConnection): GoogleDriveConnection => {
  const updated = {
    ...connection,
    lastSyncedAt: new Date().toISOString(),
  };
  persistConnection(updated);
  return updated;
};

export const clearGoogleDriveConnection = (): void => {
  cachedConnection = null;
  const storage = getSafeSessionStorage();
  storage?.removeItem(CONNECTION_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(GOOGLE_DRIVE_EVENT));
};

export const reconnectGoogleDrive = async (): Promise<GoogleDriveConnection> => {
  clearGoogleDriveConnection();
  return connectGoogleDrive('consent');
};

export const subscribeGoogleDriveUpdates = (listener: () => void): (() => void) => {
  window.addEventListener(GOOGLE_DRIVE_EVENT, listener);
  return () => window.removeEventListener(GOOGLE_DRIVE_EVENT, listener);
};

export const connectGoogleDrive = async (prompt: '' | 'consent' | 'select_account' = 'consent'): Promise<GoogleDriveConnection> => {
  const accessToken = await requestAccessToken(prompt);
  const user = await fetchUserInfo(accessToken);
  const connection: GoogleDriveConnection = {
    accessToken,
    user,
    connectedAt: new Date().toISOString(),
  };

  persistConnection(connection);
  return connection;
};

export const getGoogleDriveConnection = (): GoogleDriveConnection | null => getCachedConnection();

export const syncGoogleDriveBackup = async (
  connection = getCachedConnection()
): Promise<GoogleDriveSyncResult> => {
  const activeConnection = connection ?? await connectGoogleDrive('');
  const snapshotJson = await exportCloudSyncSnapshot();
  const localSnapshot = await createLocalCloudSyncSnapshot();
  const fileId = await findBackupFileId(activeConnection.accessToken);

  if (!fileId) {
    const createdFileId = await uploadBackupSnapshot(activeConnection.accessToken, snapshotJson);
    return {
      connection: markConnectionSynced(activeConnection),
      fileId: createdFileId,
      action: 'uploaded',
      snapshot: localSnapshot,
    };
  }

  const remoteSnapshot = await downloadBackupSnapshot(activeConnection.accessToken, fileId);
  const chosen = chooseCloudSyncSnapshot(localSnapshot, remoteSnapshot);

  if (chosen.localWins) {
    await uploadBackupSnapshot(activeConnection.accessToken, snapshotJson, fileId);
    return {
      connection: markConnectionSynced(activeConnection),
      fileId,
      action: 'uploaded',
      snapshot: localSnapshot,
    };
  }

  await restoreCloudSyncSnapshot(remoteSnapshot);
  return {
    connection: markConnectionSynced(activeConnection),
    fileId,
    action: 'downloaded',
    snapshot: remoteSnapshot,
  };
};

export const backupLocalSnapshotToGoogleDrive = async (
  connection = getCachedConnection()
): Promise<GoogleDriveSyncResult> => {
  const activeConnection = connection ?? await connectGoogleDrive('consent');
  const snapshotJson = await exportCloudSyncSnapshot();
  const fileId = await upsertLocalSnapshotToDrive(activeConnection.accessToken, snapshotJson);
  const localSnapshot = await createLocalCloudSyncSnapshot();

  return {
    connection: markConnectionSynced(activeConnection),
    fileId,
    action: 'uploaded',
    snapshot: localSnapshot,
  };
};

export const restoreLatestGoogleDriveBackup = async (
  connection = getCachedConnection()
): Promise<GoogleDriveSyncResult> => {
  const activeConnection = connection ?? await connectGoogleDrive('consent');
  const fileId = await findBackupFileId(activeConnection.accessToken);

  if (!fileId) {
    throw new Error('No Google Drive backup found yet');
  }

  const remoteSnapshot = await downloadBackupSnapshot(activeConnection.accessToken, fileId);
  await restoreCloudSyncSnapshot(remoteSnapshot);

  return {
    connection: activeConnection,
    fileId,
    action: 'downloaded',
    snapshot: remoteSnapshot,
  };
};

export const createGoogleDriveBackupJson = async (): Promise<string> => exportCloudSyncSnapshot();

export const getGoogleDriveDeviceId = (): string => getCloudSyncDeviceId();
