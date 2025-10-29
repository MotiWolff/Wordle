# Wordle (React)

[![Node.js](https://img.shields.io/badge/node-%3E=18.0.0-brightgreen?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A polished, open‑source Wordle clone built with React and Vite. Includes responsive layout, on‑screen and physical keyboard input, flip/color animations, invalid‑word feedback, and an end‑game screen with basic stats.

## Demo
<!-- If you have a screenshot, add it here -->
<!-- ![Gameplay](demo.png) -->
TODO: add gameplay screenshot

## Features
- Wordle gameplay (6 tries, 5‑letter words)
- Tile flip and color reveal animations
- Physical keyboard and on‑screen keyboard
- Disabled/colored keyboard keys as you guess
- Snackbar warnings for invalid words
- Game Over screen (win/lose, attempts, restart)
- Simple stats persisted to localStorage (WIP)

## Tech Stack
- React (Vite)
- JavaScript/JSX
- Material UI (Snackbar, icons)
- Custom CSS
- ESLint/Prettier

## Getting Started

1) Install dependencies
```
npm install
```

2) Run the dev server
```
npm run dev
```
Open http://localhost:5173

3) Build for production
```
npm run build
```

4) Preview production build
```
npm run preview
```

## Project Structure
```
src/
  components/        # Board, Keyboard, Key, Letter, Help, GameOver
  contexts/          # AppContext provider
  hooks/             # useWordle (game state & logic)
  services/          # Words loader (word list & today’s word)
  App.jsx / App.css  # Root UI and styles
public/
README.md
```

## How to Play
- Guess the 5‑letter word in 6 tries.
- Each guess must be a valid word.
- Colors after submit:
  - Green: letter in the correct spot
  - Yellow: letter in the word, wrong spot
  - Gray: letter not in the word

## Credits / Collaborators
<!-- Add names and links as desired -->
<!-- Example: Moti Wolff ([@MotiWolff](https://github.com/MotiWolff)) -->

## License
MIT. See [LICENSE](LICENSE).
