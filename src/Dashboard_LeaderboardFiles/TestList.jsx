import React from 'react';
import './advanced-dashboard.css';

const TestList = ({ tests, onTestClick }) => {
    const formatDate = (dateTimeString) => {
        if (!dateTimeString) return 'Not available';
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleDateString('en-IN');
        } catch (error) {
            return dateTimeString;
        }
    };

    const formatTime = (dateTimeString) => {
        if (!dateTimeString) return 'Not available';
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleTimeString('en-IN', { 
                hour12: true,
                hour: '2-digit',
                minute: '2-digit'
            }).replace(/am|pm/g, match => match.toUpperCase());
        } catch (error) {
            return dateTimeString;
        }
    };

    if (tests.length === 0) {
        return (
            <div className="no-tests">
                <p>No tests found</p>
            </div>
        );
    }

    return (
        <div className="test-list">
            <h3>Test History ({tests.length})</h3>
            <div className="test-grid">
                {tests.map((test, index) => (
                    <div 
                        key={test.sessionId || index}
                        className="test-card"
                        onClick={() => onTestClick(test)}
                    >
                        <div className="test-id">{test.sessionId}</div>
                        <div className="test-date">{formatDate(test.start_time)}</div>
                        <div className="test-time">{formatTime(test.start_time)} - {formatTime(test.end_time)}</div>
                        <div className="test-score">Score: {test.score || 'N/A'}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestList;