import React, { useState, useEffect } from 'react';
import './Progress.css';

const Progress = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [animateProgress, setAnimateProgress] = useState(false);

  useEffect(() => {
    setAnimateProgress(true);
  }, []);

  const progressData = {
    overall: 82,
    fields: 80,
    communication: 75,
    interview: 90,
    placement: 85
  };

  const skillsData = [
    { name: 'Technical Skills', value: 85, color: '#4CAF50' },
    { name: 'Problem Solving', value: 78, color: '#2196F3' },
    { name: 'Communication', value: 75, color: '#FF9800' },
    { name: 'Leadership', value: 70, color: '#9C27B0' },
    { name: 'Teamwork', value: 88, color: '#F44336' }
  ];

  const weeklyProgress = [
    { week: 'Week 1', score: 65 },
    { week: 'Week 2', score: 70 },
    { week: 'Week 3', score: 75 },
    { week: 'Week 4', score: 82 }
  ];

  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = '#4CAF50' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="circular-progress" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e0e0e0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={animateProgress ? strokeDashoffset : circumference}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 2s ease-in-out' }}
          />
        </svg>
        <div className="progress-text">
          <span className="percentage">{percentage}%</span>
        </div>
      </div>
    );
  };

  const ProgressBar = ({ label, value, color }) => (
    <div className="progress-bar-container">
      <div className="progress-bar-header">
        <span className="progress-label">{label}</span>
        <span className="progress-value">{value}%</span>
      </div>
      <div className="progress-bar-track">
        <div 
          className="progress-bar-fill"
          style={{ 
            width: animateProgress ? `${value}%` : '0%',
            backgroundColor: color,
            transition: 'width 1.5s ease-in-out'
          }}
        />
      </div>
    </div>
  );

  const ConsistencyMap = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeks = Array.from({ length: 12 }, (_, i) => i + 1);
    
    const getActivityLevel = () => {
      const levels = [0, 1, 2, 3, 4];
      return levels[Math.floor(Math.random() * levels.length)];
    };

    return (
      <div className="consistency-map">
        <h3>Activity Consistency</h3>
        <div className="heatmap">
          {weeks.map(week => (
            <div key={week} className="week-column">
              {days.map(day => (
                <div 
                  key={`${week}-${day}`}
                  className={`activity-cell level-${getActivityLevel()}`}
                  title={`Week ${week}, ${day}`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="legend">
          <span>Less</span>
          <div className="legend-cells">
            {[0, 1, 2, 3, 4].map(level => (
              <div key={level} className={`legend-cell level-${level}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    );
  };

  const WeeklyChart = () => (
    <div className="weekly-chart">
      <h3>Weekly Progress Trend</h3>
      <div className="chart-container">
        {weeklyProgress.map((item, index) => (
          <div key={index} className="chart-bar">
            <div 
              className="bar"
              style={{
                height: animateProgress ? `${item.score}%` : '0%',
                backgroundColor: `hsl(${120 + index * 30}, 70%, 50%)`,
                transition: `height 1s ease-in-out ${index * 0.2}s`
              }}
            >
              <span className="bar-value">{item.score}%</span>
            </div>
            <span className="bar-label">{item.week}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const AchievementBadges = () => {
    const achievements = [
      { name: 'First Interview', icon: '🎯', earned: true },
      { name: 'Communication Pro', icon: '💬', earned: true },
      { name: 'Tech Master', icon: '💻', earned: false },
      { name: 'Consistency King', icon: '👑', earned: true },
      { name: 'Problem Solver', icon: '🧩', earned: false }
    ];

    return (
      <div className="achievements">
        <h3>Achievements</h3>
        <div className="badges-grid">
          {achievements.map((achievement, index) => (
            <div 
              key={index} 
              className={`badge ${achievement.earned ? 'earned' : 'locked'}`}
            >
              <div className="badge-icon">{achievement.icon}</div>
              <div className="badge-name">{achievement.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="progress-dashboard">
      <div className="dashboard-header">
        <h1>Student Progress Dashboard</h1>
        <div className="overall-score">
          <CircularProgress percentage={progressData.overall} size={150} color="#4CAF50" />
          <div className="score-details">
            <h2>Overall Progress</h2>
            <p>Great job! Keep it up!</p>
          </div>
        </div>
      </div>

      <div className="tab-navigation">
        {['overview', 'skills', 'consistency', 'achievements'].map(tab => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="progress-cards">
              <div className="progress-card">
                <CircularProgress percentage={progressData.fields} color="#2196F3" />
                <h3>Technical Skills</h3>
                <p>Field Knowledge</p>
              </div>
              <div className="progress-card">
                <CircularProgress percentage={progressData.communication} color="#FF9800" />
                <h3>Communication</h3>
                <p>Soft Skills</p>
              </div>
              <div className="progress-card">
                <CircularProgress percentage={progressData.interview} color="#9C27B0" />
                <h3>Interview Prep</h3>
                <p>Mock Interviews</p>
              </div>
              <div className="progress-card placement">
                <CircularProgress percentage={progressData.placement} color="#F44336" />
                <h3>Placement Chance</h3>
                <p>Success Probability</p>
              </div>
            </div>
            <WeeklyChart />
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="skills-tab">
            <div className="skills-breakdown">
              <h3>Skills Breakdown</h3>
              {skillsData.map((skill, index) => (
                <ProgressBar 
                  key={index}
                  label={skill.name}
                  value={skill.value}
                  color={skill.color}
                />
              ))}
            </div>
            <div className="next-steps">
              <h3>Recommended Next Steps</h3>
              <ul>
                <li>📚 Focus on advanced technical concepts</li>
                <li>🗣️ Practice communication skills daily</li>
                <li>💼 Complete more mock interviews</li>
                <li>🤝 Work on leadership projects</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'consistency' && (
          <div className="consistency-tab">
            <ConsistencyMap />
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="achievements-tab">
            <AchievementBadges />
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;