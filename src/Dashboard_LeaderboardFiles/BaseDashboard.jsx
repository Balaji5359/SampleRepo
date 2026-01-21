import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import AdvancedDashboard from './AdvancedDashboard';

const BaseDashboard = ({ 
    testType, 
    testTitle, 
    testDescription,
    apiTestType,
    children 
}) => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('main');
    const [userType, setUserType] = useState('free');
    const [streakData, setStreakData] = useState({ current_streak: 0 });
    const [userEmail] = useState(localStorage.getItem('email'));

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
                    const userData = JSON.parse(profile.body);
                    const isPremium = userData?.user_type === 'premium' && userData?.premium_status === 'active';
                    setUserType(isPremium ? 'premium' : 'free');
                }
                
                if (streak?.body) {
                    const streakDataResult = JSON.parse(streak.body);
                    setStreakData(streakDataResult);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleAdvancedDashboard = () => {
        setActiveSection('advanced');
    };

    return (
        <div style={{ minHeight: '100vh' }}>
            <header className="header">
                <div className="header-content">
                    <div className="logo">
                        <span className="logo-text">Skill Route</span>
                        <div className="nav-links">
                            <a href="#" onClick={() => navigate('/student-dashboard')}>Back to Main Dashboard</a>
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
                            🔥{streakData.current_streak || 0}
                        </span>
                        <span style={{ 
                            marginRight: '15px', 
                            fontWeight: '600',
                            background: userType === 'premium' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : '#f8f9fa',
                            color: userType === 'premium' ? 'white' : '#6b7280',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: userType === 'premium' ? '2px solid #f59e0b' : '2px solid #e5e7eb',
                            fontSize: '0.9rem'
                        }}>
                            {userType === 'premium' ? '👑 Premium' : '🆓 Free'}
                        </span>
                    </div>
                </div>
            </header>
            
            <div style={{ padding: '20px', marginTop: '80px' }}>
                <div className="dashboard-main">
                    <div className="dashboard-header">
                        <h1>{testTitle} Dashboard</h1>
                        <p className="dashboard-subtitle">{testDescription}</p>
                    </div>
                    
                    <div className="dashboard-actions">
                        <button 
                            className="action-btn advanced-btn"
                            onClick={handleAdvancedDashboard}
                        >
                            <span className="btn-icon">⚡</span>
                            Advanced Dashboard
                        </button>
                    </div>
                    
                    {activeSection === 'advanced' ? (
                        <AdvancedDashboard 
                            testType={apiTestType}
                            userEmail={userEmail}
                            onBack={() => setActiveSection('main')}
                        />
                    ) : (
                        React.cloneElement(children, { 
                            activeSection, 
                            userType, 
                            testType: apiTestType,
                            userEmail 
                        })
                    )}
                </div>
            </div>


        </div>
    );
};

export default BaseDashboard;