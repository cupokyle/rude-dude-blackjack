import React from 'react';
import './BlackjackAnimation.css';

const BlackjackAnimation = ({ onAnimationEnd }) => {
  return (
    <div className="blackjack-animation" onAnimationEnd={onAnimationEnd}>
      <h1>Blackjack!</h1>
    </div>
  );
};

export default BlackjackAnimation;
