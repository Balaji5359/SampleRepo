import React, { useState } from 'react';
import './practicefiles.css';

function Pronunciation() {
  const [messages, setMessages] = useState([
    { sender: 'AI', text: 'She sells seashells by the seashore.' }
  ]);
  const [userInput, setUserInput] = useState('');

  const handleSend = () => {
    if (userInput.trim()) {
      setMessages([...messages, { sender: 'You', text: userInput }]);
      setUserInput('');
    }
  };

  return (
    <div className="chat-container">
      <center>
      <h2>🗣️ Pronunciation Practice</h2>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.sender === 'AI' ? 'ai' : 'user'}`}>
            <span className="sender">{msg.sender}:</span>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
        {/* place it at center */}
      <div className="input-area" style={{ textAlign: 'center' }}>
        <center>
          <button onClick={handleSend}>🎙️Repeat</button>
        </center>
      </div>
      </center>
    </div>
  );
}

export default Pronunciation;
