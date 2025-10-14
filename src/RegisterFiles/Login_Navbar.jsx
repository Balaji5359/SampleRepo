import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./dashboard-navbar.css";

function Login_Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userName, setUserName] = useState("");
    const [streakCount] = useState(7); // Mock streak data
    const navigate = useNavigate();

    useEffect(() => {
        // Get user email from localStorage
        const email = localStorage.getItem("email");
        if (email) {
            // Extract username from email
            const name = email.split('@')[0];
            setUserName(name);
        }
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem("email");
        // Reset body styles before logout
        document.body.style = "";
        document.body.className = "";
        // Force a complete page reload to restore original home page
        window.location.href = "/";
    };

    const goToProfile = () => {
        // Reset body styles before navigating to home
        document.body.style = "";
        document.body.className = "";
        // Navigate to home
        window.location.href = "/profiledata";
    };

    return (
        <nav className="skill-route-navbar">
            <div className="navbar-container">
                <div className="navbar-logo" onClick={goToProfile} style={{cursor: 'pointer'}}>
                    <span className="logo-text">Skill Route</span>
                    <span className="logo-subtitle">Placement Guidance App</span>
                </div>
                
                <div className="mobile-menu-icon" onClick={toggleMenu}>
                    <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </div>
                
                <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
                    <div 
                        className="nav-link active"
                        onClick={() => {
                            setMenuOpen(false);
                            goToProfile();
                        }}
                        style={{cursor: 'pointer'}}
                    >
                        <i className="fas fa-home"></i>
                        <span>Home</span>
                    </div>

                    <Link 
                        to="/tests" 
                        className="nav-link"
                        onClick={() => setMenuOpen(false)}
                    >
                        <i className="fas fa-clipboard-list"></i>
                        <span>Test</span>
                    </Link>

                    <Link 
                        to="/practice" 
                        className="nav-link"
                        onClick={() => setMenuOpen(false)}
                    >
                        <i className="fas fa-dumbbell"></i>
                        <span>Practice</span>
                    </Link>

                    <Link 
                        to="/profile" 
                        className="nav-link"
                        onClick={() => setMenuOpen(false)}
                    >
                        <i className="fas fa-user"></i>
                        <span>Profile</span>
                    </Link>
                </div>
                
                <div className="navbar-right">
                    <div className="streak-counter">
                        <i className="fas fa-fire"></i>
                        <span className="streak-number">{streakCount}</span>
                    </div>
                    
                    <div className="user-profile">
                        <div className="profile-avatar">
                            <i className="fas fa-user-circle"></i>
                        </div>
                        <span className="user-name">{userName || "User"}</span>
                    </div>
                    
                    <button 
                        className="logout-btn"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Login_Navbar;