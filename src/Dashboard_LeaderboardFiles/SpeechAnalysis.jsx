import React from 'react';

const SpeechAnalysis = ({ data }) => {
    if (!data) {
        return <p>No speech analysis data available</p>;
    }

    const ProgressBar = ({ label, value, color }) => (
        <div className="progress-item">
            <div className="progress-label">
                <span>{label}</span>
                <span>{value}%</span>
            </div>
            <div className="progress-bar">
                <div 
                    className="progress-fill"
                    style={{ 
                        width: `${value}%`, 
                        backgroundColor: color 
                    }}
                />
            </div>
        </div>
    );

    return (
        <div className="speech-analysis">
            <div className="analysis-grid">
                <div className="analysis-section">
                    <h5>JAM Analysis</h5>
                    <ProgressBar 
                        label="JAM Score" 
                        value={data.jam_score} 
                        color="#4CAF50" 
                    />
                </div>
                
                <div className="analysis-section">
                    <h5>Situation Handling</h5>
                    <ProgressBar 
                        label="Situation Score" 
                        value={data.situation_score} 
                        color="#2196F3" 
                    />
                </div>
                
                <div className="analysis-section">
                    <h5>Communication Metrics</h5>
                    <ProgressBar 
                        label="Fluency" 
                        value={data.fluency} 
                        color="#FF9800" 
                    />
                    <ProgressBar 
                        label="Clarity" 
                        value={data.clarity} 
                        color="#9C27B0" 
                    />
                </div>
            </div>
        </div>
    );
};

export default SpeechAnalysis;