import './App.css';
import Board from '@components/game/Board';
import Keyboard from '@components/keyboard/Keyboard';
import HelpButton from '@components/ui/HelpButton';
import LanguageSelector from '@components/ui/LanguageSelector';
import LeaderboardButton from '@components/ui/LeaderboardButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { AppContext } from '@contexts/AppContext';
import { useContext } from 'react';
import GameOver from '@components/game/GameOver';

// Root component: renders game UI
function App() {
  const { wordSet, gameOver, toast, hideToast, isLoading } =
    useContext(AppContext);

  return (
    <div className="App">
      <nav>
        <h1>Wordle</h1>
        <div className="nav-buttons">
          <LanguageSelector />
          <LeaderboardButton />
          <HelpButton />
        </div>
      </nav>
      {isLoading || wordSet.size === 0 ? (
        <div className="game">
          <div
            style={{ textAlign: 'center', marginTop: '2rem', color: '#fff' }}
          >
            Loading...
          </div>
        </div>
      ) : (
        <div className="game">
          <Board />
          {gameOver.gameOver ? <GameOver /> : <Keyboard />}
        </div>
      )}
      <Snackbar
        open={toast.open}
        autoHideDuration={1500}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          elevation={0}
          variant="standard"
          severity="warning"
          onClose={hideToast}
          sx={{
            fontWeight: 700,
            bgcolor: '#fff',
            color: '#000',
            borderRadius: 1,
            boxShadow: 3,
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
