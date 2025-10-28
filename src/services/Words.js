import wordBank from "../wordle-bank.txt";
export const boardDefault = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

export const generateWordSet = async () => {
  let wordSet;
  let todaysWord;

  try {
    const response = await fetch(wordBank);

    if (!response.ok) {
      throw new Error(`Failed to fetch word bank: ${response.status}`);
    }

    const results = await response.text();
    const wordArray = results
      .split(/\r?\n/) // handle Windows/Mac line endings
      .map((w) => w.trim())
      .filter(Boolean);

    if (wordArray.length === 0) {
      throw new Error("Word bank is empty");
    }

    todaysWord = wordArray[Math.floor(Math.random() * wordArray.length)];
    wordSet = new Set(wordArray);
  } catch (error) {
    console.error("Error loading word bank:", error);
    throw error;
  }

  return { wordSet, todaysWord };
};
