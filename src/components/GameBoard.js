import React, { useState, useEffect } from 'react';
import Card from './Card';
import RudeDude from './RudeDude'; // Import RudeDude component
import { createDeck, calculatePoints } from '../helpers/deck';

const GameBoard = () => {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameStatus, setGameStatus] = useState(''); // '', 'win', 'lose', 'draw'
  const [rudeMessage, setRudeMessage] = useState('');

  useEffect(() => {
    startNewGame();
  }, []);

  function startNewGame() {
    const newDeck = createDeck();
    const newPlayerHand = [newDeck.pop(), newDeck.pop()];
    const newDealerHand = [newDeck.pop(), { ...newDeck.pop(), hidden: true }];
  
    setDeck(newDeck);
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setGameStatus('');
  }

  function displayHandTotal(hand) {
    const total = calculatePoints(hand);
    return `Total: ${total}`;
  }

  function getRandomRudeMessage(action) {
    const rudeMessages = {
      hit: [
        "Going for another card, huh?",
        "Oh, you need more help!",
        "Hit me? More like, hit yourself!",
      ],
      stand: [
        "Giving up already?",
        "Scared to hit, I see!",
        "That's it? I expected more.",
      ],
      jokes: [
        "Why did the player go broke? Because they bet their life on a game of blackjack!",
        "Why are you so bad at blackjack? Even a broken clock is right twice a day!",
        "What's the difference between you and a deck of cards? A deck of cards has a few aces!",
        "Why did the player keep losing? They thought the game was called 'BleakJack'!",
      ],
    };
  
    const actionMessages = rudeMessages[action];
    const jokeMessages = rudeMessages.jokes;
    const allMessages = [...actionMessages, ...jokeMessages];
  
    return allMessages[Math.floor(Math.random() * allMessages.length)];
  }
  

  function handleHit() {
    if (gameStatus) return;
    const newDeck = [...deck];
    const newPlayerHand = [...playerHand, newDeck.pop()];
    setDeck(newDeck);
    setPlayerHand(newPlayerHand);
  
    const maxCardIndex = Math.max(newPlayerHand.length, dealerHand.length);
    const animationDelay = (maxCardIndex + 1) * 250; // Convert delay to milliseconds
  
    setTimeout(() => {
      if (calculatePoints(newPlayerHand) > 21) {
        setGameStatus('lose');
      }
    }, animationDelay);
    if (Math.random() < 0.5) {
        setRudeMessage(getRandomRudeMessage('hit'));
    
        setTimeout(() => {
          setRudeMessage('');
        }, 3000);
      }
    }
  
  function handleStand() {
    if (gameStatus) return;
    let newDealerHand = [...dealerHand];
    let newDeck = [...deck];
    newDealerHand[1].hidden = false;
  
    while (calculatePoints(newDealerHand) < 17) {
      newDealerHand.push(newDeck.pop());
    }
  
    const playerPoints = calculatePoints(playerHand);
    const dealerPoints = calculatePoints(newDealerHand);
  
    setDealerHand(newDealerHand);
    setDeck(newDeck);
  
    // Calculate the maximum animation delay for cards
    const maxCardIndex = Math.max(playerHand.length, dealerHand.length);
    const animationDelay = (maxCardIndex + 1) * 250; // Convert delay to milliseconds
  
    setTimeout(() => {
      let newGameStatus = '';
      if (dealerPoints > 21 || playerPoints > dealerPoints) {
        newGameStatus = 'win';
      } else if (dealerPoints === playerPoints) {
        newGameStatus = 'draw';
      } else {
        newGameStatus = 'lose';
      }
  
      setGameStatus(newGameStatus);
    }, animationDelay);
    if (Math.random() < 0.5) {
        setRudeMessage(getRandomRudeMessage('stand'));
    
        setTimeout(() => {
          setRudeMessage('');
        }, 3000);
      }
    }
  
  

  return (
    <div className="game-board">
      <div className="dealer-section">
        <div className="dealer-label">
          Dealer's Hand {gameStatus && `(${displayHandTotal(dealerHand)})`}
        </div>
        <div className="dealer-hand">
          {dealerHand.map((card, index) => (
            <Card key={index} card={card} delay={index} />
          ))}
        </div>
      </div>
      <div className="player-section">
        <div className="player-label">
          Player's Hand ({displayHandTotal(playerHand)})
        </div>
        <div className="player-hand">
          {playerHand.map((card, index) => (
            <Card key={index} card={card} delay={index} />
          ))}
        </div>
      </div>
      <div className="buttons">
        <button onClick={startNewGame}>New Game</button>
        <button onClick={handleHit}>Hit</button>
        <button onClick={handleStand}>Stand</button>
      </div>
      {rudeMessage && <RudeDude message={rudeMessage} />}
      {gameStatus && (
        <div className={`game-result ${gameStatus}`}>
          {gameStatus === 'win' && 'You Win!'}
          {gameStatus === 'lose' && 'You Lose!'}
          {gameStatus === 'draw' && 'It\'s a Draw!'}
        </div>
      )}
    </div>
  );
};

export default GameBoard;

