import React from 'react';
import './App.css';
import GameBoard from './components/GameBoard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Rude Dude Blackjack</h1>
      </header>
      <GameBoard />
    </div>
  );
}

export default App;

