import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/shared-styles.css";
import "./test-styles.css";

function Test() {
    const [tests, setTests] = useState({});
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
        
        // Fetch user profile and streak data
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
            fetch(import.meta.env.VITE_TEST_RESULTS_API, {
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
                setTests(parsedProfileData.tests || {});
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
            return { avgScore: '0', testCount: 0 };
        }

        const basicLevel = testData.levels.basic || { avgScore: 0, attempts: 0 };
        return {
            avgScore: basicLevel.avgScore?.toFixed(1) || '0',
            testCount: basicLevel.attempts || 0
        };
    };

    const getIntermediateStats = (activityId) => {
        const testMap = {
            'jam': 'jam_test',
            'pronunciation': 'pronu_test', 
            'listening': 'listen_test',
            'situational': 'situation_test',
            'image-speak': 'image_speak'
        };
        
        const testData = apiData[testMap[activityId]];
        if (!testData || !testData.levels) {
            return { avgScore: '0', testCount: 0 };
        }

        const intermediateLevel = testData.levels.intermediate || { avgScore: 0, attempts: 0 };
        return {
            avgScore: intermediateLevel.avgScore?.toFixed(1) || '0',
            testCount: intermediateLevel.attempts || 0
        };
    };

    const getAdvancedStats = (activityId) => {
        const testMap = {
            'jam': 'jam_test',
            'pronunciation': 'pronu_test', 
            'listening': 'listen_test',
            'situational': 'situation_test',
            'image-speak': 'image_speak'
        };
        
        const testData = apiData[testMap[activityId]];
        if (!testData || !testData.levels) {
            return { avgScore: '0', testCount: 0 };
        }

        const advancedLevel = testData.levels.advanced || { avgScore: 0, attempts: 0 };
        return {
            avgScore: advancedLevel.avgScore?.toFixed(1) || '0',
            testCount: advancedLevel.attempts || 0
        };
    };

    const getScoreFromStorage = (testType) => {
        const scores = JSON.parse(localStorage.getItem('testScores') || '{}');
        return scores[testType] || 0;
    };
    const isInterviewLevelUnlocked = (level) => {
        if (level === 1) return true;
        const prevLevel = level - 1;
        const prevScore = getScoreFromStorage(`interview_level_${prevLevel}`);
        return prevScore >= 70;
    };

    // const interviewLevels = [
    //     {
    //         level: 1,
    //         title: 'Basic Interview Tests',
    //         color: '#28a745',
    //         steps: [
    //             { id: 1, title: 'JD-Based Self Introduction', activities: '' },
    //             { id: 2, title: 'Programming Knowledge', activities: '' },
    //             { id: 3, title: 'Worked Domain', activities: '' },
    //             { id: 4, title: 'Project Discussion', activities: '' },
    //             { id: 5, title: 'Future Career Planning', activities: '' },
    //             { id: 6, title: 'Hobbies & Interests', activities: '' },
    //             { id: 7, title: 'Certifications & Internships', activities: '' }
    //         ]
    //     },
    //     {
    //         level: 2,
    //         title: 'Advanced Interview Tests',
    //         color: '#007bff',
    //         steps: [
    //             { id: 8, title: 'Role-Based Interview', activities: '' },
    //             { id: 9, title: 'Resume-Based Interview', activities: '' },
    //             { id: 10, title: 'Technical Interview', activities: '' },
    //             { id: 11, title: 'Follow-Up Questioning', activities: '' },
    //             { id: 12, title: 'Stress/Pressure Questions', activities: '' },
    //             { id: 13, title: 'Logical Puzzles', activities: '' }
    //         ]
    //     }
    // ];

    const activities = [
        {
            id: 'jam',
            title: 'JAM Sessions',
            description: 'JAM speaking sessions to improve spontaneous communication',
            count: tests.jam_test || 0,
            route: '/test/jam'
        },
        {
            id: 'pronunciation',
            title: 'Pronunciation Test',
            description: 'Perfect your pronunciation with AI-powered feedback',
            count: tests.pronu_test || 0,
            route: '/test/pronunciation'
        },
        {
            id: 'listening',
            title: 'Listening Test',
            description: 'Enhance comprehension with interactive listening exercises',
            count: tests.listen_test || 0,
            route: '/test/listening'
        },
        {
            id: 'situational',
            title: 'Situational Speaking',
            description: 'Practice real-life scenarios to build confidence',
            count: tests.situation_test || 0,
            route: '/test/situation-speak'
        },
        {
            id: 'image-speak',
            title: 'Image-Based Speaking',
            description: 'Describe images to enhance vocabulary and fluency',
            count: tests.image_speak || 0,
            route: '/test/image-speak'
        }
    ];

const testInstructions = {

    jam: [
        {
        title: "Instructions for JAM",
        content: (
            <strong>
            - You will be given a <b>random topic</b> by{" "}
            <b style={{ fontFamily: "Arial", fontSize: "22px" }}>Tara AI</b>.<br />
            - You will have <b>1 minute</b> to speak continuously.<br />
            - Focus on <b>content relevance, clarity, fluency, confidence</b>.
            </strong>
        )
        },
        {
        title: "Microphone Rules",
        content: (
            <strong>
            - Microphone access is provided <b>only once</b>.<br />
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
            -{" "}
            <b style={{ fontSize: "21px" }}>
                Tara AI
            </b>{" "}
            rewards strong grammar and vocabulary with higher scores.
            </strong>
        )
        },
        {
        title: "Confidence & Delivery",
        content: (
            <strong>
            - Speak clearly with a steady pace.<br />
            - Sit in a quiet place and speak confidently with{" "}
            <b>Tara AI</b>.
            </strong>
        )
        },
        {
        title: "Watch How to Take the JAM Test",
        content: (
            <iframe
            width="100%"
            height="250"
            src="https://www.youtube.com/embed/0pNcWTG9Y8M"
            title="JAM Practice"
            frameBorder="0"
            allowFullScreen
            />
        )
        }
    ],

    pronunciation: [
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
            -{" "}
            <b style={{ fontSize: "21px" }}>
                Tara AI
            </b>{" "}
            analyzes sound accuracy precisely.
            </strong>
        )
        },
        {
        title: "How to Practice Pronunciation",
        content: (
            <iframe
            width="100%"
            height="250"
            src="https://www.youtube.com/embed/0pNcWTG9Y8M"
            title="Pronunciation Practice"
            frameBorder="0"
            allowFullScreen
            />
        )
        }
    ],

    listening: [
        {
        title: "Listening Test Instructions",
        content: (
            <strong>
            - You will hear <b>audio clips</b> carefully curated by{" "}
            <b>Tara AI</b>.<br />
            - Listen attentively before answering.
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
        title: "Answer Carefully",
        content: (
            <strong>
            - Questions are based on <b>details and understanding</b>.<br />
            - Tara AI evaluates comprehension accuracy.
            </strong>
        )
        },
        {
        title: "How to Take the Listening Test",
        content: (
            <iframe
            width="100%"
            height="250"
            src="https://www.youtube.com/embed/0pNcWTG9Y8M"
            title="Listening Practice"
            frameBorder="0"
            allowFullScreen
            />
        )
        }
    ],

    situational: [
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
            -{" "}
            <b style={{ fontSize: "21px" }}>
                Tara AI
            </b>{" "}
            evaluates reasoning, clarity, and confidence.
            </strong>
        )
        },
        {
        title: "How to Practice Situational Speaking",
        content: (
            <iframe
            width="100%"
            height="250"
            src="https://www.youtube.com/embed/0pNcWTG9Y8M"
            title="Situational Practice"
            frameBorder="0"
            allowFullScreen
            />
        )
        }
    ],

    "image-speak": [
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
        },
        {
        title: "How to Take Image Speaking Test",
        content: (
            <iframe
            width="100%"
            height="250"
            src="https://www.youtube.com/embed/ReZgqLI3Hq0"
            title="Image Speaking Practice"
            frameBorder="0"
            allowFullScreen
            />
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
        const currentInstructions = testInstructions[activeChallenge];
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
        if (activity?.route) {
            navigate(activity.route, {
                state: {
                    remainingTests: activity.count || 0,
                    testKey: activeChallenge,
                    testLevel: selectedLevel
                }
            });
        }
    };

    if (loading) {
        return (
            <div className="app-loading-container app-bg-free">
                <div className="app-loading-spinner"></div>
                <p>Loading tests...</p>
            </div>
        );
    }


    return (
        <div className="test-container app-bg-free">
            <div className="test-div">
                <center>
                    <h1 className="test-title">Communication Assessments with TaraAI</h1>
                    <p className="test-activity-des">From everyday speaking activities to interview-level assessments,<br></br> TaraAI helps you practice, evaluate, and improve your communication skills with smart feedback and progress tracking.</p>
                    <div className="test-announcement-banner delayed">
                        <span className="test-announcement-text">Image-Based Speaking</span>
                        <span className="test-coming-soon-badge">Coming Soon</span>
                    </div><br></br>
                </center>

                <div className={`test-activity-grid ${activeChallenge ? 'blurred' : ''}`}>
                    {activities.map((activity) => {
                        const stats = getTestStats(activity.id);
                        return (
                            <div key={activity.id} className="test-activity-card">
                                <h3 className="test-activity-title">{activity.title}</h3>
                                <p className="test-activity-description">{activity.description}</p>
                                <div style={{paddingBottom:"15px"}}>Remaining Chances: {activity.count}</div>
                                <div className="test-card-content">
                                    <div className="test-activity-buttons">
                                        
                                        {activity.id === 'image-speak' ? (
                                            <button className="test-level-button-coming-soon" disabled>
                                                <span>Basic</span>
                                                <span className="test-coming-soon-indicator">SOON</span>
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => activity.count > 0 ? handleStartChallenge(activity.id, 'basic') : null}
                                                className={activity.count > 0 ? "test-level-button" : "app-btn-disabled"}
                                                disabled={activity.count === 0}
                                            >
                                                Basic
                                            </button>
                                        )}
                                        {(activity.id === 'jam' || activity.id === 'situational' || activity.id === 'pronunciation' || activity.id === 'listening') ? (
                                            <>
                                                <button 
                                                    onClick={() => userType === 'premium' && activity.count > 0 ? handleStartChallenge(activity.id, 'intermediate') : null}
                                                    className={userType === 'premium' && activity.count > 0 ? "test-level-button" : "app-btn-disabled"}
                                                    disabled={userType !== 'premium' || activity.count === 0}
                                                >
                                                    <span>Intermediate</span>
                                                    {userType !== 'premium' && (
                                                        <span className="test-premium-indicator">- BUY PREMIUM</span>
                                                    )}
                                                </button>
                                                <button 
                                                    onClick={() => userType === 'premium' && activity.count > 0 ? handleStartChallenge(activity.id, 'advanced') : null}
                                                    className={userType === 'premium' && activity.count > 0 ? "test-level-button" : "app-btn-disabled"}
                                                    disabled={userType !== 'premium' || activity.count === 0}
                                                >
                                                    <span>Advanced</span>
                                                    {userType !== 'premium' && (
                                                        <span className="test-premium-indicator">- BUY PREMIUM</span>
                                                    )}
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="test-level-button-coming-soon" disabled>
                                                    <span>Intermediate</span>
                                                    <span className="test-coming-soon-indicator">SOON</span>
                                                </button>
                                                <button className="test-level-button-coming-soon" disabled>
                                                    <span>Advanced</span>
                                                    <span className="test-coming-soon-indicator">SOON</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    <div className="test-activity-stats">
                                        <div className="test-activity-stats-text">
                                            <div>Basic-Avg Score: {loading ? '...' : stats.avgScore}</div>
                                            <div>Intermed-Avg Score: {loading ? '...' : getIntermediateStats(activity.id).avgScore}</div>
                                            <div>Advance-Avg Score: {loading ? '...' : getAdvancedStats(activity.id).avgScore}</div>
                                            <div>Basic Test Count: {loading ? '...' : stats.testCount}</div>
                                            <div>Intermed Test Count: {loading ? '...' : getIntermediateStats(activity.id).testCount}</div>
                                            <div>Advance Test Count: {loading ? '...' : getAdvancedStats(activity.id).testCount}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* <div className={`test-interview-section ${activeChallenge ? 'blurred' : ''}`}>
                    {interviewLevels.map((level, levelIndex) => {
                        const unlocked = isInterviewLevelUnlocked(level.level);
                        
                        return (
                            <div key={level.level} className="test-interview-level">
                                <h1 className="test-interview-level-title">{level.title}</h1>
                                
                                <div className="test-roadmap-row">
                                    {level.steps.map((step, stepIndex) => {
                                        const stepUnlocked = unlocked && (stepIndex === 0 || getScoreFromStorage(`interview_step_${step.id - 1}`) >= 70);
                                        
                                        return (
                                            <React.Fragment key={step.id}>
                                                <div className={`test-roadmap-step ${stepUnlocked ? 'unlocked' : 'locked'}`}>
                                                    <div className={`test-step-number ${stepUnlocked ? 'unlocked' : 'locked'}`}>
                                                        {stepUnlocked ? step.id : '🔒'}
                                                    </div>
                                                    <div className="test-step-content">
                                                        <h4 className={stepUnlocked ? 'unlocked' : 'locked'}>
                                                            {step.title}
                                                        </h4>
                                                        <p className={stepUnlocked ? 'unlocked' : 'locked'}>
                                                            {step.activities}
                                                        </p>
                                                    </div>
                                                    {stepUnlocked && (
                                                        <button className="test-step-start-button">
                                                            START STEP
                                                        </button>
                                                    )}
                                                </div>
                                                {stepIndex < level.steps.length - 1 && (
                                                    <div className="test-roadmap-connector horizontal"></div>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                                
                                {levelIndex < interviewLevels.length - 1 && (
                                    <div className="test-roadmap-connector vertical-center"></div>
                                )}
                            </div>
                        );
                    })}
                    
                    <div className="test-progress-section">
                        <div className="test-progress-card">
                            <div className="test-progress-bar">
                                <div className="test-progress-fill"></div>
                            </div>
                            <div className="test-progress-text">Complete Your Interview Journey</div>
                        </div>
                    </div>
                </div> */}

                {activeChallenge && (
                    <div className="app-modal-overlay">
                        <div className="test-modal">
                            <button 
                                onClick={() => setActiveChallenge(null)}
                                className="app-modal-close"
                            >
                                ×
                            </button>
                            
                            <h2 className="test-modal-title">
                                {testInstructions[activeChallenge]?.[instructionIndex]?.title}
                            </h2>
                            
                            <div className="test-modal-content">
                                {typeof testInstructions[activeChallenge]?.[instructionIndex]?.content === 'string' ? (
                                    <p className="test-modal-text">
                                        {testInstructions[activeChallenge][instructionIndex].content}
                                    </p>
                                ) : (
                                    testInstructions[activeChallenge]?.[instructionIndex]?.content
                                )}
                            </div>
                            
                            <div className="test-modal-actions">
                                {instructionIndex > 0 && (
                                    <button 
                                        onClick={handlePrev}
                                        className="app-btn-secondary"
                                    >
                                        ← Previous
                                    </button>
                                )}
                                
                                <div className="test-modal-nav">
                                    {instructionIndex < testInstructions[activeChallenge]?.length - 1 ? (
                                        <>
                                            <button 
                                                onClick={handleNext}
                                                className="app-btn-primary"
                                            >
                                                Next →
                                            </button>
                                            <button 
                                                onClick={() => setInstructionIndex(testInstructions[activeChallenge].length - 1)}
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
                                            START TEST
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

export default Test;