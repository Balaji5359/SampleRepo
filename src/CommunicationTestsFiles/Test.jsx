import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./test.css";

function Test() {
    const [tests, setTests] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [instructionIndex, setInstructionIndex] = useState(0);
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        if (!storedEmail) {
            setLoading(false);
            return;
        }  
        fetch('https://ntjkr8rnd6.execute-api.ap-south-1.amazonaws.com/dev/student_profilecreate/student_profile_senddata', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ college_email: storedEmail }),
        })
        .then(response => response.json())
        .then(data => {
            if (data?.body) {
                const parsedData = typeof data.body === "string" ? JSON.parse(data.body) : data.body;
                setTests(parsedData.tests || {});
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
            title: 'Basic Interview Skills',
            color: '#28a745',
            steps: [
                { id: 1, title: 'JD-Based Self Introduction', activities: 'JAM Session • Pronunciation Test • Listening Test' },
                { id: 2, title: 'Programming Knowledge', activities: 'Image-Based Speaking • JAM Session • Listening Test' },
                { id: 3, title: 'Worked Domain', activities: 'Image-Based Storytelling • JAM Session • Vocabulary' },
                { id: 4, title: 'Project Discussion', activities: 'Storytelling • JAM Session • Pronunciation' },
                { id: 5, title: 'Future Career Planning', activities: 'JAM Session • Listening Test • Goal Clarity' },
                { id: 6, title: 'Hobbies & Interests', activities: 'Free-flow Speaking • Confidence Analysis' },
                { id: 7, title: 'Certifications & Internships', activities: 'Structured Explanation • Keyword Clarity' }
            ]
        },
        {
            level: 2,
            title: 'Advanced Interview Skills',
            color: '#007bff',
            steps: [
                { id: 8, title: 'Role-Based Interview', activities: 'Mock Interview • JAM Answers • Stress Analysis' },
                { id: 9, title: 'Resume-Based Interview', activities: 'Resume Q&A • Consistency Check • Coherence' },
                { id: 10, title: 'Technical Interview', activities: 'Think-aloud JAM • Response Accuracy • Logic' },
                { id: 11, title: 'Follow-Up Questioning', activities: 'Multi-round Tasks • Memory Checks • Continuity' },
                { id: 12, title: 'Stress/Pressure Questions', activities: 'Rapid-fire Speaking • Emotion Detection • Recovery' },
                { id: 13, title: 'Logical Puzzles', activities: 'Problem Solving • Clarity Analysis • Think-aloud' }
            ]
        }
    ];
    const activities = [
        {
            id: 'jam',
            title: 'JAM Sessions',
            description: 'JAM',
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
        },
        {
            id: 'story',
            title: 'Image-Based Story Telling',
            description: 'Expand your vocabulary with interactive learning exercises',
            count: tests.image_story || 0,
            route: '/test/image-story'
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
        ],
        story: [
            { title: "Instructions", content: "Build a story based on given prompts." },
            { title: "Creativity", content: "Be creative in your storytelling." },
            { title: "How to Practice", content: <iframe width="100%" height="250" src="https://www.youtube.com/embed/ReZgqLI3Hq0" title="Story Building Practice" frameBorder="0" allowFullScreen></iframe> }
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
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Loading tests...</p>
            </div>
        );
    }

    return (
        <div>
            <div>
                <header className="header">
                <div className="header-content">
                    <div className="logo">
                        <span className="logo-icon"></span>
                        <span className="logo-text">Skill Route</span>
                        <div className="nav-links">
                            <a href="#" onClick={() => navigate('/profiledata')}>Home</a>
                            <a href="#" onClick={() => navigate('/practice')}>Practice</a>
                            <a href="#" onClick={() => navigate('/student-dashboard')}>Dashboard</a>
                            <a href="#" onClick={() => navigate('/student-leaderboard')}>Leaderboard</a>
                        </div>
                    </div>
                    <div className="auth-buttons">
                        <span style={{ marginRight: '15px', color: '#2c3e50', fontWeight: '600' }}>
                            {userName}
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
                    </div>
                </div>
            </header>
            </div>
            <div style={{ padding: '20px', marginTop: '80px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '10px' }}>
                        Communication & Interview Tests
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#666' }}>
                        Master communication skills and ace your interviews with structured learning
                    </p>
                </div>
                <h1 style={{ fontSize: '2rem', color: '#0d8888ff', marginBottom: '10px', marginLeft: '150px' }}>
                    Communication Tests
                </h1>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: '20px',
                    maxWidth: '1200px',
                    margin: '0 auto 60px auto',
                    filter: activeChallenge ? 'blur(3px)' : 'none'
                }}>
                    {activities.map((activity) => (
                        <div 
                            key={activity.id}
                            style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '24px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                border: '1px solid #e1e5e9',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                            }}
                        >
                            <h3 style={{ 
                                fontSize: '1.3rem', 
                                color: '#2c3e50', 
                                marginBottom: '12px',
                                fontWeight: '600'
                            }}>
                                {activity.title}
                            </h3>
                            <p style={{ 
                                color: '#666', 
                                marginBottom: '20px',
                                lineHeight: '1.5'
                            }}>
                                {activity.description}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button 
                                    onClick={() => activity.count > 0 ? handleStartChallenge(activity.id) : null}
                                    style={{
                                        background: activity.count > 0 ? '#3B9797' : '#ccc',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        cursor: activity.count > 0 ? 'pointer' : 'not-allowed',
                                        fontWeight: '500'
                                    }}
                                    disabled={activity.count === 0}
                                >
                                    {activity.count > 0 ? 'START TEST →' : 'NO TESTS LEFT'}
                                </button>
                                {activity.count !== undefined && (
                                    <span style={{ color: activity.count > 0 ? '#666' : '#999', fontSize: '0.9rem' }}>
                                        Remaining: {activity.count}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Interview Preparation Roadmap */}
                <div style={{ maxWidth: '1200px', margin: '0 auto', filter: activeChallenge ? 'blur(3px)' : 'none' }}>
                    {interviewLevels.map((level, levelIndex) => {
                        const unlocked = isInterviewLevelUnlocked(level.level);
                        const score = getScoreFromStorage(`interview_level_${level.level}`);
                        
                        return (
                            <div key={level.level} style={{ marginBottom: '60px' }}>
                                <h1 style={{ fontSize: '2rem', color: '#0d8888ff', marginBottom: '30px', textAlign: 'center' }}>
                                    {level.title}
                                </h1>
                                
                                {/* Steps Grid */}
                                <div className="roadmap-row">
                                    {level.steps.map((step, stepIndex) => {
                                        const stepUnlocked = unlocked && (stepIndex === 0 || getScoreFromStorage(`interview_step_${step.id - 1}`) >= 70);
                                        
                                        return (
                                            <React.Fragment key={step.id}>
                                                <div 
                                                    className="roadmap-step"
                                                    style={{
                                                        background: 'white',
                                                        borderRadius: '15px',
                                                        padding: '25px',
                                                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                                                        border: stepUnlocked ? '3px solid #0d8888ff' : '3px solid #ccc',
                                                        textAlign: 'center',
                                                        transition: 'all 0.3s ease',
                                                        cursor: stepUnlocked ? 'pointer' : 'not-allowed',
                                                        opacity: stepUnlocked ? 1 : 0.6,
                                                        minWidth: '250px'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (stepUnlocked) {
                                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                                            e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (stepUnlocked) {
                                                            e.currentTarget.style.transform = 'translateY(0)';
                                                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                                                        }
                                                    }}
                                                >
                                                    <div className="step-number" style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        borderRadius: '50%',
                                                        background: stepUnlocked ? 'linear-gradient(135deg, #0d8888ff, #0d8888dd)' : '#ccc',
                                                        color: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 'bold',
                                                        fontSize: '1.2rem',
                                                        margin: '0 auto 15px',
                                                        boxShadow: stepUnlocked ? '0 4px 15px #0d888830' : 'none'
                                                    }}>
                                                        {stepUnlocked ? step.id : '🔒'}
                                                    </div>
                                                    <div className="step-content">
                                                        <h4 style={{
                                                            color: stepUnlocked ? '#2c3e50' : '#999',
                                                            fontSize: '1.2rem',
                                                            marginBottom: '10px',
                                                            fontWeight: '600'
                                                        }}>
                                                            {step.title}
                                                        </h4>
                                                        <p style={{
                                                            color: stepUnlocked ? '#666' : '#999',
                                                            fontSize: '0.9rem',
                                                            lineHeight: '1.4',
                                                            margin: 0
                                                        }}>
                                                            {step.activities}
                                                        </p>
                                                    </div>
                                                    {stepUnlocked && (
                                                        <button 
                                                            style={{
                                                                marginTop: '15px',
                                                                background: '#0d8888ff',
                                                                color: 'white',
                                                                border: 'none',
                                                                padding: '8px 16px',
                                                                borderRadius: '20px',
                                                                fontSize: '0.9rem',
                                                                fontWeight: '500',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
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
                                
                                {/* Level Connector */}
                                {levelIndex < interviewLevels.length - 1 && (
                                    <div className="roadmap-connector vertical-center"></div>
                                )}
                            </div>
                        );
                    })}
                    
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <div style={{ display: 'inline-block', padding: '20px 40px', background: 'white', borderRadius: '25px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', border: '3px solid #3B9797' }}>
                            <div style={{ width: '200px', height: '8px', background: '#e0e0e0', borderRadius: '4px', margin: '0 auto 10px', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '30%', background: 'linear-gradient(90deg, #3B9797, #2c7a7a)', borderRadius: '4px' }}></div>
                            </div>
                            <div style={{ color: '#2c3e50', fontWeight: '600', fontSize: '1.1rem' }}>Complete Your Interview Journey</div>
                        </div>
                    </div>
                </div>

                {/* Modal */}
                {activeChallenge && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '30px',
                            maxWidth: '600px',
                            width: '90%',
                            maxHeight: '80vh',
                            overflow: 'auto',
                            position: 'relative'
                        }}>
                            <button 
                                onClick={() => setActiveChallenge(null)}
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >
                                ×
                            </button>
                            
                            <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>
                                {instructions[activeChallenge]?.[instructionIndex]?.title}
                            </h2>
                            
                            <div style={{ marginBottom: '30px', minHeight: '200px' }}>
                                {typeof instructions[activeChallenge]?.[instructionIndex]?.content === 'string' ? (
                                    <p style={{ lineHeight: '1.6', color: '#555' }}>
                                        {instructions[activeChallenge][instructionIndex].content}
                                    </p>
                                ) : (
                                    instructions[activeChallenge]?.[instructionIndex]?.content
                                )}
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {instructionIndex > 0 && (
                                    <button 
                                        onClick={handlePrev}
                                        style={{
                                            background: '#6c757d',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '6px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ← Previous
                                    </button>
                                )}
                                
                                <div style={{ marginLeft: 'auto' }}>
                                    {instructionIndex < instructions[activeChallenge]?.length - 1 ? (
                                        <>
                                            <button 
                                                onClick={handleNext}
                                                style={{
                                                    background: '#3B9797',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '10px 20px',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    marginRight: '10px'
                                                }}
                                            >
                                                Next →
                                            </button>
                                            <button 
                                                onClick={() => setInstructionIndex(instructions[activeChallenge].length - 1)}
                                                style={{
                                                    background: '#28a745',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '10px 20px',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Skip
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={handleLaunchChallenge}
                                            style={{
                                                background: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                padding: '12px 24px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                fontWeight: '600'
                                            }}
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