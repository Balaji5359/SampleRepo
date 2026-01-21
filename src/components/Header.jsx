import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './shared-styles.css';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [userType, setUserType] = useState('free');
    const [streakData, setStreakData] = useState({ current_streak: 0 });
    const [profileData, setProfileData] = useState(null);

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

    const getActiveClass = (path) => {
        return location.pathname === path ? 'active-nav' : '';
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <span className="logo-text">Skill Route</span>
                    <div className="nav-links">
                        <a href="#" onClick={() => navigate('/profiledata')} className={getActiveClass('/profiledata')}>Home</a>
                        <a href="#" onClick={() => navigate('/test')} className={getActiveClass('/test')}>Tests</a>
                        <a href="#" onClick={() => navigate('/practice')} className={getActiveClass('/practice')}>Practice</a>
                        <a href="#" onClick={() => navigate('/student-dashboard')} className={getActiveClass('/student-dashboard')}>Dashboard</a>
                        <a href="#" onClick={() => navigate('/student-leaderboard')} className={getActiveClass('/student-leaderboard')}>Leaderboard</a>
                    </div>
                </div>
                <div className="auth-buttons">
                    <span className="streak-badge">
                        🔥{streakData.current_streak || 0}
                    </span>
                    <span className={`user-type-badge ${userType === 'premium' ? 'premium' : 'free'}`}>
                        {userType === 'premium' ? '👑 Premium User' : '🆓 Free User'}
                    </span>
                    <span className="roll-badge">
                        {profileData?.roll_no || localStorage.getItem('email')?.slice(0, 10) || 'User'}
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
    );
}

export default Header;