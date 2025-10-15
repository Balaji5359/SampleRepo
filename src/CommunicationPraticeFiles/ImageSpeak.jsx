import React, { useState } from 'react';
import './practicefiles.css';

function ImageSpeak() {
  const [recording, setRecording] = useState(false);

  const handleRecording = () => {
    setRecording(true);
    // Add actual recording logic here
  };

  return (
    <div className="image-speak-container">
      <h1>🖼️ Image Speak Practice</h1>
      <p>This section is dedicated to practicing speaking using images.</p>

      <div className="image-speak-content">
        <div className="image-section">
          <img
            src="https://source.unsplash.com/featured/?city,street"
            alt="City street"
            className="practice-image"
          />
          <p className="instruction">
            Describe the image in as much detail as possible. You have 60 seconds.
          </p>
        </div>

        <div className="vocab-section">
          <h3>Vocabulary Brainstorm</h3>
          <input
            type="text"
            placeholder="Type or speak words related to the image..."
            className="vocab-input"
          />
          <div className="vocab-tags">
            {['Cityscape', 'Buildings', 'Cars', 'Street', 'Urban'].map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="timer-record">
        <div className="timer-box">
          <div className="time">01</div>
          <span>Minute</span>
        </div>
        <div className="timer-box">
          <div className="time">00</div>
          <span>Seconds</span>
        </div>
        <button className="record-btn" onClick={handleRecording}>
          🎤 Start Recording
        </button>
        <p className="status">
          Recording Status: {recording ? 'In Progress...' : 'Not Started'}
        </p>
      </div>

      <div className="feedback-section">
        <h3>Feedback</h3>
        <ul>
          <li><strong>Vocabulary:</strong> Good use of descriptive words.</li>
          <li><strong>Structure:</strong> Sentences are well-formed.</li>
          <li><strong>Fluency:</strong> Speech is clear and natural.</li>
        </ul>
      </div>
    </div>
  );
}

export default ImageSpeak;
