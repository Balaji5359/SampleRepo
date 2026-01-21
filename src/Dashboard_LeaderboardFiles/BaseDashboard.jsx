import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

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
    const [showPremiumModal, setShowPremiumModal] = useState(false);
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

    const handleAnalyticsClick = () => {
        if (userType !== 'premium') {
            setShowPremiumModal(true);
        } else {
            setActiveSection('analytics');
        }
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
                            className="action-btn history-btn"
                            onClick={() => setActiveSection('history')}
                        >
                            <span className="btn-icon">📊</span>
                            History
                        </button>
                        <button 
                            className={`action-btn analytics-btn ${userType !== 'premium' ? 'locked' : ''}`}
                            onClick={handleAnalyticsClick}
                            style={{
                                position: 'relative',
                                opacity: userType !== 'premium' ? 0.6 : 1,
                                cursor: userType !== 'premium' ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <span className="btn-icon">📈</span>
                            Analytics
                            {userType !== 'premium' && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    background: '#ef4444',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px'
                                }}>
                                    🔒
                                </span>
                            )}
                        </button>
                    </div>
                    
                    {React.cloneElement(children, { 
                        activeSection, 
                        userType, 
                        testType: apiTestType,
                        userEmail 
                    })}
                </div>
            </div>

            {/* Premium Modal */}
            {showPremiumModal && (
                <div className="modal-overlay" onClick={() => setShowPremiumModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>🔒 Premium Feature</h3>
                            <button className="close-btn" onClick={() => setShowPremiumModal(false)}>×</button>
                        </div>
                        <div className="modal-body" style={{ textAlign: 'center', padding: '30px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '20px' }}>👑</div>
                            <h2 style={{ color: '#f59e0b', marginBottom: '15px' }}>Upgrade to Premium</h2>
                            <p style={{ marginBottom: '25px', color: '#666' }}>
                                Analytics features are available for Premium users only. 
                                Upgrade now to unlock detailed insights and advanced analytics!
                            </p>
                            <button 
                                style={{
                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 30px',
                                    borderRadius: '25px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
                                }}
                                onClick={() => {
                                    // Navigate to premium upgrade page
                                    window.open('/premium-upgrade', '_blank');
                                }}
                            >
                                Buy Premium 💎
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BaseDashboard;