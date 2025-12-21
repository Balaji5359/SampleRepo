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
    const activities = [
        {
            id: 'jam',
            title: 'JAM Sessions',
            description: 'Just A Minute speaking sessions to improve spontaneous communication',
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
                        Communication Tests
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#666' }}>
                        Assess your communication skills with comprehensive tests
                    </p>
                </div>
                
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: '20px',
                    maxWidth: '1200px',
                    margin: '0 auto',
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
                                    onClick={() => handleStartChallenge(activity.id)}
                                    style={{
                                        background: '#3B9797',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    START TEST →
                                </button>
                                {activity.count !== undefined && (
                                    <span style={{ color: '#666', fontSize: '0.9rem' }}>
                                        Remaining: {activity.count}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
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