import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/shared-styles.css';
import './leaderboard-styles.css';
import Header from '../components/Header';

function Leaderboard() {
    const navigate = useNavigate();
    const [theme, setTheme] = useState('light');
    const [loading, setLoading] = useState(false);
    const [userEmail] = useState(localStorage.getItem('email'));

    useEffect(() => {
        const root = document.documentElement;
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        
        if (theme === 'light') {
            document.body.style.background = 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)';
            root.style.setProperty('--bg-primary', 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)');
            root.style.setProperty('--bg-secondary', '#ffffff');
            root.style.setProperty('--text-primary', '#1f2937');
            root.style.setProperty('--text-muted', '#6b7280');
            root.style.setProperty('--accent-blue', '#0ea5e9');
            root.style.setProperty('--border-color', 'rgba(0,0,0,0.1)');
            root.style.setProperty('--card-bg', 'rgba(255,255,255,0.8)');
        }
    }, [theme]);

    return (
        <div className="leaderboard-container">
            <Header />
            
            <div className="leaderboard-content">
                <div className="leaderboard-header">
                    <h1 className="leaderboard-title">Leaderboard</h1>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;