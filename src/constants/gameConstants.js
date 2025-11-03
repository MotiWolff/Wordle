// Game Configuration
export const WORD_LENGTH = 5;
export const MAX_ATTEMPTS = 6;

// Animation Timings (in milliseconds)
export const FLIP_ANIMATION_DELAY = 250;
export const FLIP_DURATION = 800;
export const COLOR_REVEAL_DELAY = 400;

// Letter States
export const LETTER_STATES = {
  CORRECT: 'correct',
  PRESENT: 'present',
  ABSENT: 'absent',
  EMPTY: 'empty',
};

// Game States
export const GAME_STATES = {
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
};

// Languages
export const LANGUAGES = {
  ENGLISH: 'english',
  HEBREW: 'hebrew',
};

// LocalStorage Keys
export const STORAGE_KEYS = {
  STATISTICS: 'wordleStatistics',
  LANGUAGE: 'wordleLanguage',
};
