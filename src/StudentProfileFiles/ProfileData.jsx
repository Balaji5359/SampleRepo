import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login_Navbar from "../RegisterFiles/Login_Navbar";
import "./profile.css";
import '../LandingPageFiles/landing.css';

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
        Name: "",
        gender: "",
        dob: "",
        age: "",
        email: "",
        phone: "",
        city: "",
        state: "",
        collegeName: "",
        program: "",
        branch: "",
        yearOfStudy: "",
        hobbies: "",
        about: "",
        username: "",
        student_id: "",
        user_type: "",
        account_create_date: "",
        account_create_time: "",
    });

    // Mock data for analytics and leaderboard
    const [analyticsData] = useState({
        averageJAMScore: 78,
        totalTests: 24,
        improvementRate: 15,
        weeklyProgress: [65, 70, 75, 78, 82, 85, 88]
    });

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
        const url = 'https://jaumunpkj2.execute-api.ap-south-1.amazonaws.com/dev/signup/login/profile_data/send_data';
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
            body: JSON.stringify({ email: storedEmail }),
        })
            .then((response) => response.json())
            .then((data) => {
                setApi(data);
                if (data && data.body) {
                    try {
                        const parsedData = typeof data.body === "string" ? JSON.parse(data.body) : data.body;
                        setUserData({
                            Name: parsedData.name || "",
                            gender: parsedData.gender || "",
                            dob: parsedData.dob || "",
                            age: parsedData.age || "",
                            email: parsedData.email || "",
                            phone: parsedData.phone || "",
                            city: parsedData.city || "",
                            state: parsedData.state_of_student || "",
                            collegeName: parsedData.collegename || "",
                            program: parsedData.program || "",
                            branch: parsedData.branch || "",
                            yearOfStudy: parsedData.year_of_study || "",
                            hobbies: parsedData.hobbies || "",
                            about: parsedData.about || "",
                            username: parsedData.username || "",
                            student_id: parsedData.student_id || "",
                            user_type: parsedData.user_type || "",
                            account_create_date: parsedData.account_create_date || "",
                            account_create_time: parsedData.account_create_time || "",
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

    return (
        <>
            <Login_Navbar />
            <div className="dashboard-container">
                {/* Header Section */}
                <div className="dashboard-header">
                    <div className="greeting-section">
                        <h1 className="greeting-text">
                            {greeting}, {userData.Name || "Student"}! 👋
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
                {userData.user_type === 'free' && (
                    <div className="upgrade-banner">
                        <div className="banner-content">
                            <div className="banner-icon">🚀</div>
                            <div className="banner-text">
                                <h4>Unlock Premium Features</h4>
                                <p>Get unlimited access to all tests, detailed analytics, and personalized coaching</p>
                            </div>
                            {/* <Link to="/pro-plans">
                                <button className="upgrade-btn">Upgrade to Pro</button>
                            </Link> */}
                        </div>

                    {/* Pricing Section */}
                    <section id="pricing" className="pricing">
                        <div className="section-header">
                        <h2>Choose Your Learning Path</h2>
                        <p>Flexible plans designed for every learner's needs</p>
                        </div>
                        <div className="pricing-grid">
                        <div className="pricing-card">
                            <div className="plan-badge">Free</div>
                            <div className="plan-price">
                            <span className="currency">$</span>
                            <span className="amount">0</span>
                            <span className="period">/month</span>
                            </div>
                            <ul className="plan-features">
                            <li>✓ Basic JAM sessions</li>
                            <li>✓ Limited AI feedback</li>
                            <li>✓ Progress tracking</li>
                            <li>✗ Advanced analytics</li>
                            <li>✗ Premium activities</li>
                            </ul>
                            <button className="plan-btn">Start Free</button>
                        </div>
                        
                        <div className="pricing-card featured">
                            <div className="plan-badge popular">Most Popular</div>
                            <div className="plan-price">
                            <span className="currency">$</span>
                            <span className="amount">9</span>
                            <span className="period">/month</span>
                            </div>
                            <ul className="plan-features">
                            <li>✓ All free features</li>
                            <li>✓ Advanced AI feedback</li>
                            <li>✓ All practice activities</li>
                            <li>✓ Detailed analytics</li>
                            <li>✓ Priority support</li>
                            </ul>
                            <button className="plan-btn">Upgrade Now</button>
                        </div>
                        
                        <div className="pricing-card">
                            <div className="plan-badge">Premium</div>
                            <div className="plan-price">
                            <span className="currency">$</span>
                            <span className="amount">19</span>
                            <span className="period">/month</span>
                            </div>
                            <ul className="plan-features">
                            <li>✓ Everything in Pro</li>
                            <li>✓ 1-on-1 coaching</li>
                            <li>✓ Custom learning paths</li>
                            <li>✓ Certification prep</li>
                            <li>✓ 24/7 support</li>
                            </ul>
                            <button className="plan-btn">Go Premium</button>
                        </div>
                        </div>
                    </section>

                    </div>
                )}


                {/* Action Buttons */}
                <div className="action-buttons">
                    <button className="action-btn practice-btn" onClick={() => navigate('/pratice')}>
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
                        <button className="view-analytics-btn" onClick={() => navigate('/analytics')}>
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
                        <h3>Quick Actions</h3>
                        <div className="quick-actions-grid">
                            <button className="quick-action-item" onClick={() => navigate('/jam-session')}>
                                <div className="action-icon">⏱️</div>
                                <span>JAM Session</span>
                            </button>
                            <button className="quick-action-item" onClick={() => navigate('/pronunciation')}>
                                <div className="action-icon">🗣️</div>
                                <span>Pronunciation</span>
                            </button>
                            <button className="quick-action-item" onClick={() => navigate('/vocabulary')}>
                                <div className="action-icon">📚</div>
                                <span>Vocabulary</span>
                            </button>
                            <button className="quick-action-item" onClick={() => navigate('/speaking-test')}>
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
        </>
    );
}

export default ProfileData;