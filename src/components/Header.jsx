import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import '../RegisterFiles/login.css';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [userType, setUserType] = useState('free');
    const [streakData, setStreakData] = useState({ current_streak: 0 });
    const [profileData, setProfileData] = useState({});
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedEmail = localStorage.getItem('email');
                if (!storedEmail) return;

                const [profileResponse, streakResponse] = await Promise.all([
                    fetch('https://ntjkr8rnd6.execute-api.ap-south-1.amazonaws.com/dev/student_profilecreate/student_profile_senddata', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ college_email: storedEmail })
                    }),
                    fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/update-user-streak', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            body: JSON.stringify({
                                college_email: storedEmail,
                                get_streak_data: true
                            })
                        })
                    })
                ]);

                const profile = await profileResponse.json();
                const streak = await streakResponse.json();

                if (profile?.body) {
                    const userData = typeof profile.body === "string" ? JSON.parse(profile.body) : profile.body;
                    setProfileData(userData);
                    setUserType(userData?.user_type === 'premium' && userData?.premium_status === 'active' ? 'premium' : 'free');
                }

                if (streak?.body) {
                    const streakDataResult = typeof streak.body === "string" ? JSON.parse(streak.body) : streak.body;
                    setStreakData(streakDataResult);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const email = profileData?.college_email || localStorage.getItem('email') || 'User';

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

    return (
        <header className="header glass border-b" style={{ borderColor: 'hsl(var(--border))' }}>
            <div className="header-content">
                <div className="header-left">
                    <div className="logo">
                        <span className="logo-text">Skill Route</span>
                    </div>
                    <nav className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
                        <button
                            onClick={() => {
                                navigate("/profiledata");
                                setMobileMenuOpen(false);
                            }}
                            className={`nav-link ${isActive("/profiledata") ? 'active' : ''}`}
                        >
                            Home
                        </button>
                        <button
                            onClick={() => {
                                navigate("/test");
                                setMobileMenuOpen(false);
                            }}
                            className={`nav-link ${isActive("/test") ? 'active' : ''}`}
                        >
                            Tests
                        </button>
                        <button
                            onClick={() => {
                                navigate("/practice");
                                setMobileMenuOpen(false);
                            }}
                            className={`nav-link ${isActive("/practice") ? 'active' : ''}`}
                        >
                            Practices
                        </button>
                        <button
                            onClick={() => {
                                navigate("/interview");
                                setMobileMenuOpen(false);
                            }}
                            className={`nav-link ${isActive("/interview") ? 'active' : ''}`}
                        >
                            Interview Hub
                        </button>
                        <button
                            onClick={() => {
                                navigate("/student-dashboard");
                                setMobileMenuOpen(false);
                            }}
                            className={`nav-link ${isActive("/student-dashboard") ? 'active' : ''}`}
                        >
                            Dashboard
                        </button>
                    </nav>
                </div>
                <div className="header-right">
                    <span className="badge primary">🔥 {streakData.current_streak || 0}</span>
                    <span className={`badge ${userType === 'premium' ? 'badge-premium' : 'badge-free'}`}>
                        {userType === 'premium' ? '👑 Premium' : '🆓 Free'}
                    </span>
                    <span className="badge">{email}</span>
                    <button 
                        className="btn-logout"
                        onClick={() => {
                            localStorage.removeItem('email');
                            navigate('/signup');
                        }}
                    >
                        Logout
                    </button>
                </div>
                <button 
                    className="menu-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </header>
    );
}

export default Header;