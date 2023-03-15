import React from 'react';

const Card = ({ card }) => {
  return (
    <div className={`card ${card.hidden ? 'hidden' : ''}`}>
      {card.hidden ? '' : `${card.rank}${card.suit}`}
    </div>
  );
};

export default Card;
