import React from 'react';

const AIFeedback = ({ feedback, userHistory }) => {
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'Not available';
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleString();
        } catch (error) {
            return dateTimeString;
        }
    };

    return (
        <div className="ai-feedback-section">
            <div className="feedback-grid">
                <div className="feedback-column">
                    <h5>🤖 AI Feedback</h5>
                    <div className="feedback-content">
                        {feedback ? (
                            <p>{feedback}</p>
                        ) : (
                            <p>No AI feedback available</p>
                        )}
                    </div>
                </div>
                
                <div className="history-column">
                    <h5>👤 Conversation History</h5>
                    <div className="history-timeline">
                        {userHistory && userHistory.length > 0 ? (
                            userHistory.map((item, index) => (
                                <div key={index} className="history-item">
                                    {item.user && (
                                        <div className="message user-message">
                                            <div className="message-label">User:</div>
                                            <div className="message-content">{item.user}</div>
                                        </div>
                                    )}
                                    {item.agent && (
                                        <div className="message agent-message">
                                            <div className="message-label">Agent:</div>
                                            <div className="message-content">{item.agent}</div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No conversation history available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIFeedback;