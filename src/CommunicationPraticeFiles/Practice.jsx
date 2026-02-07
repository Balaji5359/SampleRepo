import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/shared-styles.css";
import "./practice-styles.css";
import Header from '../components/Header';

function Practice() {
    const [practices, setPractices] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState('basic');
    const [instructionIndex, setInstructionIndex] = useState(0);
    const [userName, setUserName] = useState("");
    const [apiData, setApiData] = useState({});
    const [userType, setUserType] = useState('free');
    const [streakData, setStreakData] = useState({ current_streak: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        if (!storedEmail) {
            setLoading(false);
            return;
        }  
        
        // Fetch user profile and practice data
        Promise.all([
            fetch(import.meta.env.VITE_STUDENT_PROFILE_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ college_email: storedEmail }),
            }),
            fetch(import.meta.env.VITE_UPDATE_USER_STREAK_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    body: JSON.stringify({
                        college_email: storedEmail,
                        get_streak_data: true
                    })
                })
            }),
            fetch(import.meta.env.VITE_PRACTICE_RESULTS_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ college_email: storedEmail })
            })
        ])
        .then(async ([profileResponse, streakResponse, dashboardResponse]) => {
            const profileData = await profileResponse.json();
            const streakDataResult = await streakResponse.json();
            const dashboardData = await dashboardResponse.json();
            
            if (profileData?.body) {
                const parsedProfileData = typeof profileData.body === "string" ? JSON.parse(profileData.body) : profileData.body;
                setPractices(parsedProfileData.practices || {});
                setUserType(parsedProfileData.user_type === 'premium' && parsedProfileData.premium_status === 'active' ? 'premium' : 'free');
            }
            
            if (streakDataResult?.body) {
                const parsedStreakData = typeof streakDataResult.body === "string" ? JSON.parse(streakDataResult.body) : streakDataResult.body;
                setStreakData(parsedStreakData);
            }
            
            if (dashboardData?.body) {
                const parsedDashboardData = JSON.parse(dashboardData.body).dashboard;
                setApiData(parsedDashboardData);
            }
            
            setLoading(false);
        })
        .catch(() => setLoading(false));
    }, []);


    const getPracticeStats = (activityId) => {
        const practiceMap = {
            'jam_practice': 'jam_practice',
            'pronu_practice': 'pronu_practice', 
            'listen_practice': 'listen_practice',
            'situation_practice': 'situation_practice',
            'image_speak_practice': 'image_speak_practice'
        };
        
        const practiceData = apiData[practiceMap[activityId]];
        if (!practiceData || !practiceData.levels) {
            return { avgScore: '0', practiceCount: 0 };
        }

        const basicLevel = practiceData.levels.basic || { avgScore: 0, attempts: 0 };
        return {
            avgScore: basicLevel.avgScore?.toFixed(1) || '0',
            practiceCount: basicLevel.attempts || 0
        };
    };

    const getIntermediateStats = (activityId) => {
        const practiceMap = {
            'jam_practice': 'jam_practice',
            'pronu_practice': 'pronu_practice', 
            'listen_practice': 'listen_practice',
            'situation_practice': 'situation_practice',
            'image_speak_practice': 'image_speak_practice'
        };
        
        const practiceData = apiData[practiceMap[activityId]];
        if (!practiceData || !practiceData.levels) {
            return { avgScore: '0', practiceCount: 0 };
        }

        const intermediateLevel = practiceData.levels.intermediate || { avgScore: 0, attempts: 0 };
        return {
            avgScore: intermediateLevel.avgScore?.toFixed(1) || '0',
            practiceCount: intermediateLevel.attempts || 0
        };
    };

    const getAdvancedStats = (activityId) => {
        const practiceMap = {
            'jam_practice': 'jam_practice',
            'pronu_practice': 'pronu_practice', 
            'listen_practice': 'listen_practice',
            'situation_practice': 'situation_practice',
            'image_speak_practice': 'image_speak_practice'
        };
        
        const practiceData = apiData[practiceMap[activityId]];
        if (!practiceData || !practiceData.levels) {
            return { avgScore: '0', practiceCount: 0 };
        }

        const advancedLevel = practiceData.levels.advanced || { avgScore: 0, attempts: 0 };
        return {
            avgScore: advancedLevel.avgScore?.toFixed(1) || '0',
            practiceCount: advancedLevel.attempts || 0
        };
    };

    const activities = [
        {
            id: 'jam_practice',
            title: 'JAM Practice',
            description: 'JAM speaking sessions to improve spontaneous communication',
            count: practices.jam_practice || 0
        },
        {
            id: 'pronu_practice',
            title: 'Pronunciation Practice',
            description: 'Perfect your pronunciation with AI-powered feedback',
            count: practices.pronu_practice || 0
        },
        {
            id: 'listen_practice',
            title: 'Listening Practice',
            description: 'Enhance comprehension with interactive listening exercises',
            count: practices.listen_practice || 0
        },
        {
            id: 'situation_practice',
            title: 'Situational Speaking',
            description: 'Practice real-life scenarios to build confidence',
            count: practices.situation_practice || 0
        },
        {
            id: 'image_speak_practice',
            title: 'Image-Based Speaking',
            description: 'Describe images to enhance vocabulary and fluency',
            count: practices.image_speak_practice || 0
        }
    ];

    const practiceInstructions = {
        jam_practice: [
            {
                title: "Instructions for JAM Practice",
                content: (
                    <strong>
                    - You will be given a <b>random topic</b> by <b style={{ fontFamily: "Arial", fontSize: "22px" }}>Tara AI</b>.<br />
                    - You will have <b>1 minute</b> to speak continuously.<br />
                    - Focus on <b>content relevance, clarity, fluency, confidence</b>.
                    </strong>
                )
            },
            {
                title: "Microphone Rules",
                content: (
                    <strong>
                    - Microphone access is provided continuously.<br />
                    - Take a few seconds to think before you start speaking.
                    </strong>
                )
            },
            {
                title: "Grammar & Vocabulary",
                content: (
                    <strong>
                    - Use correct sentence structures.<br />
                    - Avoid fillers like <i>um, uh, so</i>.<br />
                    - <b style={{ fontSize: "21px" }}>Tara AI</b> rewards strong grammar and vocabulary with higher scores.
                    </strong>
                )
            },
            {
                title: "Confidence & Delivery",
                content: (
                    <strong>
                    - Speak clearly with a steady pace.<br />
                    - Sit in a quiet place and speak confidently with <b>Tara AI</b>.
                    </strong>
                )
            }
        ],

        pronu_practice: [
            {
                title: "Pronunciation Practice Overview",
                content: (
                    <strong>
                    - You will be given <b>words or sentences</b> to pronounce.<br />
                    - Focus on <b>clarity, accuracy, and correct sounds</b>.
                    </strong>
                )
            },
            {
                title: "Clarity & Articulation",
                content: (
                    <strong>
                    - Pronounce each sound clearly.<br />
                    - Avoid rushing through words.
                    </strong>
                )
            },
            {
                title: "Accuracy Matters",
                content: (
                    <strong>
                    - Incorrect pronunciation affects your score.<br />
                    - <b style={{ fontSize: "21px" }}>Tara AI</b> analyzes sound accuracy precisely.
                    </strong>
                )
            }
        ],

        listen_practice: [
            {
                title: "Listening Practice Instructions",
                content: (
                    <strong>
                    - You will hear <b>audio clips</b> carefully curated by <b>Tara AI</b>.<br />
                    - Listen attentively before responding.
                    </strong>
                )
            },
            {
                title: "Focus & Attention",
                content: (
                    <strong>
                    - Use headphones for better clarity.<br />
                    - Avoid distractions while listening.
                    </strong>
                )
            },
            {
                title: "Response Carefully",
                content: (
                    <strong>
                    - Respond based on <b>details and understanding</b>.<br />
                    - Tara AI evaluates comprehension accuracy.
                    </strong>
                )
            }
        ],

        situation_practice: [
            {
                title: "Situational Speaking Overview",
                content: (
                    <strong>
                    - You will be given a <b>real-life situation</b>.<br />
                    - Respond as you would in an interview or workplace.
                    </strong>
                )
            },
            {
                title: "Think Before You Speak",
                content: (
                    <strong>
                    - Analyze the problem logically.<br />
                    - Structure your response clearly.
                    </strong>
                )
            },
            {
                title: "Professional Communication",
                content: (
                    <strong>
                    - Maintain a professional tone.<br />
                    - <b style={{ fontSize: "21px" }}>Tara AI</b> evaluates reasoning, clarity, and confidence.
                    </strong>
                )
            }
        ],

        image_speak_practice: [
            {
                title: "Image Speaking Instructions",
                content: (
                    <strong>
                    - You will be shown an <b>image</b>.<br />
                    - Describe what you observe clearly and confidently.
                    </strong>
                )
            },
            {
                title: "Observation Skills",
                content: (
                    <strong>
                    - Focus on key elements in the image.<br />
                    - Organize your description logically.
                    </strong>
                )
            },
            {
                title: "Fluency & Structure",
                content: (
                    <strong>
                    - Avoid long pauses.<br />
                    - Tara AI evaluates clarity, structure, and fluency.
                    </strong>
                )
            }
        ]
    };

    const handleStartChallenge = (id, level = 'basic') => {
        setActiveChallenge(id);
        setSelectedLevel(level);
        setInstructionIndex(0);
    };

    const handleNext = () => {
        const currentInstructions = practiceInstructions[activeChallenge];
        if (instructionIndex < currentInstructions.length - 1) {
            setInstructionIndex(instructionIndex + 1);
        }
    };

    const handlePrev = () => {
        if (instructionIndex > 0) {
            setInstructionIndex(instructionIndex - 1);
        }
    };

    const handleLaunchChallenge = () => {
        const activity = activities.find(a => a.id === activeChallenge);
        if (activity) {
            const routeMap = {
                'jam_practice': 'jam',
                'pronu_practice': 'pronunciation',
                'listen_practice': 'listening',
                'situation_practice': 'situation',
                'image_speak_practice': 'image-speak'
            };

            navigate(`/practice/${routeMap[activeChallenge]}`, {
                state: {
                    remainingPractices: activity.count || 0,
                    practiceType: activeChallenge,
                    practiceLevel: selectedLevel
                }
            });
        }
    };

    if (loading) {
        return (
            <div className="app-loading-container app-bg-free">
                <div className="app-loading-spinner"></div>
                <p>Loading practices...</p>
            </div>
        );
    }

    return (
        <div className="practice-container app-bg-free">
            <Header />
            <div className="practice-div">
                <center>
                    <h2 className="practice-title">Practice and Improve Your Communication Skills with TaraAI... now</h2>
                    <p className="test-activity-des">Practice your communication skills through guided speaking, listening, pronunciation, and real-life scenario exercises. <br></br>TaraAI helps you improve step by step with smart feedback and progress tracking.</p>
                    <div className="practice-announcement-banner">
                        <span className="practice-announcement-text">
                            Intermediate and Advanced levels will be unlocked based on your average score from the latest 10 practices
                        </span>
                        <span className="practice-coming-soon-badge">will be be activated soon</span>
                    </div><br></br>
                    <div className="practice-announcement-banner delayed">
                        <span className="practice-announcement-text">Image Based Speaking</span>
                        <span className="practice-coming-soon-badge">Coming Soon</span>
                    </div>
                </center>

                <div className={`practice-activity-grid ${activeChallenge ? 'blurred' : ''}`}>
                    {activities.map((activity) => {
                        const stats = getPracticeStats(activity.id);
                        return (
                            <div key={activity.id} className="practice-activity-card">
                                <h3 className="practice-activity-title">{activity.title}</h3>
                                <p className="practice-activity-description">{activity.description}</p>
                                <div style={{paddingBottom:"15px"}}>Remaining Practices: {activity.count}</div>
                                <div className="practice-card-content">
                                    <div className="practice-activity-buttons">
                                        {activity.id === 'image_speak_practice' ? (
                                            <button className="practice-level-button-coming-soon" disabled>
                                                <span>Basic</span>
                                                <span className="practice-coming-soon-indicator"> - SOON</span>
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => activity.count > 0 ? handleStartChallenge(activity.id, 'basic') : null}
                                                className={activity.count > 0 ? "practice-level-button" : "app-btn-disabled"}
                                                disabled={activity.count === 0}
                                            >
                                                Basic
                                            </button>
                                        )}

                                        {activity.id === 'image_speak_practice' ? (
                                            <>
                                                <button className="practice-level-button-coming-soon" disabled>
                                                    <span>Intermediate</span>
                                                    <span className="practice-coming-soon-indicator"> - SOON</span>
                                                </button>
                                                <button className="practice-level-button-coming-soon" disabled>
                                                    <span>Advanced</span>
                                                    <span className="practice-coming-soon-indicator"> - SOON</span>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={() => userType === 'premium' && activity.count > 0 ? handleStartChallenge(activity.id, 'intermediate') : null}
                                                    className={userType === 'premium' && activity.count > 0 ? "practice-level-button" : "app-btn-disabled"}
                                                    disabled={userType !== 'premium' || activity.count === 0}
                                                >
                                                    <span>Intermediate</span>
                                                    {userType !== 'premium' && (
                                                        <span className="practice-premium-indicator">- BUY PREMIUM</span>
                                                    )}
                                                </button>

                                                <button 
                                                    onClick={() => userType === 'premium' && activity.count > 0 ? handleStartChallenge(activity.id, 'advanced') : null}
                                                    className={userType === 'premium' && activity.count > 0 ? "practice-level-button" : "app-btn-disabled"}
                                                    disabled={userType !== 'premium' || activity.count === 0}
                                                >
                                                    <span>Advanced</span>
                                                    {userType !== 'premium' && (
                                                        <span className="practice-premium-indicator">- BUY PREMIUM</span>
                                                    )}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    {/* <div className="practice-activity-stats">
                                        <div className="practice-activity-stats-text">
                                            <div>Basic-Avg Score: {loading ? '...' : stats.avgScore}</div>
                                            <div>Intermed-Avg Score: {loading ? '...' : getIntermediateStats(activity.id).avgScore}</div>
                                            <div>Advance-Avg Score: {loading ? '...' : getAdvancedStats(activity.id).avgScore}</div>
                                            <div>Basic Practice Count: {loading ? '...' : stats.practiceCount}</div>
                                            <div>Intermed Practice Count: {loading ? '...' : getIntermediateStats(activity.id).practiceCount}</div>
                                            <div>Advance Practice Count: {loading ? '...' : getAdvancedStats(activity.id).practiceCount}</div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {activeChallenge && (
                    <div className="app-modal-overlay">
                        <div className="practice-modal">
                            <button 
                                onClick={() => setActiveChallenge(null)}
                                className="app-modal-close"
                            >
                                ×
                            </button>
                            
                            <h2 className="practice-modal-title">
                                {practiceInstructions[activeChallenge]?.[instructionIndex]?.title}
                            </h2>
                            
                            <div className="practice-modal-content">
                                {typeof practiceInstructions[activeChallenge]?.[instructionIndex]?.content === 'string' ? (
                                    <p className="practice-modal-text">
                                        {practiceInstructions[activeChallenge][instructionIndex].content}
                                    </p>
                                ) : (
                                    practiceInstructions[activeChallenge]?.[instructionIndex]?.content
                                )}
                            </div>
                            
                            <div className="practice-modal-actions">
                                {instructionIndex > 0 && (
                                    <button 
                                        onClick={handlePrev}
                                        className="app-btn-secondary"
                                    >
                                        ← Previous
                                    </button>
                                )}
                                
                                <div className="practice-modal-nav">
                                    {instructionIndex < practiceInstructions[activeChallenge]?.length - 1 ? (
                                        <>
                                            <button 
                                                onClick={handleNext}
                                                className="app-btn-primary"
                                            >
                                                Next →
                                            </button>
                                            <button 
                                                onClick={() => setInstructionIndex(practiceInstructions[activeChallenge].length - 1)}
                                                className="app-btn-success"
                                            >
                                                Skip
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={handleLaunchChallenge}
                                            className="app-btn-danger"
                                        >
                                            START PRACTICE
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Practice;
