import { Exercise, ProTip } from '../models/types';

// Real exercise images from Unsplash - high quality fitness photography
const IMAGES = {
  // Upper Back
  catCow: '/exercise/cat-cow/Fitness_Gif-1500x1000-catcow-5c5c85cac9e77c0001566641.gif',
  threadNeedle: '/exercise/thread-needle/Thread-the-Needle-Pose-for-Pose-Pge-e1574899766929.jpeg',
  shoulderSqueeze: '/exercise/shoulder-squeeze/scapular-squeeze-carole-rest.png',
  thoracicExtension: '/exercise/thoracic-extension/thoracic-extension.png',
  wallAngels: '/exercise/wall-angels/maxresdefault.jpg',

  // Lower Back
  childPose: '/exercise/child-pose/child-pose.png',
  kneeToChest: '/exercise/knee-to-chest/istockphoto-1134840963-612x612.jpg',
  pelvicTilt: '/exercise/pelvic-tilt/pelvic-tilt.png',
  supineTwist: '/exercise/supine-twist/Verywell-20-4023748-SpinalTwist01-1729-5995b536845b340010c016cf.gif',
  birdDog: '/exercise/bird-dog/bird-dog-exercise-1674234348.avif',

  // Core
  deadBug: '/exercise/dead-bug/dead-bug.webp',
  plank: '/exercise/plank/photo-1566241142559-40e1dab266c6.jpeg',
  gluteBridge: '/exercise/glute-bridge/glute-bridge.png',
  sidePlank: '/exercise/side-plank/woman-in-red-activewear-demonstrates-side-plank-exercise-on-white-background-arm-raised-video.jpg',
  crunch: '/exercise/crunch/crunch.png',
};

// YouTube video IDs for exercise tutorials (embed ready)
const VIDEOS = {
  catCow: 'https://www.youtube.com/embed/vuyUwtHl694?si=CxmZ8ztcC2fyP-5n',
  threadNeedle: 'https://www.youtube.com/embed/M8-bBGOilms?si=sXN0eHGGfIX6bokN',
  shoulderSqueeze: 'https://www.youtube.com/embed/UHlhyti-RBQ?si=lz4YgJV4619E4i1x',
  thoracicExtension: 'https://www.youtube.com/embed/2h33KDVoPII?si=-LzHQMVz_wAG75_b',
  wallAngels: 'https://www.youtube.com/embed/M_ooIhKYs7c',
  childPose: 'https://www.youtube.com/embed/2MJGg-dUKh0',
  kneeToChest: 'https://www.youtube.com/embed/o8gAyDUh2bs?si=sZFK0YCXByrUmFcV',
  pelvicTilt: 'https://www.youtube.com/embed/44D6Xc2Fkek?si=vjq0WaSeKyqr9_t7',
  supineTwist: 'https://www.youtube.com/embed/ezyMaQEaVaI?si=k4W9KqSIcHHhWcXP',
  birdDog: 'https://www.youtube.com/embed/wiFNA3sqjCA',
  deadBug: 'https://www.youtube.com/embed/I5xbsA71v1A',
  plank: 'https://www.youtube.com/embed/ASdvN_XEl_c',
  gluteBridge: 'https://www.youtube.com/embed/WtilA9IJX1c?si=oNeXCvz7B_jlGJi4',
  sidePlank: 'https://www.youtube.com/embed/K2VljzCC16g',
  crunch: 'https://www.youtube.com/embed/Xyd_fa5zoEU',
};

export const exercises: Exercise[] = [
  // UPPER BACK EXERCISES
  {
    id: 'cat-cow',
    name: 'Cat-Cow Stretch',
    description: 'A gentle flow between two poses that warms up the spine and relieves tension.',
    bodyArea: 'upper-back',
    category: 'stretch',
    difficulty: 'beginner',
    durationSeconds: 60,
    restSeconds: 15,
    instructions: [
      'Start on hands and knees in a tabletop position',
      'Inhale: Drop belly, lift head and tailbone (Cow)',
      'Exhale: Round spine, tuck chin to chest (Cat)',
      'Flow smoothly between positions',
      'Match movement to breath'
    ],
    proTips: [
      'Keep movements slow and controlled',
      'Focus on feeling each vertebra move',
      'Great as a morning wake-up stretch'
    ],
    imageUrl: IMAGES.catCow,
    videoUrl: VIDEOS.catCow,
    benefits: ['Improves spine flexibility', 'Reduces back tension', 'Promotes relaxation']
  },
  {
    id: 'thread-needle',
    name: 'Thread the Needle',
    description: 'A rotational stretch that opens up the upper back and shoulders.',
    bodyArea: 'upper-back',
    category: 'stretch',
    difficulty: 'beginner',
    durationSeconds: 45,
    restSeconds: 15,
    instructions: [
      'Start in tabletop position',
      'Slide right arm under body, palm up',
      'Rest right shoulder and temple on floor',
      'Hold and breathe deeply',
      'Return and repeat on left side'
    ],
    proTips: [
      'Keep hips level and stacked over knees',
      'Use top hand for support or reach overhead',
      'Breathe into the stretch'
    ],
    imageUrl: IMAGES.threadNeedle,
    videoUrl: VIDEOS.threadNeedle,
    benefits: ['Releases shoulder tension', 'Stretches thoracic spine', 'Improves rotation']
  },
  {
    id: 'shoulder-squeeze',
    name: 'Shoulder Blade Squeeze',
    description: 'Strengthens the muscles between your shoulder blades to improve posture.',
    bodyArea: 'upper-back',
    category: 'strength',
    difficulty: 'beginner',
    durationSeconds: 30,
    reps: 15,
    sets: 2,
    restSeconds: 20,
    instructions: [
      'Sit or stand with arms at sides',
      'Pull shoulders back and down',
      'Squeeze shoulder blades together',
      'Hold for 2-3 seconds',
      'Release and repeat'
    ],
    proTips: [
      'Imagine holding a pencil between shoulder blades',
      'Keep neck relaxed',
      'Do this hourly if you work at a desk'
    ],
    imageUrl: IMAGES.shoulderSqueeze,
    videoUrl: VIDEOS.shoulderSqueeze,
    benefits: ['Improves posture', 'Strengthens rhomboids', 'Reduces neck strain']
  },
  {
    id: 'thoracic-extension',
    name: 'Thoracic Extension',
    description: 'Opens up the upper back to counter forward hunching.',
    bodyArea: 'upper-back',
    category: 'mobility',
    difficulty: 'intermediate',
    durationSeconds: 45,
    restSeconds: 15,
    instructions: [
      'Sit on heels or in a chair',
      'Place hands behind head',
      'Gently arch upper back, looking up',
      'Hold for 3-5 seconds',
      'Return to neutral and repeat'
    ],
    proTips: [
      'Move from the upper back, not lower back',
      'Keep core lightly engaged',
      'Use a foam roller for deeper stretch'
    ],
    imageUrl: IMAGES.thoracicExtension,
    videoUrl: VIDEOS.thoracicExtension,
    benefits: ['Improves thoracic mobility', 'Reduces hunching', 'Opens chest']
  },
  {
    id: 'wall-angels',
    name: 'Wall Angels',
    description: 'A posture-correcting exercise that strengthens upper back muscles.',
    bodyArea: 'upper-back',
    category: 'posture',
    difficulty: 'intermediate',
    durationSeconds: 45,
    reps: 10,
    restSeconds: 20,
    instructions: [
      'Stand with back flat against wall',
      'Press lower back, shoulders, and head into wall',
      'Raise arms to goal post position against wall',
      'Slowly slide arms up and down',
      'Keep all contact points touching wall'
    ],
    proTips: [
      'If lower back arches, bend knees slightly',
      'Start with small range of motion',
      'This reveals shoulder mobility limitations'
    ],
    imageUrl: IMAGES.wallAngels,
    videoUrl: VIDEOS.wallAngels,
    benefits: ['Corrects rounded shoulders', 'Strengthens postural muscles', 'Improves awareness']
  },

  // LOWER BACK EXERCISES
  {
    id: 'child-pose',
    name: "Child's Pose",
    description: 'A restful pose that gently stretches the lower back and hips.',
    bodyArea: 'lower-back',
    category: 'stretch',
    difficulty: 'beginner',
    durationSeconds: 60,
    restSeconds: 15,
    instructions: [
      'Kneel on floor with toes together',
      'Sit back on heels',
      'Fold forward, extending arms in front',
      'Rest forehead on floor',
      'Breathe deeply and relax'
    ],
    proTips: [
      'Spread knees wider for more hip opening',
      'Use a pillow under forehead if needed',
      'Focus on elongating the spine'
    ],
    imageUrl: IMAGES.childPose,
    videoUrl: VIDEOS.childPose,
    benefits: ['Releases lower back tension', 'Calms the mind', 'Stretches hips']
  },
  {
    id: 'knee-to-chest',
    name: 'Knee to Chest Stretch',
    description: 'Gently stretches the lower back and glutes.',
    bodyArea: 'lower-back',
    category: 'stretch',
    difficulty: 'beginner',
    durationSeconds: 45,
    restSeconds: 15,
    instructions: [
      'Lie on your back with knees bent',
      'Pull one knee toward chest',
      'Hold behind thigh or shin',
      'Keep other foot flat or extended',
      'Hold, then switch sides'
    ],
    proTips: [
      'Keep shoulders relaxed on floor',
      'Breathe into the lower back',
      'Try pulling both knees in together'
    ],
    imageUrl: IMAGES.kneeToChest,
    videoUrl: VIDEOS.kneeToChest,
    benefits: ['Relieves lower back pain', 'Stretches glutes', 'Reduces stiffness']
  },
  {
    id: 'pelvic-tilt',
    name: 'Pelvic Tilt',
    description: 'Activates core muscles and gently mobilizes the lower spine.',
    bodyArea: 'lower-back',
    category: 'mobility',
    difficulty: 'beginner',
    durationSeconds: 30,
    reps: 15,
    restSeconds: 15,
    instructions: [
      'Lie on back with knees bent, feet flat',
      'Flatten lower back into floor by tilting pelvis',
      'Engage core muscles',
      'Hold for 2-3 seconds',
      'Release and repeat'
    ],
    proTips: [
      'Imagine pulling belly button to spine',
      'Keep breathing throughout',
      'Movement should be small and controlled'
    ],
    imageUrl: IMAGES.pelvicTilt,
    videoUrl: VIDEOS.pelvicTilt,
    benefits: ['Strengthens core', 'Improves pelvic control', 'Reduces back strain']
  },
  {
    id: 'supine-twist',
    name: 'Supine Spinal Twist',
    description: 'A relaxing twist that stretches the lower back and improves rotation.',
    bodyArea: 'lower-back',
    category: 'stretch',
    difficulty: 'beginner',
    durationSeconds: 60,
    restSeconds: 15,
    instructions: [
      'Lie on back with arms out to sides',
      'Bring knees to chest',
      'Lower both knees to one side',
      'Turn head opposite direction',
      'Hold and breathe, then switch sides'
    ],
    proTips: [
      'Keep shoulders grounded',
      'Use gravity, don\'t force the stretch',
      'Great before bed for relaxation'
    ],
    imageUrl: IMAGES.supineTwist,
    videoUrl: VIDEOS.supineTwist,
    benefits: ['Releases spinal tension', 'Improves rotation', 'Stretches obliques']
  },
  {
    id: 'bird-dog',
    name: 'Bird Dog',
    description: 'A stability exercise that strengthens the lower back and core.',
    bodyArea: 'lower-back',
    category: 'strength',
    difficulty: 'intermediate',
    durationSeconds: 45,
    reps: 10,
    restSeconds: 20,
    instructions: [
      'Start in tabletop position',
      'Extend right arm forward, left leg back',
      'Keep hips and shoulders level',
      'Hold for 2-3 seconds',
      'Return and alternate sides'
    ],
    proTips: [
      'Move slowly to challenge balance',
      'Keep core engaged throughout',
      'Imagine balancing a cup on your back'
    ],
    imageUrl: IMAGES.birdDog,
    videoUrl: VIDEOS.birdDog,
    benefits: ['Builds core stability', 'Strengthens back extensors', 'Improves balance']
  },

  // CORE EXERCISES
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    description: 'A core stability exercise that protects the lower back.',
    bodyArea: 'core',
    category: 'strength',
    difficulty: 'beginner',
    durationSeconds: 45,
    reps: 10,
    restSeconds: 20,
    instructions: [
      'Lie on back with arms reaching to ceiling',
      'Lift legs to 90-degree angle',
      'Lower opposite arm and leg toward floor',
      'Keep lower back pressed to floor',
      'Return and alternate sides'
    ],
    proTips: [
      'Move slowly and with control',
      'Exhale as you extend',
      'Stop if lower back arches'
    ],
    imageUrl: IMAGES.deadBug,
    videoUrl: VIDEOS.deadBug,
    benefits: ['Strengthens deep core', 'Protects spine', 'Improves coordination']
  },
  {
    id: 'plank',
    name: 'Forearm Plank',
    description: 'The classic core strengthener that builds overall stability.',
    bodyArea: 'core',
    category: 'strength',
    difficulty: 'intermediate',
    durationSeconds: 30,
    restSeconds: 30,
    instructions: [
      'Start on forearms and toes',
      'Align body in straight line',
      'Engage core and glutes',
      'Keep neck neutral',
      'Hold position and breathe'
    ],
    proTips: [
      'Don\'t let hips sag or pike up',
      'Squeeze glutes for lower back support',
      'Start with shorter holds, build up'
    ],
    imageUrl: IMAGES.plank,
    videoUrl: VIDEOS.plank,
    benefits: ['Builds core endurance', 'Improves posture', 'Full body activation']
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    description: 'Strengthens glutes and hamstrings to support the lower back.',
    bodyArea: 'core',
    category: 'strength',
    difficulty: 'beginner',
    durationSeconds: 30,
    reps: 12,
    restSeconds: 20,
    instructions: [
      'Lie on back with knees bent, feet flat',
      'Press through heels to lift hips',
      'Squeeze glutes at the top',
      'Create straight line from shoulders to knees',
      'Lower slowly and repeat'
    ],
    proTips: [
      'Don\'t hyperextend the lower back',
      'Drive through heels, not toes',
      'Add a pause at the top for intensity'
    ],
    imageUrl: IMAGES.gluteBridge,
    videoUrl: VIDEOS.gluteBridge,
    benefits: ['Strengthens posterior chain', 'Reduces back pain', 'Improves hip mobility']
  },
  {
    id: 'side-plank',
    name: 'Side Plank',
    description: 'Targets the obliques and lateral stabilizers.',
    bodyArea: 'core',
    category: 'strength',
    difficulty: 'intermediate',
    durationSeconds: 30,
    restSeconds: 20,
    instructions: [
      'Lie on side with elbow under shoulder',
      'Stack feet or stagger them',
      'Lift hips to create straight line',
      'Reach top arm to ceiling',
      'Hold, then switch sides'
    ],
    proTips: [
      'Modify by dropping bottom knee',
      'Keep hips stacked, don\'t roll forward',
      'Engage core before lifting'
    ],
    imageUrl: IMAGES.sidePlank,
    videoUrl: VIDEOS.sidePlank,
    benefits: ['Strengthens obliques', 'Improves lateral stability', 'Balances core strength']
  },
  {
    id: 'crunch',
    name: 'Modified Crunch',
    description: 'A controlled crunch that targets the upper abdominals safely.',
    bodyArea: 'core',
    category: 'strength',
    difficulty: 'beginner',
    durationSeconds: 30,
    reps: 15,
    restSeconds: 15,
    instructions: [
      'Lie on back with knees bent',
      'Place hands behind head for support',
      'Lift shoulders off floor using abs',
      'Keep lower back pressed down',
      'Lower with control and repeat'
    ],
    proTips: [
      'Don\'t pull on your neck',
      'Focus on the squeeze, not the height',
      'Exhale as you lift'
    ],
    imageUrl: IMAGES.crunch,
    videoUrl: VIDEOS.crunch,
    benefits: ['Strengthens rectus abdominis', 'Improves core control', 'Safe for beginners']
  },
];

// Pro tips for motivation and education
export const proTips: ProTip[] = [
  {
    id: 'tip-1',
    title: 'Consistency Over Intensity',
    content: '10 minutes daily beats 1 hour once a week. Small, regular practice builds lasting strength and habits.',
    category: 'motivation'
  },
  {
    id: 'tip-2',
    title: 'Desk Break Reminder',
    content: 'Set a timer to stand and stretch every 30-45 minutes. Your spine needs regular movement to stay healthy.',
    category: 'lifestyle'
  },
  {
    id: 'tip-3',
    title: 'Breathe Into the Stretch',
    content: 'Deep breathing helps muscles relax and increases the effectiveness of stretches. Never hold your breath.',
    category: 'exercise'
  },
  {
    id: 'tip-4',
    title: 'Listen to Your Body',
    content: 'Sharp pain is a stop sign. Mild discomfort during stretching is normal, but pain is not. Adjust as needed.',
    category: 'exercise'
  },
  {
    id: 'tip-5',
    title: 'Posture Check',
    content: 'Ears over shoulders, shoulders over hips. Check your alignment several times throughout the day.',
    category: 'posture'
  },
  {
    id: 'tip-6',
    title: 'Sleep Position Matters',
    content: 'Side sleeping with a pillow between knees reduces spinal stress. Avoid sleeping on your stomach.',
    category: 'lifestyle'
  },
  {
    id: 'tip-7',
    title: 'Progress Takes Time',
    content: 'Spinal flexibility and core strength develop gradually. Celebrate small wins and trust the process.',
    category: 'motivation'
  },
  {
    id: 'tip-8',
    title: 'Morning Movement',
    content: 'Your spine is most vulnerable in the morning. Start with gentle movements before intense activity.',
    category: 'exercise'
  },
];

// Helper functions to filter exercises
export const getExercisesByArea = (area: string): Exercise[] =>
  exercises.filter(e => e.bodyArea === area);

export const getExercisesByDifficulty = (difficulty: string): Exercise[] =>
  exercises.filter(e => e.difficulty === difficulty);

export const getExercisesByCategory = (category: string): Exercise[] =>
  exercises.filter(e => e.category === category);

export const getRandomProTip = (): ProTip =>
  proTips[Math.floor(Math.random() * proTips.length)];
