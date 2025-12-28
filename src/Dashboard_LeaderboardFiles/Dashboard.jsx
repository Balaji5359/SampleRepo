import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(false);
  const [userEmail] = useState(localStorage.getItem('email'));
  const [dashboardStats, setDashboardStats] = useState({ testCount: 0, avgScore: 0 });

  const interviewActivities = [
    {
      id: 'interview-basic',
      title: 'Basic Interview Skills',
      description: 'Master fundamental interview communication skills',
      // icon: <span style={{ fontSize: '2rem' }}>🟢</span>
    },
    {
      id: 'interview-advanced', 
      title: 'Advanced Interview Skills',
      description: 'Advanced interview techniques and complex scenarios',
      // icon: <span style={{ fontSize: '2rem' }}>🔵</span>
    }
  ];

  const activities = [
    {
      id: 'jam',
      title: 'JAM Sessions',
      icon: <img src="https://cdn2.iconfinder.com/data/icons/timer-flat/64/timer-11-512.png" alt="timer" style={{ width: 50, height: 50 }} />
    },
    {
      id: 'pronunciation',
      title: 'Pronunciation Test',
      icon: <img src="https://cdn1.iconfinder.com/data/icons/miscellaneous-306-solid/128/accent_pronunciation_talk_pronouncing_diction_parlance_language-128.png" alt="pronunciation" style={{ width: 50, height: 50 }} />
    },
    {
      id: 'listening',
      title: 'Listening Test',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label="situational speaking">
          <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          <path d="M7 8h8M7 12h5" />
        </svg>
      )
    },
    {
      id: 'image-speak',
      title: 'Image-Based Speaking',
      icon: <img src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-128.png" alt="image" style={{ width: 50, height: 50 }} />
    },
    {
      id: 'image-story',
      title: 'Image-Based Story Telling',
      icon: <img src="https://cdn1.iconfinder.com/data/icons/language-courses-3/504/vocabulary-language-translate-studying-learn-128.png" alt="vocabulary" style={{ width: 50, height: 50 }} />
    }
  ];
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
    } else if (theme === 'custom') {
      document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      root.style.setProperty('--bg-primary', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
      root.style.setProperty('--bg-secondary', 'rgba(255,255,255,0.1)');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-muted', 'rgba(255,255,255,0.8)');
      root.style.setProperty('--accent-blue', '#fbbf24');
      root.style.setProperty('--border-color', 'rgba(255,255,255,0.2)');
      root.style.setProperty('--card-bg', 'rgba(255,255,255,0.1)');
    } else {
      document.body.style.background = 'linear-gradient(180deg, #071028 0%, #07182b 60%)';
      root.style.setProperty('--bg-primary', 'linear-gradient(180deg, #071028 0%, #07182b 60%)');
      root.style.setProperty('--bg-secondary', '#0b1220');
      root.style.setProperty('--text-primary', '#e6eef8');
      root.style.setProperty('--text-muted', '#94a3b8');
      root.style.setProperty('--accent-blue', '#60a5fa');
      root.style.setProperty('--border-color', 'rgba(255,255,255,0.06)');
      root.style.setProperty('--card-bg', 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))');
    }
  }, [theme]);

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
      'jam': 'jam',
      'pronunciation': 'pronunciation', 
      'listening': 'listening',
      'situational': 'situation',
      'image-speak': 'image_speak',
      'image-story': 'image_story'
    };
    
    const testData = apiData[testMap[activityId]];
    if (!testData) {
      return { avgScore: '0', testCount: 0, trend: [] };
    }

    return {
      avgScore: testData.avgScore?.toFixed(1) || '0',
      testCount: testData.tests || 0,
      trend: testData.trend || []
    };
  };

  const handleActivityClick = (activity) => {
    navigate('/test');
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
          stroke="var(--accent-blue)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

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
              <a href="#" onClick={() => navigate('/student-dashboard')}
                                style={{
                                color:"#3B9797",
                                fontWeight: "600",
                                textDecoration: "none",
                                paddingBottom: "6px",
                                borderBottom: "2.5px solid #3B9797",
                                cursor: "pointer",
                            }}>Dashboard</a>
              <a href="#" onClick={() => navigate('/student-leaderboard')}>Leaderboard</a>
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
      
      <div style={{ padding: '20px', marginTop: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '10px' }}>
            Communication Dashboard
          </h1>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '20px',
          maxWidth: '1200px',
          margin: '0 auto 40px auto'
        }}>
          {activities.map((activity) => {
            const stats = getTestStats(activity.id);
            return (
              <div 
                key={activity.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  border: '3px solid #0d8888ff',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ marginRight: '12px' }}>
                    {activity.icon}
                  </div>
                  <h3 style={{ 
                    fontSize: '1.3rem', 
                    color: '#2c3e50', 
                    margin: 0,
                    fontWeight: '600'
                  }}>
                    {activity.title}
                  </h3>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0d8888ff' }}>
                        {loading ? '...' : stats.avgScore}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>Avg Score</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0d8888ff' }}>
                        {loading ? '...' : stats.testCount}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>Tests</div>
                    </div>
                  </div>
                  {stats.trend.length > 0 && (
                    <div style={{ width: '60px', height: '30px' }}>
                      {renderMiniChart(stats.trend)}
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => {
                    const routes = {
                      'jam': '/student-dashboard/jam',
                      'pronunciation': '/student-dashboard/pronunciation', 
                      'listening': '/student-dashboard/listening',
                      'situational': '/student-dashboard/situationspeak',
                      'image-speak': '/student-dashboard/imagespeak',
                      'image-story': '/student-dashboard/imagestory'
                    };
                    navigate(routes[activity.id]);
                  }}
                  style={{
                    background: '#0d8888ff',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    width: '100%',
                    marginBottom: '8px'
                  }}
                >
                  View Detailed Dashboard →
                </button>
              </div>
            );
          })}
        </div>
        
        <h1 style={{ fontSize: '2rem', color: '#0d8888ff', marginBottom: '30px', textAlign: 'center' }}>
          Interview Skills Dashboard
        </h1>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '20px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {interviewActivities.map((activity) => (
            <div 
              key={activity.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                border: '3px solid #0d8888ff',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ marginRight: '12px' }}>
                  {activity.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.3rem', 
                  color: '#2c3e50', 
                  margin: 0,
                  fontWeight: '600'
                }}>
                  {activity.title}
                </h3>
              </div>
              
              <p style={{ 
                color: '#666', 
                marginBottom: '20px',
                lineHeight: '1.5'
              }}>
                {activity.description}
              </p>
              
              <button 
                onClick={() => navigate('/test')}
                style={{
                  background: '#0d8888ff',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  width: '100%'
                }}
              >
                View Interview Tests →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;