import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [userType, setUserType] = useState('free');
    const [streakData, setStreakData] = useState({ current_streak: 0 });
    const [profileData, setProfileData] = useState({});

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

    const baseBtn =
        "px-3 py-2 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors";

    const activeClass = "font-bold";

    return (
        <header className="header">
            <div className="header-content">
                <div className="header-left">
                    <span className="font-heading text-lg font-bold text-foreground"
                    style={{fontSize:"25px"}}
                    >Skill Route</span>
                    <button
                        onClick={() => navigate("/profiledata")}
                        className={`${baseBtn} ${isActive("/profiledata") ? activeClass : ""}`}
                    >
                        Home
                    </button>
                    <button
                        onClick={() => navigate("/test")}
                        className={`${baseBtn} ${isActive("/test") ? activeClass : ""}`}
                    >
                        Tests
                    </button>
                    <button
                        onClick={() => navigate("/practice")}
                        className={`${baseBtn} ${isActive("/practice") ? activeClass : ""}`}
                    >
                        Practices
                    </button>
                    <button
                        onClick={() => navigate("/interview")}
                        className={`${baseBtn} ${isActive("/interview") ? activeClass : ""}`}
                    >
                        Interview Hub
                    </button>
                    <button
                        onClick={() => navigate("/student-dashboard")}
                        className={`${baseBtn} ${isActive("/student-dashboard") ? activeClass : ""}`}
                    >
                        Dashboard
                    </button>
                </div>
                <div className="auth-buttons">
                    <span className="app-badge">🔥 {streakData.current_streak || 0}</span>
                    <span className={`app-badge ${userType === 'premium' ? 'badge-premium' : 'badge-free'}`}>
                        {userType === 'premium' ? '👑 Premium' : '🆓 Free'}
                    </span>
                    <span className="app-badge">{email}</span>
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
            </div>
        </header>
    );
}

export default Header;
