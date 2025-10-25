import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login_Navbar from "../RegisterFiles/Login_Navbar";
import "./profile.css";
// import '../LandingPageFiles/landing.css';

function ProfileData() {
    const navigate = useNavigate();
    const [apiData, setApi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [subscriptionData, setSubscriptionData] = useState(null);
    const [daysLeft, setDaysLeft] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
    const [greeting, setGreeting] = useState("");
    const [motivationalQuote, setMotivationalQuote] = useState("");
    const [userData, setUserData] = useState({
        full_name: "",
        gender: "",
        date_of_birth: "",
        age: "",
        username: "",
        roll_no: "",
        user_type: "",
        college_email: "",
        college_name: "",
        program: "",
        branch: "",
        year: "",
        sem: "",
        section: "",
        account_creation_date: "",
        account_creation_time: "",
        profile_last_updated: "",
        unique_id: "",
    });

    // Mock data for analytics and leaderboard
    const [analyticsData, setAnalyticsData] = useState({
        averageJAMScore: 78,
        totalTests: 24,
        improvementRate: 15,
        weeklyProgress: [65, 70, 75, 78, 82, 85, 88]
    });
    const [totalTests, setTotalTests] = useState(0);
    const [profileApiData, setProfileApiData] = useState(null);
    const [showProfilePopup, setShowProfilePopup] = useState(false);

    const [leaderboardData] = useState({
        overall: [
            { name: "Alex Johnson", score: 95, avatar: "👨‍💼" },
            { name: "Sarah Chen", score: 92, avatar: "👩‍🎓" },
            { name: "Mike Wilson", score: 89, avatar: "👨‍🎓" }
        ],
        jam: [
            { name: "Emma Davis", score: 94, avatar: "👩‍💼" },
            { name: "John Smith", score: 91, avatar: "👨‍🎓" },
            { name: "Lisa Brown", score: 88, avatar: "👩‍🎓" }
        ],
        test: [
            { name: "David Lee", score: 96, avatar: "👨‍💼" },
            { name: "Anna Taylor", score: 93, avatar: "👩‍🎓" },
            { name: "Chris Wang", score: 90, avatar: "👨‍🎓" }
        ]
    });

    const quotes = [
        "The limits of my language mean the limits of my world. - Ludwig Wittgenstein",
        "To have another language is to possess a second soul. - Charlemagne",
        "Language is the road map of a culture. - Rita Mae Brown",
        "Communication is the most important skill you can develop. - Warren Buffett",
        "The art of communication is the language of leadership. - James Humes"
    ];

    useEffect(() => {
        // Set dynamic greeting
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 17) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");

        // Set random motivational quote
        setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);

        // Fetch user data
        setLoading(true);
        const url = 'https://ntjkr8rnd6.execute-api.ap-south-1.amazonaws.com/dev/student_profilecreate/student_profile_senddata';
        const storedEmail = localStorage.getItem("email");
        if (!storedEmail) {
            setLoading(false);
            return;
        }
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ college_email: storedEmail }),
        })
            .then((response) => response.json())
            .then((data) => {
                setApi(data);
                if (data && data.body) {
                    try {
                        const parsedData = typeof data.body === "string" ? JSON.parse(data.body) : data.body;
                        setUserData({
                            full_name: parsedData.full_name || "",
                            gender: parsedData.gender || "",
                            date_of_birth: parsedData.date_of_birth || "",
                            age: parsedData.age || "",
                            username: parsedData.username || "",
                            roll_no: parsedData.roll_no || "",
                            user_type: parsedData.user_type || "",
                            college_email: parsedData.college_email || "",
                            college_name: parsedData.college_name || "",
                            program: parsedData.program || "",
                            branch: parsedData.branch || "",
                            year: parsedData.year || "",
                            sem: parsedData.sem || "",
                            section: parsedData.section || "",
                            account_creation_date: parsedData.account_creation_date || "",
                            account_creation_time: parsedData.account_creation_time || "",
                            profile_last_updated: parsedData.profile_last_updated || "",
                            unique_id: parsedData.unique_id || "",
                        });

                        if (parsedData.subscription_plan && parsedData.payment_status === 'success') {
                            setSubscriptionData({
                                subscription_plan: parsedData.subscription_plan,
                                payment_status: parsedData.payment_status,
                                payment_date: parsedData.payment_date,
                                payment_time: parsedData.payment_time,
                                payment_id: parsedData.payment_id
                            });

                            const paymentDate = new Date(parsedData.payment_date);
                            const planDuration = parsedData.subscription_plan === '1 month' ? 30 : 90;
                            const expiryDate = new Date(paymentDate.getTime() + (planDuration * 24 * 60 * 60 * 1000));
                            const today = new Date();
                            const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

                            setDaysLeft(Math.max(0, daysRemaining));
                        }
                    } catch (e) {
                        console.error('Error parsing API data body:', e);
                    }
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });

        // Fetch profile API data for popup
        const profileUrl = 'https://ntjkr8rnd6.execute-api.ap-south-1.amazonaws.com/dev/student_profilecreate/student_profile_senddata';
        fetch(profileUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ college_email: storedEmail }),
        })
            .then((response) => response.json())
            .then((data) => {
                setProfileApiData(data);
                if (data && data.body) {
                    const parsedProfileData = typeof data.body === "string" ? JSON.parse(data.body) : data.body;
                    // Calculate total tests
                    const testKeys = Object.keys(parsedProfileData).filter(key => key.includes('-Test-Id'));
                    let total = 0;
                    testKeys.forEach(key => {
                        const tests = parsedProfileData[key];
                        total += Object.keys(tests).length;
                    });
                    setTotalTests(total);
                    setAnalyticsData(prev => ({ ...prev, totalTests: total }));
                }
            })

            .catch((error) => {
                console.error('Error fetching profile data:', error);
            });

    }, []);

    if (loading) {
        return (
            <>
                <Login_Navbar />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your dashboard...</p>
                </div>
            </>
        );
    }

    const handleProfileClick = () => {
        setShowProfilePopup(true);
    };

    const closeProfilePopup = () => {
        setShowProfilePopup(false);
    };

    return (
        <>
            <Login_Navbar onProfileClick={handleProfileClick} />
            <div className="dashboard-container"><br></br><br></br>
                {/* Header Section */}
                <div className="dashboard-header">
                    <div className="greeting-section">
                        <h1 className="greeting-text">
                            {greeting}, {userData.full_name || "Student"}! 👋
                        </h1>
                        <p className="motivational-quote">"{motivationalQuote}"</p>
                    </div>
                    {/* <div className="profile-avatar">
                        <div className="avatar-circle">
                            {userData.Name ? userData.Name.charAt(0).toUpperCase() : "S"}
                        </div>
                    </div> */}
                </div>


                {/* Subscription Status */}
                {userData.user_type === "free" && (
                    <>
                    <div className="subscription-banner">
                        <div className="subscription-content">
                            <div className="subscription-icon">🎯</div>
                            <div className="subscription-text">
                                <h3>You're on the Free Plan</h3>
                                <p>Upgrade to unlock unlimited access to all features and premium content</p>
                            </div>
                            <button className="upgrade-btn" onClick={() => navigate('/pricing')}>Upgrade Now</button>
                        </div>
                    </div>
                    <div>
                        <section id="pricing" className="pricing">
                        <div className="section-header">
                            <h2>Choose Your Learning Path</h2>
                            <p>Flexible plans designed for every learner's needs</p>
                        </div>
                        <div className="pricing-container">
                            <div className="pricing-card current-plan">
                                <div className="plan-badge current">Current Plan</div>
                                <div className="plan-price">
                                    <span className="currency">₹</span>
                                    <span className="amount">0</span>
                                    <span className="period">/Free Trial</span>
                                </div>
                                <ul className="plan-features">
                                    <li>✓ 1 Free trial for JAM</li>
                                    <li>✓ 1 Free trial for Image-Based Speaking</li>
                                    <li>✓ Limited AI feedback</li>
                                    <li>✓ Basic progress tracking</li>
                                    <li>✗ Advanced analytics</li>
                                    <li>✗ Premium activities</li>
                                </ul>
                                <button className="plan-btn current-btn" disabled>Current Plan</button>
                            </div>

                            <div className="pricing-card">
                                <div className="plan-badge">1 Month</div>
                                <div className="plan-price">
                                    <span className="currency">₹</span>
                                    <span className="amount">199</span>
                                    <span className="period">/month</span>
                                </div>
                                <ul className="plan-features">
                                    <li>✓ Access to all activities</li>
                                    <li>✓ 1 free trial for every test</li>
                                    <li>✓ 10 min practice sessions</li>
                                    <li>✓ 2 free Image-Based Speaking trials</li>
                                    <li>✓ Basic AI feedback</li>
                                    <li>✓ Progress tracking</li>
                                </ul>
                                <button className="plan-btn">Get Started</button>
                            </div>

                            <div className="pricing-card featured">
                                <div className="plan-badge popular">Most Popular</div>
                                <div className="plan-price">
                                    <span className="currency">₹</span>
                                    <span className="amount">499</span>
                                    <span className="period">/3 months</span>
                                </div>
                                <ul className="plan-features">
                                    <li>✓ Access to all activities</li>
                                    <li>✓ 2 free trials for every test</li>
                                    <li>✓ 20 min practice sessions</li>
                                    <li>✓ 3 free Image-Based Speaking trials</li>
                                    <li>✓ Advanced AI feedback</li>
                                    <li>✓ Detailed analytics</li>
                                    <li>✓ Progress tracking</li>
                                </ul>
                                <button className="plan-btn">Upgrade Now</button>
                            </div>

                            <div className="pricing-card">
                                <div className="plan-badge">Premium</div>
                                <div className="plan-price">
                                    <span className="currency">₹</span>
                                    <span className="amount">1399</span>
                                    <span className="period">/year 🌟</span>
                                </div>
                                <ul className="plan-features">
                                    <li>✓ Everything in Pro</li>
                                    <li>✓ Unlimited test trials</li>
                                    <li>✓ 40 min practice sessions</li>
                                    <li>✓ 5 free Image-Based Speaking trials</li>
                                    <li>✓ Premium AI feedback</li>
                                    <li>✓ 24/7 support</li>
                                </ul>
                                <button className="plan-btn">Go Premium</button>
                            </div>
                        </div>
                    </section>
                    </div>
                    </>
                )}

                {/* Debug user type */}
                {/* <div style={{padding: '1rem', background: '#f0f0f0', margin: '1rem 0'}}>
                    <p>Debug: User Type = "{userData.user_type}"</p>
                    <p>Show Pricing: {userData.user_type === "free" ? "Yes" : "No"}</p>
                </div> */}



                {/* Action Buttons */}
                <div className="action-buttons">
                    <button className="action-btn practice-btn" onClick={() => navigate('/practice')}>
                        <div className="btn-icon">🎯</div>
                        <div className="btn-content">
                            <h3>Practice</h3>
                            <p>Improve your skills</p>
                        </div>
                    </button>
                    <button className="action-btn test-btn" onClick={() => navigate('/test')}>
                        <div className="btn-icon">📝</div>
                        <div className="btn-content">
                            <h3>Start Test</h3>
                            <p>Assess your progress</p>
                        </div>
                    </button>
                </div>


                {/* Dashboard Grid */}
                <div className="dashboard-grid">
                    {/* Analytics Card */}
                    <div className="analytics-card">
                        <div className="card-header">
                            <h3>Your Performance</h3>
                            <div className="score-badge">
                                <span className="score-number">{analyticsData.averageJAMScore}</span>
                                <span className="score-label">Avg JAM Score</span>
                            </div>
                        </div>
                        <div className="analytics-content">
                            <div className="stat-item">
                                <div className="stat-icon">📊</div>
                                <div className="stat-info">
                                    <span className="stat-value">{analyticsData.totalTests}</span>
                                    <span className="stat-label">Tests Completed</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon">📈</div>
                                <div className="stat-info">
                                    <span className="stat-value">+{analyticsData.improvementRate}%</span>
                                    <span className="stat-label">Improvement</span>
                                </div>
                            </div>
                        </div>
                        <button className="view-analytics-btn" onClick={() => navigate('/dashboard')}>
                            View Full Analytics →
                        </button>
                    </div>

                    {/* Leaderboard Card */}
                    <div className="leaderboard-card">
                        <div className="card-header">
                            <h3>🏆 Leaderboard Highlights</h3>
                        </div>
                        <div className="leaderboard-tabs">
                            <button className="tab-btn active">Overall</button>
                            <button className="tab-btn">JAM</button>
                            <button className="tab-btn">Pronunciation</button>
                            <button className="tab-btn">Vocabulary</button>
                        </div>
                        <div className="leaderboard-list">
                            {leaderboardData.overall.map((user, index) => (
                                <div key={index} className="leaderboard-item">
                                    <div className="rank-badge">{index + 1}</div>
                                    <div className="user-avatar">{user.avatar}</div>
                                    <div className="user-info">
                                        <span className="user-name">{user.name}</span>
                                        <span className="user-score">{user.score} pts</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="view-leaderboard-btn" onClick={() => navigate('/leaderboard')}>
                            View Full Leaderboard
                        </button>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="quick-actions-card">
                        <h3>Quick Actions - Tests</h3>
                        <div className="quick-actions-grid">
                            <button className="quick-action-item" onClick={() => navigate('/test')}>
                                <div className="action-icon">⏱️</div>
                                <span>JAM Session</span>
                            </button>
                            <button className="quick-action-item" onClick={() => navigate('/test')}>
                                <div className="action-icon">🗣️</div>
                                <span>Pronunciation</span>
                            </button>
                            <button className="quick-action-item" onClick={() => navigate('/test')}>
                                <div className="action-icon">📚</div>
                                <span>Vocabulary</span>
                            </button>
                            <button className="quick-action-item" onClick={() => navigate('/test')}>
                                <div className="action-icon">🎤</div>
                                <span>Speaking Test</span>
                            </button>
                        </div>
                    </div>

                    {/* Progress Card */}
                    <div className="progress-card">
                        <h3>Weekly Progress</h3>
                        <div className="progress-chart">
                            {analyticsData.weeklyProgress.map((score, index) => (
                                <div key={index} className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ height: `${score}%` }}
                                    ></div>
                                    <span className="day-label">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>



                {/* Chatbot */}
                {/* <div className="chatbot-container">
                    <button className="chatbot-toggle">
                        <div className="chatbot-icon">💬</div>
                        <span>AI Assistant</span>
                    </button>
                </div> */}
            </div>

            {/* Profile Popup */}
            {showProfilePopup && (
                <div className="profile-popup-overlay" onClick={closeProfilePopup}>
                    <div className="profile-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="profile-popup-header">
                            <h2>User Profile</h2>
                            <button className="close-popup-btn" onClick={closeProfilePopup}>×</button>
                        </div>
                        <div className="profile-popup-content">
                            <div className="profile-avatar-section">
                                <div className="profile-avatar-circle">
                                    {userData.full_name ? userData.full_name.charAt(0).toUpperCase() : "U"}
                                </div>
                                <h3>{userData.full_name || "User"}</h3>
                            </div>
                            <div className="profile-details">
                                <div className="profile-detail-item">
                                    <span className="detail-label">Full Name:</span>
                                    <span className="detail-value">{userData.full_name}</span>
                                </div>
                                <div className="profile-detail-item">
                                    <span className="detail-label">Gender:</span>
                                    <span className="detail-value">{userData.gender}</span>
                                </div>
                                <div className="profile-detail-item">
                                    <span className="detail-label">Date of Birth:</span>
                                    <span className="detail-value">{userData.date_of_birth}</span>
                                </div>
                                <div className="profile-detail-item">
                                    <span className="detail-label">Age:</span>
                                    <span className="detail-value">{userData.age}</span>
                                </div>
                                <div className="profile-detail-item">
                                    <span className="detail-label">Username:</span>
                                    <span className="detail-value">{userData.username}</span>
                                </div>
                                <div className="profile-detail-item">
                                    <span className="detail-label">Roll No:</span>
                                    <span className="detail-value">{userData.roll_no}</span>
                                </div>
                                <div className="profile-detail-item">
                                    <span className="detail-label">User Type:</span>
                                    <span className="detail-value">{userData.user_type}</span>
                                </div>
                                <div className="profile-detail-item">
                                    <span className="detail-label">College Email:</span>
                                    <span className="detail-value">{userData.college_email}</span>
                                </div>
                                <div className="profile-detail-item">
                                    <span className="detail-label">College Name:</span>
                                    <span className="detail-value">{userData.college_name}</span>
                                </div>
                                <div className="profile-detail-item">
                                    <span className="detail-label">Program:</span>
                                    <span className="detail-value">{userData.program}</span>
                                </div>
                                <div className="profile-detail-item">
                                    <span className="detail-label">Branch:</span>
                                    <span className="detail-value">{userData.branch}</span>
                                </div>
                                <div className="profile-detail-item">
                                    <span className="detail-label">Year:</span>
                                    <span className="detail-value">{userData.year}</span>
                                </div>
                                <div className="profile-detail-item">
                                    <span className="detail-label">Semester:</span>
                                    <span className="detail-value">{userData.sem}</span>
                                </div>
                                <div className="profile-detail-item">
                                    <span className="detail-label">Section:</span>
                                    <span className="detail-value">{userData.section}</span>
                                </div>
                                <div className="profile-detail-item">
                                    <span className="detail-label">Account Creation Date:</span>
                                    <span className="detail-value">{userData.account_creation_date}</span>
                                </div>
                                <div className="profile-detail-item">
                                    <span className="detail-label">Account Creation Time:</span>
                                    <span className="detail-value">{userData.account_creation_time}</span>
                                </div>
                                <div className="profile-detail-item">
                                    <span className="detail-label">Profile Last Updated:</span>
                                    <span className="detail-value">{userData.profile_last_updated}</span>
                                </div>
                                <div className="profile-detail-item">
                                    <span className="detail-label">Unique ID:</span>
                                    <span className="detail-value">{userData.unique_id}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ProfileData;
