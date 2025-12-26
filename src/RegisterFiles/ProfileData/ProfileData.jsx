import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../LandingPageFiles/landing.css';
import '../../CommunicationTestsFiles/test.css';
import './dashboard-minimal.css';
import '../../LandingPageFiles/mobile-responsive.css';
import './profile-mobile.css';
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
    const [testsRemaining, setTestsRemaining] = useState({});
    const [showProfilePopup, setShowProfilePopup] = useState(false);

    //     overall: [
    //         { name: "Alex Johnson", score: 95, avatar: "👨‍💼" },
    //         { name: "Sarah Chen", score: 92, avatar: "👩‍🎓" },
    //         { name: "Mike Wilson", score: 89, avatar: "👨‍🎓" }
    //     ],
    //     jam: [
    //         { name: "Emma Davis", score: 94, avatar: "👩‍💼" },
    //         { name: "John Smith", score: 91, avatar: "👨‍🎓" },
    //         { name: "Lisa Brown", score: 88, avatar: "👩‍🎓" }
    //     ],
    //     test: [
    //         { name: "David Lee", score: 96, avatar: "👨‍💼" },
    //         { name: "Anna Taylor", score: 93, avatar: "👩‍🎓" },
    //         { name: "Chris Wang", score: 90, avatar: "👨‍🎓" }
    //     ]
    // });

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
                        setTestsRemaining(parsedData.tests || {});

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

    // NOTE: removed duplicate profile fetch and analytics code per request - UI uses only name and roll number

    }, []);

    if (loading) {
        return (
            <>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your dashboard...</p>
                </div>
            </>
        );
    }

    const closeProfilePopup = () => {
        setShowProfilePopup(false);
    };


    return (
        <>
            <header className="header">
                <div className="header-content">
                    <div className="logo">
                        <span className="logo-text">Skill Route</span>
                        <div className="nav-links">
                            {/* disable Hover on Home button when cursor is pointed*/}
                            <a
                                href="#"
                                onClick={() => navigate('/profiledata')}
                                style={{
                                    color: "#3B9797",
                                    fontWeight: "600",
                                    textDecoration: "none",
                                    paddingBottom: "6px",
                                    borderBottom: "2.5px solid #3B9797",
                                    cursor: "pointer",
                                    transition: "none",
                                }}
                                >
                                Home
                            </a>

                            <a href="#" onClick={() => navigate('/test')}>Tests</a>
                            <a href="#" onClick={() => navigate('/practice')}>Practice</a>
                            <a href="#" onClick={() => navigate('/student-dashboard')}>Dashboard</a>
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
                            🔥 {userData.streak || 0}
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
                            {userData.roll_no || "Roll No"}
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
                        
                        {/* Mobile Navigation Links */}
                        <div className="mobile-nav-scroll">
                            <a href="#" onClick={() => navigate('/profiledata')}>Home</a>
                            <a href="#" onClick={() => navigate('/test')}>Tests</a>
                            <a href="#" onClick={() => navigate('/practice')}>Practice</a>
                            <a href="#" onClick={() => navigate('/student-dashboard')}>Dashboard</a>
                            <a href="#" onClick={() => navigate('/student-leaderboard')}>Leaderboard</a>
                        </div>
                    </div>
                </div>
            </header>
            <div style={{ padding: '20px', marginTop: '80px' }}>
                <div className="greeting-section" style={{ textAlign: 'left', marginBottom: '40px' }}>
                    <h1 style={{ 
                        fontSize: '2.5rem', 
                        color: '#2c3e50', 
                        marginBottom: '10px',
                        background: 'linear-gradient(135deg, #3B9797, #2c7a7a)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        {greeting}, {userData.full_name || "Student"}! <span style={{ fontSize: '2rem' }}>👋</span>
                    </h1>
                    <p style={{ 
                        fontSize: '1.1rem', 
                        color: '#666',
                        fontStyle: 'italic',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                    }}>
                        "{motivationalQuote}"
                    </p>
                </div>


                {/* Subscription Status */}
                {(userData?.user_type || '').toString().toLowerCase() === "free" && (
                    <>
                    <div className="subscription-banner" style={{
                        background: 'linear-gradient(135deg, #3B9797, #2c7a7a)',
                        borderRadius: '15px',
                        boxShadow: '0 8px 25px rgba(59, 151, 151, 0.3)'
                    }}>
                        <div className="subscription-content">
                            <div className="subscription-icon">🎯</div>
                            <div className="subscription-text">
                                <h3>You're on the Free Plan</h3>
                                <p>Upgrade to unlock unlimited access to all features and premium content</p>
                            </div>
                            <button className="upgrade-btn" 
                                style={{
                                    background: 'white',
                                    color: '#3B9797',
                                    border: '2px solid white',
                                    fontWeight: '600'
                                }}
                                onClick={() => navigate('/pricing')}>Upgrade Now</button>
                        </div>
                    </div>
                    </>
                )}
            </div>
        </>
    );
}


export default ProfileData;
