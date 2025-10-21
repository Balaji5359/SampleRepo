import React, { useState } from 'react';
import './practicefiles.css';

function JAMPractice() {
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([
        { sender: 'Agent', text: 'Hi there! Ready to begin your JAM practice?' },
        { sender: 'User', text: 'Yes, let’s go!' },
        { sender: 'Agent', text: 'Great! Describe a moment where you communicated effectively.' },
        { sender: 'User', text: 'During a team meeting, I clarified our goals and resolved confusion.' },
        { sender: 'Agent', text: 'Hi there! Ready to begin your JAM practice?' },
        { sender: 'User', text: 'Yes, let’s go!' },
        { sender: 'Agent', text: 'Great! Describe a moment where you communicated effectively.' },
        { sender: 'User', text: 'During a team meeting, I clarified our goals and resolved confusion.' },
        { sender: 'Agent', text: 'Hi there! Ready to begin your JAM practice?' },
        { sender: 'User', text: 'Yes, let’s go!' },
        { sender: 'Agent', text: 'Great! Describe a moment where you communicated effectively.' },
        { sender: 'User', text: 'During a team meeting, I clarified our goals and resolved confusion.' }
    ]);


    return (
        <div className="jam-practice-container">
            <div className="jam-practice-header">
                {/* Navigate Back to /pratice */}
                <button className='back-btn' onClick={() => window.location.href = '/practice'}>← Back</button>

                <h2>JAM Practice</h2>
                <div className="score-display">Score Earned: {Math.floor(Math.random() * 1000)}</div>
            </div>

            <div className="jam-conversation">
                {conversation.map((msg, index) => (
                    <div key={index} className={`jam-msg ${msg.sender.toLowerCase()}`}>
                        <strong>{msg.sender}:</strong> {msg.text}
                    </div>
                ))}
            </div>

            <div className="jam-input-section">
                <center>
                    <div className="jam-buttons">
                        <button className="jam-btn audio">🎙️ Audio Recording</button>
                        {/* Time box of 1:00 min */}
                        <button className='back-btn'>1:00 min</button>
                    </div>
                </center>
            </div>
        </div>
    );
}

export default JAMPractice;
