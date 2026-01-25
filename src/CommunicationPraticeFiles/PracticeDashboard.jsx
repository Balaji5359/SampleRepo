
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './practice-dashboard-styles.css';
import './practice-theme-styles.css';

const PracticeDashboard = ({ 
    practiceData = {}, 
    streakData = {},
    practiceType = '',
    practiceTitle = 'Practice',
    practiceLevel = 'basic',
    onNavigateToPractice = () => {},
    remainingPractices = 0
}) => {
    const [selectedTimeRange, setSelectedTimeRange] = useState('all');
    const [activeTab, setActiveTab] = useState('overview');
    const [tests, setTests] = useState(practiceData.tests || practiceData.testHistory || []);
    const [selectedTest, setSelectedTest] = useState(null);
    
    // New API states
    const [dashboardApiData, setDashboardApiData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const stats = useMemo(() => {
        if (!dashboardApiData || !practiceType) {
            return {
                totalAttempts: 0,
                averageScore: 0,
                bestScore: 0,
                currentStreak: streakData.current_streak || 0,
                bestStreak: streakData.best_streak || 0,
                practicesThisWeek: 0,
                remainingPractices: 0
            };
        }

        // Get practice type key (convert to snake_case)
        const practiceTypeKey = practiceType.toLowerCase().replace(/\s+/g, '_') + '_practice';
        const practiceTypeData = dashboardApiData[practiceTypeKey];

        if (!practiceTypeData || !practiceTypeData.levels) {
            return {
                totalAttempts: 0,
                averageScore: 0,
                bestScore: 0,
                currentStreak: streakData.current_streak || 0,
                bestStreak: streakData.best_streak || 0,
                practicesThisWeek: 0,
                remainingPractices: 0
            };
        }

        // Extract level-specific data
        const levelData = practiceTypeData.levels[practiceLevel.toLowerCase()] || {};
        const attempts = levelData.attempts || 0;
        const avgScore = parseFloat(levelData.avgScore) || 0;
        const bestScore = Math.ceil(avgScore) || attempts;

        // Calculate remaining practices
        const totalPracticesPerLevel = 10;
        const remainingPractices = Math.max(0, totalPracticesPerLevel - attempts);

        return {
            totalAttempts: attempts,
            averageScore: avgScore,
            bestScore: bestScore,
            currentStreak: streakData.current_streak || 0,
            bestStreak: streakData.best_streak || 0,
            practicesThisWeek: attempts,
            remainingPractices: remainingPractices
        };
    }, [dashboardApiData, practiceType, practiceLevel, streakData]);

    // Generate mock trend data for visualization
    const generateTrendData = () => {
        // If a specific test has historical scores, prefer that series
        if (selectedTest && selectedTest.history && selectedTest.history.length) {
            return selectedTest.history.slice(-7).map((s, i) => ({
                day: s.day || `D${i + 1}`,
                score: Math.max(0, Math.min(10, s.score || s.value || Math.floor(Math.random() * 10)))
            }));
        }

        const data = [];
        for (let i = 0; i < 7; i++) {
            data.push({
                day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
                score: Math.floor(Math.random() * 3) + 6 + Math.floor(Math.random() * 2),
            });
        }
        return data;
    };

    const trendData = useMemo(() => generateTrendData(), [selectedTest, selectedTimeRange]);

    // Helpers to compute selected test stats safely
    const getTestStats = (test) => {
        if (!test) return { attempts: 0, average: 0, lastAttempt: 'N/A' };
        const attempts = test.attempts || test.attemptCount || test.count || (test.entries && test.entries.length) || 0;
        const average = test.averageScore || test.avg || (test.entries && (test.entries.reduce((s, e) => s + (e.score || 0), 0) / test.entries.length)) || 0;
        const lastAttempt = test.lastAttempt || test.lastDate || (test.entries && test.entries.length ? test.entries[test.entries.length - 1].date : 'N/A');
        return { attempts, average: Number(average || 0), lastAttempt };
    };

    return (
        <div className="practice-dashboard-root">
            {/* Enhanced Header */}
            <div className="practice-dashboard-header">
                <div className="dashboard-header-left">
                    <h1 className="dashboard-title">{practiceTitle} Dashboard</h1>
                    <p className="dashboard-subtitle">
                        {practiceLevel && practiceLevel.charAt(0).toUpperCase() + practiceLevel.slice(1)} Level
                    </p><br></br>
                    <button 
                        className="cta-button primary" 
                        onClick={() => onNavigateToPractice()}
                        disabled={remainingPractices === 0}
                        style={{
                            opacity: remainingPractices === 0 ? 0.5 : 1,
                            backgroundColor: remainingPractices === 0 ? '#cccccc' : undefined,
                            cursor: remainingPractices === 0 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Quick Start Practice Now
                    </button>
                </div>
                <div className="remaining-practices-section">
                    <div className="remaining-practices-content">
                        <p className="remaining-practices-label">Remaining Practices Left</p>
                        <div className="remaining-practices-display">
                            <span className="remaining-practices-number">{remainingPractices}</span>
                        </div>
                    </div>
                </div>
            </div>


            {/* Tab Navigation */}
            <div className="dashboard-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analytics')}
                >
                    Analytics
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
                    onClick={() => setActiveTab('insights')}
                >
                    Insights
                </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="dashboard-content">
                    <div className="overview-grid">
                        <aside className="test-list-panel">
                            <div className="test-list-header">
                                <h3>Your Practices</h3>
                                <p className="muted">Here is your details and trends of<br></br><b>{practiceTitle}</b> - <b>{practiceLevel}</b></p>
                            </div>
                            
                            <ul className="test-list">
                                {tests && tests.length ? tests.map((t, i) => (
                                    <li key={i} className={`test-item ${selectedTest === t ? 'selected' : ''}`} onClick={() => setSelectedTest(t)}>
                                        <div className="test-main">
                                            <strong className="test-title">{t.name || t.title || `Test ${i + 1}`}</strong>
                                            <span className="test-sub">{(t.attempts || t.attemptCount || t.count) || (t.entries && t.entries.length) || 0} attempts</span>
                                        </div>
                                        <div className="test-score">{((t.averageScore || t.avg) || 0).toFixed ? (t.averageScore || t.avg || 0).toFixed(1) : (t.averageScore || t.avg || 0)}/10</div>
                                    </li>
                                )) : (
                                    <li className="test-empty">No tests yet — start a practice!</li>
                                )}
                            </ul>
                        </aside>
                        
                        {/* Key Metrics Grid */}
                        <main className="overview-main">
                            {/* Streak Celebration Section */}
                            {stats.currentStreak > 0 && (
                                <div className="streak-celebration">
                                    <div className="celebration-content">
                                        <h2>🎉 Amazing Streak!</h2>
                                        <p className="celebration-text">
                                            You've practiced <strong>{stats.currentStreak} days in a row</strong>! 
                                            Your consistency is building real skills. Keep this momentum going!
                                        </p>
                                        <div className="streak-visual">
                                            {Array.from({ length: Math.min(stats.currentStreak, 30) }).map((_, i) => (
                                                <div key={i} className="streak-flame">🔥</div>
                                            ))}
                                        </div>
                                        <button 
                                            className="cta-button primary" 
                                            onClick={() => onNavigateToPractice()}
                                            disabled={remainingPractices === 0}
                                            style={{
                                                opacity: remainingPractices === 0 ? 0.5 : 1,
                                                backgroundColor: remainingPractices === 0 ? '#cccccc' : undefined,
                                                cursor: remainingPractices === 0 ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            {remainingPractices === 0 ? 'No Practices Remaining' : 'Continue Practicing →'}
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="metrics-grid">
                        {/* Total Attempts Card */}
                        <div className="metric-card">
                            <div className="metric-icon">🎯</div>
                            <div className="metric-content">
                                <h3 className="metric-label">Total Attempts</h3>
                                <p className="metric-value">{stats.totalAttempts}</p>
                                <p className="metric-change">+{Math.floor(Math.random() * 5)} this week</p>
                            </div>
                            <div className="metric-badge success">↑ Active</div>
                        </div>

                        {/* Average Score Card */}
                        <div className="metric-card highlight">
                            <div className="metric-icon">📈</div>
                            <div className="metric-content">
                                <h3 className="metric-label">Average Score</h3>
                                <p className="metric-value">{stats.averageScore.toFixed(1)}/10</p>
                                <p className="metric-change">+0.5 vs last week</p>
                            </div>
                            <div className="metric-badge trending">📊 Improving</div>
                        </div>
                        
                        
                        {/* Best Score Card */}
                        <div className="metric-card">
                            <div className="metric-icon">🏆</div>
                            <div className="metric-content">
                                <h3 className="metric-label">Best Score</h3>
                                <p className="metric-value">{stats.bestScore}/10</p>
                                <p className="metric-change">Personal record</p>
                            </div>
                            <div className="metric-badge success">⭐ Milestone</div>
                        </div>
                    </div>

                    {/* Performance Trend Graph */}
                    <div className="trend-section">
                        <div className="trend-header">
                            <h2>Performance Trend (Last 7 Days)</h2>
                            <div className="trend-controls">
                                {['week', 'month', 'all'].map(range => (
                                    <button 
                                        key={range}
                                        className={`range-btn ${selectedTimeRange === range ? 'active' : ''}`}
                                        onClick={() => setSelectedTimeRange(range)}
                                    >
                                        {range === 'week' ? 'Week' : range === 'month' ? 'Month' : 'All Time'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="trend-chart">
                            <div className="chart-bars">
                                {trendData.map((data, idx) => (
                                    <div key={idx} className="bar-container">
                                        <div 
                                            className="bar" 
                                            style={{
                                                height: `${(data.score / 10) * 100}%`,
                                                background: data.score >= 8 ? '#10b981' : data.score >= 6 ? '#3b82f6' : '#f59e0b'
                                            }}
                                        />
                                        <span className="bar-label">{data.day}</span>
                                        <span className="bar-value">{data.score}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="chart-legend">
                                <span>📊 Average: {stats.averageScore.toFixed(1)}</span>
                                <span>📈 Highest: {stats.bestScore}</span>
                                <span>✅ Consistency: {stats.practicesThisWeek}x this week</span>
                            </div>
                        </div>
                    </div>
                        </main>
                    </div>
                </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
                <div className="dashboard-content analytics-tab">
                    <div className="analytics-grid">
                        {/* Advanced Metrics - Current Implementation */}
                        <div className="analytics-card">
                            <h3>📝 Speaking Metrics</h3>
                            <div className="metric-row">
                                <span>Total Words Spoken</span>
                                <span className="future-badge">Coming Soon</span>
                            </div>
                            <div className="metric-row">
                                <span>Avg Words per Practice</span>
                                <span className="future-badge">Coming Soon</span>
                            </div>
                            <div className="metric-row">
                                <span>Speaking Consistency</span>
                                <span className="future-badge">Coming Soon</span>
                            </div>
                        </div>

                        
                        {/* Accuracy & Fluency */}
                        <div className="analytics-card">
                            <h3>✨ Quality Indicators</h3>
                            <div className="progress-section">
                                <div className="progress-item">
                                    <label>Pronunciation Accuracy</label>
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill" 
                                            style={{ width: `${(practiceData.pronunciationAccuracy || 0) * 10}%` }}
                                        />
                                    </div>
                                    <span>{(practiceData.pronunciationAccuracy || 0).toFixed(1)}/10</span>
                                </div>
                                <div className="progress-item">
                                    <label>Grammar Score</label>
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill" 
                                            style={{ width: `${(practiceData.grammarScore || 0) * 10}%` }}
                                        />
                                    </div>
                                    <span>{(practiceData.grammarScore || 0).toFixed(1)}/10</span>
                                </div>
                                <div className="progress-item">
                                    <label>Fluency</label>
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill" 
                                            style={{ width: `${(practiceData.fluency || 0) * 10}%` }}
                                        />
                                    </div>
                                    <span>{(practiceData.fluency || 0).toFixed(1)}/10</span>
                                </div>
                            </div>
                        </div>

                        {/* Time Invested */}
                        <div className="analytics-card">
                            <h3>⏱️ Time Investment</h3>
                            <div className="metric-row">
                                <span>Total Practice Time</span>
                                <strong>{Math.floor((practiceData.totalAttempts || 0) * 5)} mins</strong>
                            </div>
                            <div className="metric-row">
                                <span>Avg Time per Session</span>
                                <strong>~5 mins</strong>
                            </div>
                            <div className="metric-row">
                                <span>Most Active Day</span>
                                <strong>Monday</strong>
                            </div>
                            <p className="analytics-hint">💡 Consistent 5-min sessions build lasting skills!</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Insights Tab */}
            {activeTab === 'insights' && (
                <div className="dashboard-content insights-tab">
                    <div className="insights-container">
                        {/* Personalized Insights */}
                        <div className="insight-card focus">
                            <h3>🎯 Your Focus Areas</h3>
                            <ul className="insight-list">
                                <li>✓ <strong>Grammar:</strong> You're doing great! Keep the momentum.</li>
                                <li>→ <strong>Pronunciation:</strong> Practice guttural sounds more often.</li>
                                <li>→ <strong>Fluency:</strong> Add more filler words to natural speech patterns.</li>
                                <li>✓ <strong>Confidence:</strong> Excellent growth this month!</li>
                            </ul>
                        </div>

                        {/* Recommendations */}
                        <div className="insight-card recommendation">
                            <h3>💡 Personalized Recommendations</h3>
                            <div className="recommendation-item">
                                <span className="rec-emoji">📚</span>
                                <div>
                                    <strong>Practice JAM Sessions More</strong>
                                    <p>You excel at JAM but haven't practiced this week. One session would extend your streak!</p>
                                </div>
                            </div>
                            <div className="recommendation-item">
                                <span className="rec-emoji">🎤</span>
                                <div>
                                    <strong>Focus on Pronunciation</strong>
                                    <p>Your pronunciation score dipped slightly. A quick 5-min session will help.</p>
                                </div>
                            </div>
                            <div className="recommendation-item">
                                <span className="rec-emoji">⚡</span>
                                <div>
                                    <strong>Maintain Your Streak!</strong>
                                    <p>You're {10 - stats.currentStreak} practices away from your personal record!</p>
                                </div>
                            </div>
                        </div>

                        {/* Milestone Progress */}
                        <div className="insight-card milestone">
                            <h3>🏆 Upcoming Milestones</h3>
                            <div className="milestone-item">
                                <div className="milestone-progress">
                                    <div className="milestone-bar">
                                        <div className="milestone-fill" style={{ width: '65%' }} />
                                    </div>
                                    <span className="milestone-text">50 Total Practices</span>
                                    <span className="milestone-count">33 / 50</span>
                                </div>
                            </div>
                            <div className="milestone-item">
                                <div className="milestone-progress">
                                    <div className="milestone-bar">
                                        <div className="milestone-fill" style={{ width: '40%' }} />
                                    </div>
                                    <span className="milestone-text">30-Day Streak</span>
                                    <span className="milestone-count">{stats.currentStreak} / 30</span>
                                </div>
                            </div>
                            <div className="milestone-item">
                                <div className="milestone-progress">
                                    <div className="milestone-bar">
                                        <div className="milestone-fill" style={{ width: '85%' }} />
                                    </div>
                                    <span className="milestone-text">9.0+ Average Score</span>
                                    <span className="milestone-count">{stats.averageScore.toFixed(1)} / 9.0</span>
                                </div>
                            </div>
                        </div>

                        {/* Motivational Message */}
                        <div className="motivation-banner">
                            <h2>✨ Keep Going!</h2>
                            <p>
                                You're on an amazing journey! Every practice session is building your communication skills. 
                                The fact that you're here, tracking your progress, means you're already winning.
                            </p>
                            <div className="banner-stats">
                                <div className="banner-stat">
                                    <strong>{stats.totalAttempts}</strong>
                                    <span>practices completed</span>
                                </div>
                                <div className="banner-stat">
                                    <strong>{stats.currentStreak}</strong>
                                    <span>day streak</span>
                                </div>
                                <div className="banner-stat">
                                    <strong>{(stats.averageScore / 10 * 100).toFixed(0)}%</strong>
                                    <span>average performance</span>
                                </div>
                            </div>
                            <button 
                                className="cta-button premium" 
                                onClick={() => onNavigateToPractice()}
                                disabled={remainingPractices === 0}
                                style={{
                                    opacity: remainingPractices === 0 ? 0.5 : 1,
                                    backgroundColor: remainingPractices === 0 ? '#cccccc' : undefined,
                                    cursor: remainingPractices === 0 ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {remainingPractices === 0 ? '❌ No Practices Remaining' : '🚀 Start Your Next Practice'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PracticeDashboard;
