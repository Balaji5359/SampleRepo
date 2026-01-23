import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard-styles.css';
import Header from '../components/Header';

function Dashboard() {
    const navigate = useNavigate();
    const [theme, setTheme] = useState('light');
    const [apiData, setApiData] = useState({});
    const [loading, setLoading] = useState(false);
    const [userEmail] = useState(localStorage.getItem('email'));
    const [dashboardStats, setDashboardStats] = useState({ testCount: 0, avgScore: 0 });
    const [userType, setUserType] = useState('free');
    const [streakData, setStreakData] = useState({ current_streak: 0 });
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    const interviewActivities = [
        {
            id: 'interview-basic',
            title: 'Basic Interview Skills',
            description: 'Master fundamental interview communication skills',
        },
        {
            id: 'interview-advanced', 
            title: 'Advanced Interview Skills',
            description: 'Advanced interview techniques and complex scenarios',
        }
    ];

    const activities = [
        {
            id: 'jam',
            title: 'JAM Sessions',
            icon: <img src="https://cdn2.iconfinder.com/data/icons/timer-flat/64/timer-11-512.png" alt="timer" className="dashboard-activity-icon-img" />
        },
        {
            id: 'pronunciation',
            title: 'Pronunciation Test',
            icon: <img src="https://cdn1.iconfinder.com/data/icons/miscellaneous-306-solid/128/accent_pronunciation_talk_pronouncing_diction_parlance_language-128.png" alt="pronunciation" className="dashboard-activity-icon-img" />
        },
        {
            id: 'listening',
            title: 'Listening Test',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="dashboard-activity-icon-svg" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 13a9 9 0 0118 0v4a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3" />
                    <path d="M7 13v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4" opacity="0.9"/>
                    <path d="M21 10a7 7 0 00-18 0" />
                </svg>
            )
        },
        {
            id : 'situational',
            title: 'Situational Speaking',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="dashboard-activity-icon-svg" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label="situational speaking">
                    <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    <path d="M7 8h8M7 12h5" />
                </svg>
            )
        },
        {
            id: 'image-speak',
            title: 'Image-Based Speaking',
            icon: <img src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-128.png" alt="image" className="dashboard-activity-icon-img" />
        }
    ];

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

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!userEmail) return;
            
            setLoading(true);
            try {
                const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/comm-test-send-results', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ college_email: userEmail })
                });
                
                const data = await response.json();
                const dashboardData = JSON.parse(data.body).dashboard;
                setApiData(dashboardData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
            setLoading(false);
        };
        
        fetchDashboardData();
    }, [userEmail]);

    const getTestStats = (activityId) => {
        const testMap = {
            'jam': 'jam_test',
            'pronunciation': 'pronu_test', 
            'listening': 'listen_test',
            'situational': 'situation_test',
            'image-speak': 'image_speak'
        };
        
        const testData = apiData[testMap[activityId]];
        if (!testData || !testData.levels) {
            return { 
                basicAvgScore: '0', basicTestCount: 0,
                intermediateAvgScore: '0', intermediateTestCount: 0,
                advancedAvgScore: '0', advancedTestCount: 0,
                trend: [] 
            };
        }

        const basicLevel = testData.levels.basic || { avgScore: 0, attempts: 0 };
        const intermediateLevel = testData.levels.intermediate || { avgScore: 0, attempts: 0 };
        const advancedLevel = testData.levels.advanced || { avgScore: 0, attempts: 0 };
        const trendScores = testData.trend ? testData.trend.map(item => item.score) : [];
        
        return {
            basicAvgScore: basicLevel.avgScore?.toFixed(1) || '0',
            basicTestCount: basicLevel.attempts || 0,
            intermediateAvgScore: intermediateLevel.avgScore?.toFixed(1) || '0',
            intermediateTestCount: intermediateLevel.attempts || 0,
            advancedAvgScore: advancedLevel.avgScore?.toFixed(1) || '0',
            advancedTestCount: advancedLevel.attempts || 0,
            trend: trendScores
        };
    };

    const handleAnalyticsClick = (activity) => {
        if (userType !== 'premium') {
            setShowPremiumModal(true);
        } else {
            const routes = {
                'jam': '/student-dashboard/jam',
                'pronunciation': '/student-dashboard/pronunciation', 
                'listening': '/student-dashboard/listening',
                'situational': '/student-dashboard/situationspeak',
                'image-speak': '/student-dashboard/imagespeak'
            };
            navigate(routes[activity.id]);
        }
    };

    const renderMiniChart = (trend) => {
        if (!trend || trend.length === 0) return null;
        
        const validTrend = trend.filter(score => !isNaN(score) && score > 0);
        if (validTrend.length === 0) return null;
        
        const max = Math.max(...validTrend);
        if (max === 0) return null;
        
        const points = validTrend.map((score, index) => {
            const x = validTrend.length === 1 ? 50 : (index / (validTrend.length - 1)) * 100;
            const y = 100 - (score / max) * 80;
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg className="mini-chart" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                    points={points}
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    };

    return (
        <div className={`dashboard-main ${userType === 'premium' ? 'premium-bg' : 'free-bg'}`}>
            <Header />
            
            <div className="dashboard-content">  
                <center>
                    <h1 className="dashboard-title">Communication Dashboard</h1>
                </center>              
                <div className="dashboard-activities-grid">
                    {activities.map((activity) => {
                        const stats = getTestStats(activity.id);
                        return (
                            <div key={activity.id} className="dashboard-activity-card">
                                <div className="dashboard-activity-header">
                                    <div className="dashboard-activity-icon">
                                        {activity.icon}
                                    </div>
                                    <h3 className="dashboard-activity-title">{activity.title}</h3>
                                </div>
                                
                                <div className="dashboard-activity-stats">
                                    <div className="dashboard-stats-text">
                                        <div style={{fontSize: '13px', marginBottom: '4px', color: '#333'}}>Basic-Avg Score: {loading ? '...' : stats.basicAvgScore}</div>
                                        <div style={{fontSize: '13px', marginBottom: '4px', color: '#333'}}>Intermed-Avg Score: {loading ? '...' : stats.intermediateAvgScore}</div>
                                        <div style={{fontSize: '13px', marginBottom: '4px', color: '#333'}}>Advance-Avg Score: {loading ? '...' : stats.advancedAvgScore}</div>
                                        <div style={{fontSize: '13px', marginBottom: '4px', color: '#666'}}>Basic Test Count: {loading ? '...' : stats.basicTestCount}</div>
                                        <div style={{fontSize: '13px', marginBottom: '4px', color: '#666'}}>Intermed Test Count: {loading ? '...' : stats.intermediateTestCount}</div>
                                        <div style={{fontSize: '13px', marginBottom: '4px', color: '#666'}}>Advance Test Count: {loading ? '...' : stats.advancedTestCount}</div>
                                    </div>
                                    {stats.trend.length > 0 && (
                                        <div className="dashboard-mini-chart">
                                            {renderMiniChart(stats.trend)}
                                        </div>
                                    )}
                                </div>
                                
                                <button 
                                    onClick={() => handleAnalyticsClick(activity)}
                                    className={`dashboard-view-button ${userType !== 'premium' ? 'premium-locked' : ''}`}
                                >
                                    View Detailed Dashboard →
                                    {userType !== 'premium' && (
                                        <span className="dashboard-premium-lock">🔒</span>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
                
                <h1 className="dashboard-interview-title">Interview Skills Dashboard</h1>
                
                <div className="dashboard-interview-grid">
                    {interviewActivities.map((activity) => (
                        <div key={activity.id} className="dashboard-interview-card">
                            <div className="dashboard-interview-header">
                                <div className="dashboard-interview-icon">
                                    {activity.icon}
                                </div>
                                <h3 className="dashboard-interview-card-title">{activity.title}</h3>
                            </div>
                            
                            <p className="dashboard-interview-description">{activity.description}</p>
                            
                            <button 
                                onClick={() => navigate('/test')}
                                className="dashboard-interview-button"
                            >
                                View Interview Tests →
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            
            {showPremiumModal && (
                <div className="modal-overlay" onClick={() => setShowPremiumModal(false)}>
                    <div className="premium-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="premium-modal-header">
                            <h3>🔒 Premium Feature</h3>
                            <button className="close-btn" onClick={() => setShowPremiumModal(false)}>×</button>
                        </div>
                        <div className="premium-modal-body">
                            <div className="premium-modal-icon">👑</div>
                            <h2 className="premium-modal-title">Upgrade to Premium</h2>
                            <p className="premium-modal-text">
                                Detailed Analytics are available for Premium users only. 
                                Upgrade now to unlock advanced insights and analytics!
                            </p>
                            <button 
                                className="premium-modal-button"
                                onClick={() => {
                                    navigate('/profiledata');
                                }}
                            >
                                Buy Premium 📎
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;