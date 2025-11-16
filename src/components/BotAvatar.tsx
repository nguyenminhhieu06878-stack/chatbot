import React from 'react';
import './BotAvatar.css';

const BotAvatar: React.FC = () => {
  return (
    <div className="bot-avatar">
      <div className="bot-head">
        <div className="graduation-cap">
          <div className="cap-top"></div>
          <div className="cap-body"></div>
          <div className="tassel"></div>
        </div>
        <div className="bot-face">
          <div className="bot-eyes">
            <div className="bot-eye"><div className="pupil"></div></div>
            <div className="bot-eye"><div className="pupil"></div></div>
          </div>
          <div className="bot-mouth"></div>
        </div>
      </div>
    </div>
  );
};

export default BotAvatar;

