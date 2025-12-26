import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

function Dashboard() {
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
        <div>
        <header className="header">
            <div className="header-content">
            <div className="logo">
                <span className="logo-text">Skill Route</span>
                <div className="nav-links">
                <a href="#" onClick={() => navigate('/profiledata')}>Home</a>
                <a href="#" onClick={() => navigate('/test')}>Tests</a>
                <a href="#" onClick={() => navigate('/practice')}>Practice</a>
                <a href="#" onClick={() => navigate('/student-dashboard')}>Dashboard</a>
                <a href="#" onClick={() => navigate('/student-leaderboard')}
                    
                                    style={{
                                    color:"#3B9797",
                                    fontWeight: "600",
                                    textDecoration: "none",
                                    paddingBottom: "6px",
                                    borderBottom: "2.5px solid #3B9797",
                                    cursor: "pointer",
                                }}
                >Leaderboard</a>
                </div>
            </div>
            <div className="auth-buttons">
                <span style={{ 
                                marginRight: '15px', 
                                fontWeight: '600',
                                background: 'linear-gradient(135deg, #3B9797, #2c7a7a)',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                fontSize: '0.9rem'
                            }}>
                                🔥0
                </span>
                <span style={{ 
                                marginRight: '15px', 
                                color: '#2c3e50', 
                                fontWeight: '600',
                                background: '#f8f9fa',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: '2px solid #3B9797',
                                fontSize: '0.9rem'
                            }}>
                                {localStorage.getItem('email')?.slice(0, 10) || 'User'}
                </span>
                <button 
                className="btn-signup"
                onClick={() => {
                    localStorage.removeItem('email');
                    navigate('/signup');
                }}
                >
                Logout
                </button>
            </div>
            </div>
        </header>
    </div>
    );
    }

export default Dashboard;