import { useState, useEffect } from "react";
import "./dashboard-navbar.css";

function Login_Navbar({ onProfileClick }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userName, setUserName] = useState("");
    const [streakCount] = useState(7); // Mock streak data

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
        // Navigate to signup page
        window.location.href = "/signup";
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
                <div
                    className="navbar-logo"
                    onClick={goToProfile}
                    style={{ cursor: "pointer" }}
                >
                    <span className="logo-text">Skill Route</span>
                    <span className="logo-subtitle">Placement Preparation App</span>
                </div>

                <div className="mobile-menu-icon" onClick={toggleMenu}>
                    <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`}></i>
                </div>

                <div className={`nav-links ${menuOpen ? "open" : ""}`}>
                    <a
                        href="/profiledata"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        onClick={(e) => {
                            e.preventDefault();
                            document.body.style = "";
                            document.body.className = "";
                            window.location.href = "/profiledata";
                        }}
                    >
                        Home
                    </a>

                    <a
                        href="/test"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        onClick={(e) => {
                            e.preventDefault();
                            document.body.style = "";
                            document.body.className = "";
                            window.location.href = "/test";
                        }}
                    >
                        Test
                    </a>

                    <a
                        href="/practice"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        onClick={(e) => {
                            e.preventDefault();
                            document.body.style = "";
                            document.body.className = "";
                            window.location.href = "/practice";
                        }}
                    >
                        Practice
                    </a>

                    <a
                        href="/student-dashboard"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        onClick={(e) => {
                            e.preventDefault();
                            document.body.style = "";
                            document.body.className = "";
                            window.location.href = "/student-dashboard";
                        }}
                    >
                        Dashboard
                    </a>

                    <a
                        href="/student-leaderboard"
                        className="text-white bg-600 hover:bg-blue-700 transition-colors px-3 py-1 rounded-md font-medium"
                        onClick={(e) => {
                            e.preventDefault();
                            document.body.style = "";
                            document.body.className = "";
                            window.location.href = "/student-leaderboard";
                        }}
                        title="Leaderboard"
                    >
                        <i className="fas fa-trophy" style={{ marginRight: 6 }}></i>
                        Leaderboard
                    </a>
                </div>

                <div className="navbar-right">
                    <div className="streak-counter" title="Current streak">
                        <i className="fas fa-fire"></i>
                        <span className="streak-number">{streakCount}</span>
                    </div>

                    <div className="user-profile" onClick={onProfileClick} style={{ cursor: "pointer" }}>
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
                        <i className="fas fa-sign-out-alt" style={{ marginRight: 6 }}></i>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Login_Navbar;