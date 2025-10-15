import React, { useState } from 'react';
import './practicefiles.css';

function TranslateSpeak() {
  const [translation, setTranslation] = useState('');
  const [recording, setRecording] = useState(false);
  const [score, setScore] = useState(92);

  const handleQuestComplete = () => {
    setRecording(true);
    // Add speech recognition or scoring logic here
  };

  return (
    <div className="translate-speak-container">
      <h1>🎯 Quest: Translate & Speak</h1>
      <p>This section is dedicated to practicing speaking through translation exercises.</p>

      <div className="challenge-section">
        <div className="challenge-box">
          <div className="challenge-header">From: Spanish → To: English</div>
          <p className="source-sentence">
            El rápido zorro marrón salta sobre el perro perezoso.
          </p>
          <input
            type="text"
            placeholder="Type your translation here to earn bonus points..."
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            className="translation-input"
          />
          <div className="speak-prompt">
            🎤 Speak your translation clearly!
          </div>
          <button className="quest-button" onClick={handleQuestComplete}>
            ▶️ COMPLETE QUEST!
          </button>
        </div>

        <div className="rewards-panel">
          <h3>🏆 Quest Rewards</h3>
          <p className="multiplier">SCORE MULTIPLIER: <span>1.5x</span></p>
          <ul className="achievements">
            <li>✅ Fluent Speaker: Achieved 90%+ clarity!</li>
            <li>✅ Quick Translator: Completed in under 30s!</li>
          </ul>
          <div className="score-box">
            <p>Overall Performance</p>
            <h2>{score} / 100</h2>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${score}%` }}></div>
            </div>
            <p className="rank-text">Progress towards next rank!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TranslateSpeak;
