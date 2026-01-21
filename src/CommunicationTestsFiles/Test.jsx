import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/shared-styles.css";
import "./test-styles.css";
import Header from '../components/Header';

function Test() {
    const [tests, setTests] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeChallenge, setActiveChallenge] = useState(null);
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
            fetch('https://ntjkr8rnd6.execute-api.ap-south-1.amazonaws.com/dev/student_profilecreate/student_profile_senddata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ college_email: storedEmail }),
            }),
            fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/update-user-streak', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    body: JSON.stringify({
                        college_email: storedEmail,
                        get_streak_data: true
                    })
                })
            }),
            fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/comm-test-send-results', {
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
            'jam': 'jam',
            'pronunciation': 'pronunciation', 
            'listening': 'listening',
            'situational': 'situation',
            'image-speak': 'image_speak'
        };
        
        const testData = apiData[testMap[activityId]];
        if (!testData) {
            return { avgScore: '0', testCount: 0 };
        }

        return {
            avgScore: testData.avgScore?.toFixed(1) || '0',
            testCount: testData.tests || 0
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

    const interviewLevels = [
        {
            level: 1,
            title: 'Basic Interview Tests',
            color: '#28a745',
            steps: [
                { id: 1, title: 'JD-Based Self Introduction', activities: '' },
                { id: 2, title: 'Programming Knowledge', activities: '' },
                { id: 3, title: 'Worked Domain', activities: '' },
                { id: 4, title: 'Project Discussion', activities: '' },
                { id: 5, title: 'Future Career Planning', activities: '' },
                { id: 6, title: 'Hobbies & Interests', activities: '' },
                { id: 7, title: 'Certifications & Internships', activities: '' }
            ]
        },
        {
            level: 2,
            title: 'Advanced Interview Tests',
            color: '#007bff',
            steps: [
                { id: 8, title: 'Role-Based Interview', activities: '' },
                { id: 9, title: 'Resume-Based Interview', activities: '' },
                { id: 10, title: 'Technical Interview', activities: '' },
                { id: 11, title: 'Follow-Up Questioning', activities: '' },
                { id: 12, title: 'Stress/Pressure Questions', activities: '' },
                { id: 13, title: 'Logical Puzzles', activities: '' }
            ]
        }
    ];

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
            { title: "Instructions", content: "You've been given a random topic! You will have 1 minute to speak. Focus on fluency, clarity, and confidence." },
            { title: "Fluency", content: "Maintain a smooth and uninterrupted flow of speech." },
            { title: "Grammar", content: "Use correct sentence structures and grammatical conventions." },
            { title: "Confidence", content: "Speak with assurance and composure." }
        ],
        pronunciation: [
            { title: "Instructions", content: "Improve your pronunciation by practicing words and sentences. Focus on clarity and accuracy." },
            { title: "Clarity", content: "Speak clearly, enunciating each sound." },
            { title: "Accuracy", content: "Pronounce words correctly." }
        ],
        listening: [
            { title: "Instructions", content: "Enhance your listening comprehension with interactive exercises." },
            { title: "Focus", content: "Listen carefully to audio clips and answer questions." }
        ],
        situational: [
            { title: "Instructions", content: "Respond to real-life situations with appropriate communication." },
            { title: "Context", content: "Analyze the situation and respond appropriately." }
        ],
        "image-speak": [
            { title: "Instructions", content: "Describe the given image in detail." },
            { title: "Observation", content: "Note key elements in the image." }
        ]
    };

    const handleStartChallenge = (id) => {
        setActiveChallenge(id);
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
                    testKey: activeChallenge
                }
            });
        }
    };

    if (loading) {
        return (
            <div className="loading-container free-bg">
                <div className="loading-spinner"></div>
                <p>Loading tests...</p>
            </div>
        );
    }


    return (
        <div className="test-container">
            <Header />

            <div className="test-div">
                <center>
                    <h1 className="test-title">Communication Tests</h1>
                    <div className="announcement-banner">
                        <span className="announcement-text">
                            Intermediate and Advanced levels will be unlocked based on your average score from the latest 10 tests
                        </span>
                        <span className="coming-soon-badge">Coming Soon</span>
                    </div>
                    <br/>
                    <div className="announcement-banner delayed">
                        <span className="announcement-text">Image-Based Speaking</span>
                        <span className="coming-soon-badge">Coming Soon</span>
                    </div>
                </center>

                <div className={`activity-grid ${activeChallenge ? 'blurred' : ''}`}>
                    {activities.map((activity) => {
                        const stats = getTestStats(activity.id);
                        return (
                            <div key={activity.id} className="activity-card">
                                <h3 className="activity-title">{activity.title}</h3>
                                <p className="activity-description">{activity.description}</p>
                                <div className="card-content">
                                    <div className="activity-buttons">
                                        <button 
                                            onClick={() => activity.count > 0 ? handleStartChallenge(activity.id) : null}
                                            className={activity.count > 0 ? "level-button" : "btn-disabled"}
                                            disabled={activity.count === 0}
                                        >
                                            Basic Level
                                        </button>
                                        <button className="level-button-coming-soon" disabled>
                                            <span>Intermediate Level</span>
                                            <div className="level-button-shimmer"></div>
                                            <span className="soon-badge">SOON</span>
                                        </button>
                                        <button className="level-button-coming-soon" disabled>
                                            <span>Advanced Level</span>
                                            <div className="level-button-shimmer delayed"></div>
                                            <span className="soon-badge red">SOON</span>
                                        </button>
                                    </div>
                                    <div className="activity-stats">
                                        <div className="activity-stats-text">
                                            <div>Remaining: {activity.count}</div>
                                            <div>Avg Score: {loading ? '...' : stats.avgScore}</div>
                                            <div>Test Count: {loading ? '...' : stats.testCount}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={`interview-section ${activeChallenge ? 'blurred' : ''}`}>
                    {interviewLevels.map((level, levelIndex) => {
                        const unlocked = isInterviewLevelUnlocked(level.level);
                        
                        return (
                            <div key={level.level} className="interview-level">
                                <h1 className="interview-level-title">{level.title}</h1>
                                
                                <div className="roadmap-row">
                                    {level.steps.map((step, stepIndex) => {
                                        const stepUnlocked = unlocked && (stepIndex === 0 || getScoreFromStorage(`interview_step_${step.id - 1}`) >= 70);
                                        
                                        return (
                                            <React.Fragment key={step.id}>
                                                <div className={`roadmap-step ${stepUnlocked ? 'unlocked' : 'locked'}`}>
                                                    <div className={`step-number ${stepUnlocked ? 'unlocked' : 'locked'}`}>
                                                        {stepUnlocked ? step.id : '🔒'}
                                                    </div>
                                                    <div className="step-content">
                                                        <h4 className={stepUnlocked ? 'unlocked' : 'locked'}>
                                                            {step.title}
                                                        </h4>
                                                        <p className={stepUnlocked ? 'unlocked' : 'locked'}>
                                                            {step.activities}
                                                        </p>
                                                    </div>
                                                    {stepUnlocked && (
                                                        <button className="step-start-button">
                                                            START STEP
                                                        </button>
                                                    )}
                                                </div>
                                                {stepIndex < level.steps.length - 1 && (
                                                    <div className="roadmap-connector horizontal"></div>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                                
                                {levelIndex < interviewLevels.length - 1 && (
                                    <div className="roadmap-connector vertical-center"></div>
                                )}
                            </div>
                        );
                    })}
                    
                    <div className="progress-section">
                        <div className="progress-card">
                            <div className="progress-bar">
                                <div className="progress-fill"></div>
                            </div>
                            <div className="progress-text">Complete Your Interview Journey</div>
                        </div>
                    </div>
                </div>

                {activeChallenge && (
                    <div className="modal-overlay">
                        <div className="test-modal">
                            <button 
                                onClick={() => setActiveChallenge(null)}
                                className="modal-close"
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
                                        className="btn-secondary"
                                    >
                                        ← Previous
                                    </button>
                                )}
                                
                                <div className="test-modal-nav">
                                    {instructionIndex < testInstructions[activeChallenge]?.length - 1 ? (
                                        <>
                                            <button 
                                                onClick={handleNext}
                                                className="btn-primary"
                                            >
                                                Next →
                                            </button>
                                            <button 
                                                onClick={() => setInstructionIndex(testInstructions[activeChallenge].length - 1)}
                                                className="btn-success"
                                            >
                                                Skip
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={handleLaunchChallenge}
                                            className="btn-danger"
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