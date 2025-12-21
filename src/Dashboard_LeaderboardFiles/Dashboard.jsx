import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login_Navbar from '../RegisterFiles/Login_Navbar.jsx';
import './dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(false);
  const [userEmail] = useState(localStorage.getItem('email'));

  const testTypes = [
    { key: 'JAM', name: 'JAM Sessions', icon: '🎤', route: '/student-dashboard/jam' },
    { key: 'SITUATIONSPEAK', name: 'Situation Speak', icon: '💬', route: '/student-dashboard/situationspeak' },
    { key: 'STORYRETELLING', name: 'Story Retelling', icon: '📚', route: '/student-dashboard/storyretelling' },
    { key: 'IMAGETOSPEAK', name: 'Image to Speak', icon: '🖼️', route: '/student-dashboard/imagespeak' },
    { key: 'IMAGETOSTORY', name: 'Image to Story', icon: '📖' }
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
    const fetchAllTestData = async () => {
      if (!userEmail) return;
      
      setLoading(true);
      const allData = {};
      
      for (const testType of testTypes) {
        if (testType.route) {
          try {
            const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_retrivalapi', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                college_email: userEmail,
                test_type: testType.key
              })
            });
            
            const data = await response.json();
            const parsedData = JSON.parse(data.body);
            allData[testType.key] = parsedData;
          } catch (error) {
            console.error(`Error fetching ${testType.key} data:`, error);
          }
        }
      }
      
      setApiData(allData);
      setLoading(false);
    };
    
    fetchAllTestData();
  }, [userEmail]);

  const calculateTestStats = (testKey) => {
    const testData = apiData[testKey];
    if (!testData || !testData.sessions) {
      return { avgScore: 0, testCount: 0, trend: [] };
    }

    const sessions = testData.sessions;
    let totalScore = 0;
    let scoreCount = 0;
    const trend = [];

    sessions.forEach(session => {
      session.conversationHistory?.forEach(conv => {
        if (conv.agent) {
          const scoreMatch = conv.agent.match(/Score: ([\d.]+)/i) || conv.agent.match(/JAM Score: ([\d.]+)/i);
          if (scoreMatch) {
            const score = parseFloat(scoreMatch[1]);
            if (!isNaN(score) && score > 0) {
              totalScore += score;
              scoreCount++;
              trend.push(score);
            }
          }
        }
      });
    });

    return {
      avgScore: scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : '0',
      testCount: sessions.length,
      trend: trend.slice(-5) // Last 5 scores for mini chart
    };
  };

  const handleTestTypeClick = (testType) => {
    if (testType.route) {
      navigate(testType.route);
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
          stroke="var(--accent-blue)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <>
      <Login_Navbar />
      <div className="dashboard-container">
        <div className="dashboard-main">
          <div className="dashboard-header">
            <h1>Communication Tests Dashboard</h1>
            <p className="dashboard-subtitle">Choose a test type to view detailed analytics</p>
            <div className="theme-selector">
              <label>Theme: </label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
          
          <div className="test-types-grid">
            {testTypes.map(testType => {
              const stats = calculateTestStats(testType.key);
              return (
                <div 
                  key={testType.key}
                  className="test-type-card enhanced"
                  onClick={() => handleTestTypeClick(testType)}
                >
                  <div className="test-icon">{testType.icon}</div>
                  <div className="test-name">{testType.name}</div>
                  
                  {testType.route ? (
                    <div className="test-analytics">
                      <div className="stats-row">
                        <div className="stat">
                          <span className="stat-value">{loading ? '...' : stats.avgScore}</span>
                          <span className="stat-label">Avg Score</span>
                        </div>
                        <div className="stat">
                          <span className="stat-value">{loading ? '...' : stats.testCount}</span>
                          <span className="stat-label">Tests</span>
                        </div>
                      </div>
                      <div className="mini-chart-container">
                        {stats.trend.length > 0 && renderMiniChart(stats.trend)}
                      </div>
                      <div className="test-status available">✅ Available</div>
                    </div>
                  ) : (
                    <div className="test-status coming-soon">🚧 Coming Soon</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;