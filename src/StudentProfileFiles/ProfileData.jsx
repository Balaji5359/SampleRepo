import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login_Navbar from "../RegisterFiles/Login_Navbar";
import "./profile.css";

function ProfileData() {
    const navigate = useNavigate();
    const [apiData, setApi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [subscriptionData, setSubscriptionData] = useState(null);
    const [daysLeft, setDaysLeft] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
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

    const testModules = [
        {
            id: 1,
            name: "Machine Learning Fundamentals",
            description: "Master the basics of ML algorithms, supervised and unsupervised learning.",
            videoId: "aircAruvnKk",
            isPro: false
        },
        {
            id: 2,
            name: "Deep Learning with Neural Networks",
            description: "Dive deep into neural networks, backpropagation, and deep learning frameworks.",
            videoId: "CS4cs9xVecI",
            isPro: true
        },
        {
            id: 3,
            name: "Cloud Computing Essentials",
            description: "Learn AWS, Azure, and Google Cloud fundamentals for modern applications.",
            videoId: "M988_fsOSWo",
            isPro: false
        },
        {
            id: 4,
            name: "Generative AI & LLMs",
            description: "Explore GPT, BERT, and other transformer models for AI applications.",
            videoId: "kCc8FmEb1nY",
            isPro: true
        }
    ];

    const openTestPopup = (test) => {
        setSelectedTest(test);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedTest(null);
    };

    useEffect(() => {
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
                        
                        // Check for subscription data
                        if (parsedData.subscription_plan && parsedData.payment_status === 'success') {
                            setSubscriptionData({
                                subscription_plan: parsedData.subscription_plan,
                                payment_status: parsedData.payment_status,
                                payment_date: parsedData.payment_date,
                                payment_time: parsedData.payment_time,
                                payment_id: parsedData.payment_id
                            });
                            
                            // Calculate days left
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
                {/* Welcome Section */}
                <div className="">
                    <div className="">
                        <h1>Welcome back, {userData.Name || "Student"}!</h1>
                        <p>Continue your journey in Communication with Lingua AI</p>
                    </div>
                </div>

                {/* Main Dashboard Grid */}
                <div className="">
                    {/* Interested Fields */}
                    <div className="interested-fields">
                        {userData.user_type === 'free' && (
                            <Link to="/pro-plans">
                                <button className="btn">🚀 Upgrade to Pro</button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Test Popup */}
                {showPopup && selectedTest && (
                    <div className="popup-overlay" onClick={closePopup}>
                        <div className="test-popup" onClick={(e) => e.stopPropagation()}>
                            <div className="popup-header">
                                <h3>{selectedTest.name}</h3>
                                <button className="close-btn" onClick={closePopup}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="popup-content">
                                <p>{selectedTest.description}</p>
                                <div className="video-container">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${selectedTest.videoId}`}
                                        title={selectedTest.name}
                                        frameBorder="0"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                                <div className="popup-actions">
                                    <button className="start-challenge-btn">
                                        <i className="fas fa-play"></i>
                                        Start Challenge
                                    </button>
                                    <button className="back-btn" onClick={closePopup}>
                                        <i className="fas fa-arrow-left"></i>
                                        Back
                                    </button>
                                </div>
                                {selectedTest.isPro && userData.user_type === 'free' && (
                                    <div className="pro-notice">
                                        <span className="pro-label">By Pro</span>
                                        <Link to="/pro-plans">
                                            <button className="buy-pro-btn">Buy Pro</button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ProfileData;