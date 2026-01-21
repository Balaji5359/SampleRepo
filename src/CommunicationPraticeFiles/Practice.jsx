import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/shared-styles.css";
import "./practice-styles.css";
import Header from '../components/Header';

function Practice() {
    const [loading, setLoading] = useState(true);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [instructionIndex, setInstructionIndex] = useState(0);
    const [userName, setUserName] = useState("");
    const [userType, setUserType] = useState('free');
    const [streakData, setStreakData] = useState({ current_streak: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        if (!storedEmail) {
            setLoading(false);
            return;
        }  
        
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
            })
        ])
        .then(async ([profileResponse, streakResponse]) => {
            const profileData = await profileResponse.json();
            const streakDataResult = await streakResponse.json();
            
            if (profileData?.body) {
                const parsedProfileData = typeof profileData.body === "string" ? JSON.parse(profileData.body) : profileData.body;
                setUserType(parsedProfileData.user_type === 'premium' && parsedProfileData.premium_status === 'active' ? 'premium' : 'free');
            }
            
            if (streakDataResult?.body) {
                const parsedStreakData = typeof streakDataResult.body === "string" ? JSON.parse(streakDataResult.body) : streakDataResult.body;
                setStreakData(parsedStreakData);
            }
            
            setLoading(false);
        })
        .catch(() => setLoading(false));
    }, []);

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
            title: 'Basic Interview Practice',
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
            title: 'Advanced Interview Practice',
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
            title: 'JAM Sessions Practice',
            description: 'JAM speaking sessions to improve spontaneous communication',
            route: '/test/jam'
        },
        {
            id: 'pronunciation',
            title: 'Pronunciation Practice',
            description: 'Perfect your pronunciation with AI-powered feedback',
            route: '/test/pronunciation'
        },
        {
            id: 'listening',
            title: 'Listening Practice',
            description: 'Enhance comprehension with interactive listening exercises',
            route: '/test/listening'
        },
        {
            id: 'situational',
            title: 'Situational Speaking Practice',
            description: 'Practice real-life scenarios to build confidence',
            route: '/test/situation-speak'
        },
        {
            id: 'image-speak',
            title: 'Image-Based Speaking Practice',
            description: 'Describe images to enhance vocabulary and fluency',
            route: '/test/image-speak'
        }
    ];

    const instructions = {
        jam: [
            { title: "Instructions", content: "You've been given a random topic! You will have 1 minute to speak. Focus on fluency, clarity, and confidence." },
            { title: "Fluency", content: "Maintain a smooth and uninterrupted flow of speech." },
            { title: "Grammar", content: "Use correct sentence structures and grammatical conventions." },
            { title: "Confidence", content: "Speak with assurance and composure." },
            { title: "How to Practice", content: <iframe width="100%" height="250" src="https://www.youtube.com/embed/ReZgqLI3Hq0" title="JAM Practice" frameBorder="0" allowFullScreen></iframe> }
        ],
        pronunciation: [
            { title: "Instructions", content: "Improve your pronunciation by practicing words and sentences. Focus on clarity and accuracy." },
            { title: "Clarity", content: "Speak clearly, enunciating each sound." },
            { title: "Accuracy", content: "Pronounce words correctly." },
            { title: "How to Practice", content: <iframe width="100%" height="250" src="https://www.youtube.com/embed/ReZgqLI3Hq0" title="Pronunciation Practice" frameBorder="0" allowFullScreen></iframe> }
        ],
        listening: [
            { title: "Instructions", content: "Enhance your listening comprehension with interactive exercises." },
            { title: "Focus", content: "Listen carefully to audio clips and answer questions." },
            { title: "How to Practice", content: <iframe width="100%" height="250" src="https://www.youtube.com/embed/ReZgqLI3Hq0" title="Listening Practice" frameBorder="0" allowFullScreen></iframe> }
        ],
        situational: [
            { title: "Instructions", content: "Respond to real-life situations with appropriate communication." },
            { title: "Context", content: "Analyze the situation and respond appropriately." },
            { title: "How to Practice", content: <iframe width="100%" height="250" src="https://www.youtube.com/embed/ReZgqLI3Hq0" title="Situational Practice" frameBorder="0" allowFullScreen></iframe> }
        ],
        "image-speak": [
            { title: "Instructions", content: "Describe the given image in detail." },
            { title: "Observation", content: "Note key elements in the image." },
            { title: "How to Practice", content: <iframe width="100%" height="250" src="https://www.youtube.com/embed/ReZgqLI3Hq0" title="Image Speaking Practice" frameBorder="0" allowFullScreen></iframe> }
        ]
    };

    const handleStartChallenge = (id) => {
        setActiveChallenge(id);
        setInstructionIndex(0);
    };

    const handleNext = () => {
        const currentInstructions = instructions[activeChallenge];
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
        <div className="practice-container">
            <Header />

            <div className="practice-content">
                <center>
                    <h1 className="practice-title">Communication Practice Activities</h1>
                </center>

                <div className={`practice-grid ${activeChallenge ? 'blurred' : ''}`}>
                    {activities.map((activity) => (
                        <div key={activity.id} className="practice-card">
                            <h3 className="practice-card-title">{activity.title}</h3>
                            <p className="practice-card-description">{activity.description}</p>
                            <div className="practice-card-actions">
                                <button className="practice-upcoming-button">
                                    Up Coming in future
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={`practice-interview-section ${activeChallenge ? 'blurred' : ''}`}>
                    {interviewLevels.map((level, levelIndex) => {
                        const unlocked = isInterviewLevelUnlocked(level.level);
                        
                        return (
                            <div key={level.level} className="practice-interview-level">
                                <h1 className="practice-interview-title">{level.title}</h1>
                                
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
                        <div className="practice-modal">
                            <button 
                                onClick={() => setActiveChallenge(null)}
                                className="modal-close"
                            >
                                ×
                            </button>
                            
                            <h2 className="practice-modal-title">
                                {instructions[activeChallenge]?.[instructionIndex]?.title}
                            </h2>
                            
                            <div className="practice-modal-content">
                                {typeof instructions[activeChallenge]?.[instructionIndex]?.content === 'string' ? (
                                    <p className="practice-modal-text">
                                        {instructions[activeChallenge][instructionIndex].content}
                                    </p>
                                ) : (
                                    instructions[activeChallenge]?.[instructionIndex]?.content
                                )}
                            </div>
                            
                            <div className="practice-modal-actions">
                                {instructionIndex > 0 && (
                                    <button 
                                        onClick={handlePrev}
                                        className="btn-secondary"
                                    >
                                        ← Previous
                                    </button>
                                )}
                                
                                <div className="practice-modal-nav">
                                    {instructionIndex < instructions[activeChallenge]?.length - 1 ? (
                                        <>
                                            <button 
                                                onClick={handleNext}
                                                className="btn-primary"
                                            >
                                                Next →
                                            </button>
                                            <button 
                                                onClick={() => setInstructionIndex(instructions[activeChallenge].length - 1)}
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

export default Practice;