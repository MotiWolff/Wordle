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
  await fetch(wordBank).then((response) =>
    response.text().then((results) => {
      const wordArray = results
        .split(/\r?\n/) // handle Windows/Mac line endings
        .map((w) => w.trim())
        .filter(Boolean);
      todaysWord = wordArray[Math.floor(Math.random() * wordArray.length)];
      wordSet = new Set(wordArray);
    })
  );

  return { wordSet, todaysWord };
};
