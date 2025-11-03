// Keyboard Layouts for Different Languages

export const ENGLISH_KEYBOARD = {
  row1: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  row2: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  row3: ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
};

export const HEBREW_KEYBOARD = {
  row1: ['ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ'],
  row2: ['ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', 'ף'],
  row3: ['ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', 'ץ'],
};

// Special Keys
export const SPECIAL_KEYS = {
  ENTER: 'Enter',
  DELETE: 'Delete',
};

// Get keyboard layout based on language
export const getKeyboardLayout = language => {
  return language === 'hebrew' ? HEBREW_KEYBOARD : ENGLISH_KEYBOARD;
};
