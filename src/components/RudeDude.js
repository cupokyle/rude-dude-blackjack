import React from 'react';
import './RudeDude.css';

const RudeDude = ({ message }) => {
  return (
    <div className="rude-dude">
      <div className="speech-bubble">{message}</div>
    </div>
  );
};

export default RudeDude;
