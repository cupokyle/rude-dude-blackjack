import React, { useState, useEffect } from 'react';
import Card from './Card';
import BlackjackAnimation from './BlackjackAnimation/BlackjackAnimation';
import RudeDude from './RudeDude'; // Import RudeDude component
import { createDeck, calculatePoints } from '../helpers/deck';

const GameBoard = () => {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameStatus, setGameStatus] = useState(''); // '', 'win', 'lose', 'draw'
  const [rudeMessage, setRudeMessage] = useState('');
  const [showBlackjackAnimation, setShowBlackjackAnimation] = useState(false);


  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (playerHand.length === 2 && calculatePoints(playerHand) === 21) {
      setTimeout(() => {
        setShowBlackjackAnimation(true);
        setTimeout(() => {
          setGameStatus('win');
        }, 2000); // Wait for the animation to complete before setting the game status to 'win'
      }, 100); // Brief delay for animation
    }
  }, [playerHand]);

  useEffect(() => {
    if (gameStatus !== '') {
      const newDealerHand = [...dealerHand];
      newDealerHand[1].hidden = false;
      setDealerHand(newDealerHand);
    }
  }, [gameStatus]);


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
        "Keep hitting, you'll just make it worse!",
        "You know hitting isn't always the answer, right?",
        "Desperate for a better hand? Good luck!",
      ],
      stand: [
        "Giving up already?",
        "Scared to hit, I see!",
        "That's it? I expected more.",
        "You're really banking on the dealer to bust, huh?",
        "Do you think standing will save you?",
        "Afraid of going over 21? I don't blame you.",
      ],
      jokes: [
        "Why did the player go broke?\n They kept betting their rent money on blackjack!",
        "I heard your love life is like your blackjack skills\n – always busting!",
        "Why are you so bad at blackjack?\n Even your dog could make better decisions!",
        "What's the difference between you and a deck of cards?\n A deck of cards doesn't live in their mom's basement!",
        "Why did the player keep losing?\n They thought the game was called 'BleakJack'!",
        "You must be great at your job\n – I assume it doesn't involve decision making!",
        "Why did the blackjack player bring a pencil and paper to the casino?\n They thought they could draw a better life!",
        "What do you and a blackjack table have in common?\n You both get dealt with!",
        "Why did the blackjack player go to jail?\n They couldn't stay out of the hole!",
        "What do you call a blackjack player who always loses?\n A regular!",
        "Why did the blackjack player always wear sunglasses?\n To hide the tears from their lonely nights!",
        "Did you know that playing blackjack and dating have something in common?\n You're terrible at both!",
      ],
      win: [
        "Ugh, you won this time, but I still don't like you.",
        "Congrats, you got lucky. Don't get used to it.",
        "Wow, you actually won. Even a blind squirrel finds a nut sometimes.",
        "You won, but you're still not cool.",
        "Fine, you won. But don't think it makes you special.",
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
      const playerPoints = calculatePoints(newPlayerHand);
      if (playerPoints > 21) {
        setGameStatus('lose');
      } else if (playerPoints === 21) {
        setShowBlackjackAnimation(true);
        setTimeout(() => {
          setGameStatus('win');
          // Display a win message from Rude Dude
          setRudeMessage(getRandomRudeMessage('win'));
          setTimeout(() => {
            setRudeMessage('');
          }, 4000);
        }, 2000); // Wait for the animation to complete before setting the game status to 'win'
      }
    }, animationDelay);
  
    // Only display rude messages when the game is still ongoing and the player didn't win
    if (Math.random() < 0.39 && !gameStatus && calculatePoints(newPlayerHand) !== 21) {
      setRudeMessage(getRandomRudeMessage('hit'));
  
      setTimeout(() => {
        setRudeMessage('');
      }, 4000);
    }
  }
  
  function handleRudeMessage(newGameStatus) {
    // Only display rude messages when the game is still ongoing and the player didn't win
    if (Math.random() < 0.39 && !gameStatus && newGameStatus !== 'win') {
      setRudeMessage(getRandomRudeMessage('stand'));
  
      setTimeout(() => {
        setRudeMessage('');
      }, 4000);
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

    // Show Blackjack animation if the player has a Blackjack at the start
    if (playerPoints === 21) {
      setTimeout(() => {
        setShowBlackjackAnimation(true);
      }, 2000); // Brief delay for animation
    }

    setTimeout(() => {
      let newGameStatus = '';
      if (dealerPoints > 21 || playerPoints > dealerPoints) {
        newGameStatus = 'win';
        // Display a win message from Rude Dude
        setRudeMessage(getRandomRudeMessage('win'));
        setTimeout(() => {
          setRudeMessage('');
        }, 4000);
      } else if (dealerPoints === playerPoints) {
        newGameStatus = 'draw';
      } else {
        newGameStatus = 'lose';
      }
  
      setGameStatus(newGameStatus);
      handleRudeMessage(newGameStatus); // Add this line to handle rude messages
    }, animationDelay);
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
        {gameStatus !== '' && <button onClick={startNewGame}>New Game</button>}
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
      {showBlackjackAnimation && (
        <BlackjackAnimation onAnimationEnd={() => setShowBlackjackAnimation(false)} />
      )}
    </div>
  );
};

export default GameBoard;

