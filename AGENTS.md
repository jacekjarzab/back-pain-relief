# AGENTS.md - Coding Agent Guidelines for Back Pain Relief App

This document provides coding guidelines and project conventions for agentic coding assistants working on the Back Pain Relief mobile application.

## Project Overview
Ionic React TypeScript application for back pain relief exercises with mobile deployment via Capacitor.

## Build & Development Commands

### Core Commands
```bash
# Development server
npm run dev

# Build for production
npm run build

# Type checking (runs as part of build)
npx tsc --noEmit

# Linting
npm run lint

# Fix linting issues
npx eslint . --fix
```

### Testing Commands
```bash
# Run all unit tests
npm run test.unit

# Run unit tests in watch mode
npx vitest

# Run unit tests with coverage
npx vitest --coverage

# Run a specific test file
npx vitest src/components/ExerciseCard/ExerciseCard.test.tsx

# Run tests matching a pattern
npx vitest -t "exercise card"

# Run end-to-end tests
npm run test.e2e

# Run e2e tests in interactive mode
npx cypress open
```

### Mobile Development
```bash
# Build and sync for iOS
npx cap sync ios

# Build and sync for Android
npx cap sync android

# Open iOS project in Xcode
npx cap open ios

# Open Android project in Android Studio
npx cap open android

# Run on connected iOS device with live reload
npx cap run ios --livereload --external

# Clean iOS build artifacts
rm -rf ios/App/build ios/App/DerivedData
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Fix Capacitor dependency issues
npm install @capacitor/core@latest @capacitor/cli@latest
npm install @capacitor/app@latest @capacitor/haptics@latest @capacitor/keyboard@latest
npx cap sync ios
```

## Code Style Guidelines

### TypeScript Configuration
- **Strict mode enabled** - All type checking is strict
- **No implicit any** - All variables must be explicitly typed
- **ESNext target** with ES modules
- **JSX transform** set to `react-jsx`

### Import Organization
```typescript
// 1. React imports
import React from 'react';

// 2. External libraries (alphabetical)
import { IonCard, IonCardContent } from '@ionic/react';
import { motion } from 'framer-motion';

// 3. Internal imports by category
/* Context */
import { AppProvider } from './context/AppContext';

/* Pages */
import Dashboard from './pages/Dashboard';

/* Components */
import ExerciseCard from './components/ExerciseCard';

/* Models & Types */
import { Exercise, WorkoutExercise } from './models/types';

/* Services */
import { storageService } from './services/storage';

/* Utils */
import { formatDuration } from './utils/helpers';
```

### Component Structure
```typescript
interface ComponentNameProps {
  requiredProp: string;
  optionalProp?: number;
  onAction: () => void;
}

const ComponentName: React.FC<ComponentNameProps> = ({
  requiredProp,
  optionalProp,
  onAction,
}) => {
  // Component logic here

  return (
    // JSX here
  );
};

export default ComponentName;
```

### Naming Conventions
- **Components**: PascalCase (`ExerciseCard`, `WorkoutTimer`)
- **Files**: PascalCase for components (`ExerciseCard.tsx`), camelCase for utilities (`storage.ts`)
- **Variables/Functions**: camelCase (`userProgress`, `formatDuration`)
- **Types/Interfaces**: PascalCase (`UserProgress`, `ExerciseCardProps`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_PREFERENCES`)

### Type Definitions
```typescript
// Use interfaces for object shapes
export interface Exercise {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  // ... other properties
}

// Use types for unions and primitives
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// Use enums sparingly, prefer string unions
export type BodyArea = 'upper-back' | 'lower-back' | 'core' | 'full-back';
```

### Error Handling
```typescript
// Async operations with proper error handling
const loadUserData = async (): Promise<UserData> => {
  try {
    const data = await storageService.getUserData();
    return data;
  } catch (error) {
    console.error('Failed to load user data:', error);
    // Return default or throw meaningful error
    throw new Error('Unable to load user data. Please try again.');
  }
};

// Component error boundaries for UI stability
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}
```

### CSS and Styling
- **CSS Modules** with className imports
- **Ionic CSS utilities** for common styling needs
- **CSS custom properties** defined in `theme/variables.css`
- **Component-scoped styling** in same directory as component

```css
/* ExerciseCard.css */
.exercise-card {
  --border-radius: 12px;
  margin: 8px 0;
}

.exercise-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
}
```

### File Structure
```
src/
├── components/          # Reusable UI components
│   └── ExerciseCard/
│       ├── ExerciseCard.tsx
│       ├── ExerciseCard.css
│       └── index.ts
├── pages/              # Route-based page components
│   └── Dashboard/
│       ├── Dashboard.tsx
│       ├── Dashboard.css
│       └── index.ts
├── services/           # Business logic and external APIs
│   ├── storage.ts
│   └── notifications.ts
├── context/            # React context providers
│   └── AppContext.tsx
├── models/             # TypeScript type definitions
│   └── types.ts
├── utils/              # Utility functions
│   └── routineGenerator.ts
└── theme/              # Global styles and variables
    └── variables.css
```

## Testing Guidelines

### Unit Testing with Vitest
```typescript
// ExerciseCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ExerciseCard from './ExerciseCard';

const mockExercise: WorkoutExercise = {
  exercise: {
    id: '1',
    name: 'Cat-Cow Stretch',
    // ... other properties
  },
  completed: false,
};

describe('ExerciseCard', () => {
  it('renders exercise name', () => {
    render(
      <ExerciseCard
        workoutExercise={mockExercise}
        index={0}
      />
    );

    expect(screen.getByText('Cat-Cow Stretch')).toBeInTheDocument();
  });

  it('calls onComplete when complete button is clicked', () => {
    const mockOnComplete = jest.fn();
    render(
      <ExerciseCard
        workoutExercise={mockExercise}
        index={0}
        onComplete={mockOnComplete}
      />
    );

    const completeButton = screen.getByRole('button');
    fireEvent.click(completeButton);

    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Testing with Cypress
```typescript
// e2e/workout-flow.cy.ts
describe('Workout Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('completes a full workout', () => {
    // Navigate to workout page
    cy.get('[href="/workout"]').click();

    // Complete first exercise
    cy.contains('Complete').first().click();

    // Verify completion
    cy.get('.completed').should('be.visible');

    // Continue through workout...
  });
});
```

### Testing Best Practices
- **Test user behavior, not implementation details**
- **Use descriptive test names** that explain the behavior being tested
- **Mock external dependencies** (storage, notifications, etc.)
- **Test error states** and edge cases
- **Use `data-testid`** attributes for elements that need specific selection
- **Keep tests fast and isolated**

## Development Workflow

### Pre-commit Hooks
- **ESLint** runs automatically on staged files
- **TypeScript** type checking runs before build
- **Tests should pass** before committing

### Code Review Checklist
- [ ] TypeScript types are correct and complete
- [ ] ESLint passes with no warnings
- [ ] Unit tests cover new functionality
- [ ] Component follows established patterns
- [ ] CSS follows BEM or component-scoped naming
- [ ] Error handling is appropriate
- [ ] Performance considerations addressed

### Performance Considerations
- **Lazy load** route components
- **Memoize expensive calculations** with `useMemo`
- **Optimize re-renders** with `React.memo` for pure components
- **Use CSS transforms** instead of position changes for animations
- **Image optimization** with appropriate sizing and formats

### Mobile-Specific Guidelines
- **Touch targets** should be at least 44px
- **Gestures** should be intuitive and discoverable
- **Offline functionality** should be considered
- **Battery usage** should be optimized
- **Accessibility** features should be implemented

## Common Patterns

### Context Usage
```typescript
// AppContext.tsx
interface AppContextType {
  progress: UserProgress;
  updateProgress: (updates: Partial<UserProgress>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
```

### Service Layer Pattern
```typescript
// services/storage.ts
class StorageService {
  private storage: Storage | null = null;

  async init(): Promise<Storage> {
    if (this.storage) return this.storage;
    const storage = new Storage();
    this.storage = await storage.create();
    return this.storage;
  }

  async getData<T>(key: string): Promise<T | null> {
    const storage = await this.init();
    return storage.get(key);
  }
}

export const storageService = new StorageService();
```

This document should be updated as the project evolves and new patterns emerge.</content>
<parameter name="filePath">/Users/jacek/Sites/Back Pain Relief/back-pain-relief/AGENTS.md