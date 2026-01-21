import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./test.css";

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
          src="https://www.youtube.com/embed/ReZgqLI3Hq0"
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
          src="https://www.youtube.com/embed/ReZgqLI3Hq0"
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
          src="https://www.youtube.com/embed/ReZgqLI3Hq0"
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
          src="https://www.youtube.com/embed/ReZgqLI3Hq0"
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
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Loading tests...</p>
            </div>
        );
    }

    return (
        <div className={userType === 'premium' ? 'premium-bg' : 'free-bg'} style={{ minHeight: '100vh' }}>
            <div>
                <header className="header">
                <div className="header-content">
                    <div className="logo">
                        <span className="logo-icon"></span>
                        <span className="logo-text">Skill Route</span>
                        <div className="nav-links">
                            <a href="#" onClick={() => navigate('/profiledata')}>Home</a>
                            <a href="#" onClick={() => navigate('/test')}
                                style={{
                                color:"#3B9797",
                                fontWeight: "600",
                                textDecoration: "none",
                                paddingBottom: "6px",
                                borderBottom: "2.5px solid #3B9797",
                                cursor: "pointer",
                            }}>Tests</a>
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
                            🔥{streakData.current_streak || 0}
                        </span>
                        <span style={{ 
                            marginRight: '15px', 
                            fontWeight: '600',
                            background: userType === 'premium' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : '#f8f9fa',
                            color: userType === 'premium' ? 'white' : '#6b7280',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: userType === 'premium' ? '2px solid #f59e0b' : '2px solid #e5e7eb',
                            fontSize: '0.9rem'
                        }}>
                            {userType === 'premium' ? '👑 Premium' : '🆓 Free'}
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
                            {localStorage.getItem('email')?.slice(0, 10) || 'User'}
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
                <center>
                <h1 style={{ fontSize: '2rem', color: '#0d8888ff', marginBottom: '10px' }}>
                    Communication Tests
                </h1>
                <div style={{ 
                    display: 'inline-block', 
                    background: 'linear-gradient(135deg, #318383ff, #1d5555ff)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '25px',
                    border: '3.5px solid black',
                    marginBottom: '15px',
                    boxShadow: '0 4px 15px rgba(59, 151, 151, 0.3)',
                    animation: 'pulse 2s infinite'
                }}>
                    <span style={{ fontSize: '1rem', fontWeight: '600' }}>
                        Intermediate and Advanced levels will be unlocked based on your average score from the latest 10 tests
                    </span>
                    <span style={{ 
                        marginLeft: '8px', 
                        background: 'rgba(255,255,255,0.2)', 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                    }}>
                        Coming Soon
                    </span>
                </div>
                <br/>
                {/* make border red color */}
                <div style={{ 
                    display: 'inline-block', 
                    background: 'linear-gradient(135deg, #318383ff, #1d5555ff)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '25px',
                    border: '3.5px solid black',
                    marginBottom: '30px',
                    boxShadow: '0 4px 15px rgba(59, 151, 151, 0.3)',
                    animation: 'pulse 2s infinite 0.5s'
                }}>
                    <span style={{ fontSize: '1rem', fontWeight: '600' }}>
                        Image-Based Speaking
                    </span>
                    <span style={{ 
                        marginLeft: '8px', 
                        background: 'rgba(255,255,255,0.2)', 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                    }}>
                        Coming Soon
                    </span>
                </div>
                </center>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: '20px',
                    maxWidth: '1200px',
                    margin: '0 auto 60px auto',
                    filter: activeChallenge ? 'blur(3px)' : 'none'
                }}>
                    {activities.map((activity) => {
                    const stats = getTestStats(activity.id);
                    return (
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', flex: 1 }}>
                                    <button 
                                        onClick={() => activity.count > 0 ? handleStartChallenge(activity.id) : null}
                                        style={{
                                            background: activity.count > 0 ? '#3B9797' : '#ccc',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '6px',
                                            cursor: activity.count > 0 ? 'pointer' : 'not-allowed',
                                            fontWeight: '500',
                                            fontSize: '0.9rem',
                                            width: '100%'
                                        }}
                                        disabled={activity.count === 0}
                                    >
                                        Basic Level
                                    </button>
                                    <button 
                                        style={{
                                            background: 'linear-gradient(135deg, #3B9797, #2c7a7a)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '6px',
                                            cursor: 'not-allowed',
                                            fontWeight: '500',
                                            fontSize: '0.9rem',
                                            opacity: '0.7',
                                            width: '100%',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                        disabled
                                    >
                                        <span style={{ position: 'relative', zIndex: 2 }}>Intermediate Level</span>
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: '-100%',
                                            width: '100%',
                                            height: '100%',
                                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                            animation: 'shimmer 2s infinite'
                                        }}></div>
                                        <span style={{
                                            position: 'absolute',
                                            top: '2px',
                                            right: '4px',
                                            background: '#fc0a0aff',
                                            color: 'white',
                                            border: '1px solid black',
                                            fontSize: '0.6rem',
                                            padding: '2px 6px',
                                            borderRadius: '8px',
                                            fontWeight: 'bold'
                                        }}>SOON</span>
                                    </button>
                                    <button 
                                        style={{
                                            background: 'linear-gradient(135deg, #3B9797, #2c7a7a)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '6px',
                                            cursor: 'not-allowed',
                                            fontWeight: '500',
                                            fontSize: '0.9rem',
                                            opacity: '0.7',
                                            width: '100%',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                        disabled
                                    >
                                        <span style={{ position: 'relative', zIndex: 2 }}>Advanced Level</span>
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: '-100%',
                                            width: '100%',
                                            height: '100%',
                                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                            animation: 'shimmer 2s infinite 0.5s'
                                        }}></div>
                                        <span style={{
                                            position: 'absolute',
                                            top: '2px',
                                            right: '4px',
                                            background: '#f60909ff',
                                            border: '1px solid black',
                                            color: 'white',
                                            fontSize: '0.6rem',
                                            padding: '2px 6px',
                                            borderRadius: '8px',
                                            fontWeight: 'bold'
                                        }}>SOON</span>
                                    </button>
                                </div>
                                <div style={{ marginLeft: '12px', textAlign: 'right', minWidth: '140px' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#666', display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                                {testInstructions[activeChallenge]?.[instructionIndex]?.title}
                            </h2>
                            
                            <div style={{ marginBottom: '30px', minHeight: '200px' }}>
                                {typeof testInstructions[activeChallenge]?.[instructionIndex]?.content === 'string' ? (
                                    <p style={{ lineHeight: '1.6', color: '#555' }}>
                                        {testInstructions[activeChallenge][instructionIndex].content}
                                    </p>
                                ) : (
                                    testInstructions[activeChallenge]?.[instructionIndex]?.content
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
                                    {instructionIndex < testInstructions[activeChallenge]?.length - 1 ? (
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
                                                onClick={() => setInstructionIndex(testInstructions[activeChallenge].length - 1)}
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