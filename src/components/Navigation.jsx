import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', label: 'Home', icon: '🏠' },
        { path: '/test', label: 'Test', icon: '📝' },
        { path: '/practice', label: 'Practice', icon: '🎯' },
        { path: '/profile', label: 'Dashboard', icon: '📊' }
    ];

    return (
        <nav className="main-navigation">
            <div className="nav-container">
                <div className="nav-brand">
                    <Link to="/dashboard" className="brand-link">
                        <span className="brand-icon">🚀</span>
                        <span className="brand-text">Skill Route</span>
                    </Link>
                </div>
                
                <div className="nav-links">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="nav-profile">
                    <Link to="/profile" className="profile-link">
                        <div className="profile-avatar">
                            <span>U</span>
                        </div>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;