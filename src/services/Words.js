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
  await fetch(wordBank).then((response) =>
    response.text().then((results) => {
      const wordArray = results
        .split(/\r?\n/) // handle Windows/Mac line endings
        .map((w) => w.trim())
        .filter(Boolean);
      wordSet = new Set(wordArray);
    })
  );

  return { wordSet };
};
