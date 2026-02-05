import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PracticeDashboard from './PracticeDashboard';
import './theme-dropdown-styles.css';
import './practice-component-styles.css';

const BaseComponentPractice = ({
    practiceType,
    practiceTitle,
    practiceDescription,
    practiceLevel = 'basic'
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { remainingPractices: initialRemainingPractices = 0, practiceLevel: passedPracticeLevel = 'basic' } = location.state || {};

    const actualPracticeLevel = passedPracticeLevel !== 'basic' ? passedPracticeLevel : practiceLevel;

    const sessionIdRef = useRef(null);
    if (!sessionIdRef.current) {
        sessionIdRef.current = `${practiceType}-${actualPracticeLevel}-${Math.floor(1000000 + Math.random() * 9000000)}`;
    }
    const sessionId = sessionIdRef.current;

    const [userEmail] = useState(localStorage.getItem("email"));
    const [chatMessages, setChatMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [recording, setRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);
    const [showPracticePopup, setShowPracticePopup] = useState(false);
    const [showStartConfirm, setShowStartConfirm] = useState(false);
    const [theme, setTheme] = useState('light');
    const [userType, setUserType] = useState('free');
    const [streakData, setStreakData] = useState({ current_streak: 0 });
    const [profileData, setProfileData] = useState(null);
    const [recordingState, setRecordingState] = useState('idle');
    const [showEndConfirm, setShowEndConfirm] = useState(false);
    const [showCongrats, setShowCongrats] = useState(false);
    const [hasRecorded, setHasRecorded] = useState(false);
    const [remainingPractices, setRemainingPractices] = useState(initialRemainingPractices);
    const [clickedButtons, setClickedButtons] = useState(new Set());
    const [playCounts, setPlayCounts] = useState({});
    const [practiceCompleted, setPracticeCompleted] = useState(false);
    const [finalReport, setFinalReport] = useState(null);

    // Dashboard state
    const [showDashboard, setShowDashboard] = useState(true);

    const chatRef = useRef(null);
    const timerRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const streamRef = useRef(null);

    useEffect(() => {
    window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chatMessages]);

    // Fetch profile data on component mount
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const userEmail = localStorage.getItem('email') || localStorage.getItem('userEmail');

                const [profileResponse, streakResponse] = await Promise.all([
                    fetch(import.meta.env.VITE_STUDENT_PROFILE_API, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ college_email: userEmail })
                    }),
                    fetch(import.meta.env.VITE_UPDATE_USER_STREAK_API, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            body: JSON.stringify({
                                college_email: userEmail,
                                get_streak_data: true
                            })
                        })
                    })
                ]);

                if (profileResponse.ok) {
                    const pData = await profileResponse.json();
                    const parsedProfile = typeof pData.body === 'string' ? JSON.parse(pData.body) : pData.body;
                    setProfileData(parsedProfile);

                    // Update user type from profile
                    if (parsedProfile) {
                        setUserType(parsedProfile.user_type || 'free');
                    }
                }

                if (streakResponse.ok) {
                    const sData = await streakResponse.json();
                    const parsedStreak = typeof sData.body === 'string' ? JSON.parse(sData.body) : sData.body;
                    if (parsedStreak) {
                        setStreakData({
                            current_streak: parsedStreak.current_streak || 0,
                            best_streak: parsedStreak.longest_streak || 0
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfileData();
    }, [practiceType]);

    useEffect(() => {
        const root = document.documentElement;
        // Apply theme class to body
        document.body.className = `theme-${theme}`;
        
        if (theme === 'light') {
            root.style.setProperty('--bg', 'linear-gradient(180deg,#f8fafc 0%,#eef2ff 100%)');
            root.style.setProperty('--card-bg', 'rgba(19,21,27,0.04)');
            root.style.setProperty('--accent', '#0ea5a4');
            root.style.setProperty('--muted', '#374151');
            root.style.setProperty('--text-color', '#0b1220');
        } else if (theme === 'premium') {
            root.style.setProperty('--bg', 'linear-gradient(135deg, #7dd3d3 75%, #9ee8e8 100%)');
            root.style.setProperty('--card-bg', 'rgba(255,255,255,0.1)');
            root.style.setProperty('--accent', '#0ea5a4');
            root.style.setProperty('--muted', '#374151');
            root.style.setProperty('--text-color', '#0b1220');
        } else {
            root.style.setProperty('--bg', 'linear-gradient(180deg,#0f172a 0%,#071129 100%)');
            root.style.setProperty('--card-bg', 'rgba(255,255,255,0.04)');
            root.style.setProperty('--accent', '#3B9797');
            root.style.setProperty('--muted', 'rgba(255,255,255,0.75)');
            root.style.setProperty('--text-color', '#e6eef8');
        }
    }, [theme]);

    const decrementPracticeCount = async () => {
        try {
            const email = localStorage.getItem('email');
            console.log(practiceType)
            const response = await fetch(import.meta.env.VITE_TEST_DECREMENT_API, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    college_email: email,
                    type: 'practice',
                    key: practiceType
                })
            });
            console.log('Decrement response:', response);
            const data = await response.json();
            if (data.statusCode === 200) {
                setRemainingPractices(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error decrementing practice count:', error);
        }
    };

    const formatMessageText = (text) => {
        return text
            // Listening Assessment headers and formatting
            .replace(/LISTENING COMPREHENSION ANALYSIS/g, '<div style="background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%); color: white; padding: 16px 20px; border-radius: 12px; font-weight: 700; font-size: 18px; margin: 15px 0; text-align: center; font-family: Inter, sans-serif; box-shadow: 0 4px 15px rgba(96, 165, 250, 0.4);">🎧 LISTENING COMPREHENSION ANALYSIS</div>')
            .replace(/SENTENCE \((\d+)\/(\d+)\):/g, '<div style="background: linear-gradient(135deg, #34d399 0%, #10b981 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #34d399;">📝 SENTENCE ($1/$2):</div>')
            .replace(/YOUR REPETITION:/g, '<div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #f97316;">🗣️ YOUR REPETITION:</div>')
            .replace(/COMPREHENSION ANALYSIS:/g, '<div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #ef4444;">📊 COMPREHENSION ANALYSIS:</div>')
            .replace(/LISTENING PERFORMANCE:/g, '<div style="background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #a855f7;">📈 LISTENING PERFORMANCE:</div>')
            .replace(/LISTENING FOCUS:/g, '<div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #3b82f6;">🎯 LISTENING FOCUS:</div>')
            .replace(/(⭐ SENTENCE SCORE:)\s*(\d+\.\d+)\s*\/\s*(\d+\.\d+)/g, '<div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 12px 20px; border-radius: 20px; display: inline-block; font-weight: 700; margin: 10px 0; font-family: Inter, sans-serif; box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);">⭐ SENTENCE SCORE: $2/$3</div>')div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 12px 20px; border-radius: 20px; display: inline-block; font-weight: 700; margin: 10px 0; font-family: Inter, sans-serif; box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);">⭐ SENTENCE SCORE: $2/$3</div>')
            .replace(/• Words Heard Correctly:/g, '<div style="color: #10b981; font-weight: 600; margin: 8px 0;">✓ WORDS HEARD CORRECTLY:</div>')
            .replace(/• Missing Words:/g, '<div style="color: #ef4444; font-weight: 600; margin: 8px 0;">✗ MISSING WORDS:</div>')
            .replace(/• Incorrect Words:/g, '<div style="color: #f59e0b; font-weight: 600; margin: 8px 0;">⚠ INCORRECT WORDS:</div>')
            .replace(/• Extra Words Added:/g, '<div style="color: #8b5cf6; font-weight: 600; margin: 8px 0;">➕ EXTRA WORDS ADDED:</div>')
            .replace(/• Sequence Errors:/g, '<div style="color: #06b6d4; font-weight: 600; margin: 8px 0;">🔄 SEQUENCE ERRORS:</div>')
            .replace(/• Comprehension Accuracy:/g, '<div style="color: #10b981; font-weight: 600; margin: 8px 0;">🎩 COMPREHENSION ACCURACY:</div>')
            .replace(/• Listening Quality:/g, '<div style="color: #3b82f6; font-weight: 600; margin: 8px 0;">🎧 LISTENING QUALITY:</div>')
            .replace(/• Repetition Completeness:/g, '<div style="color: #8b5cf6; font-weight: 600; margin: 8px 0;">📝 REPETITION COMPLETENESS:</div>')
            .replace(/• Audio Processing:/g, '<div style="color: #06b6d4; font-weight: 600; margin: 8px 0;">🔊 AUDIO PROCESSING:</div>')
            
            // Final Assessment headers
            .replace(/FINAL SPEAKING/g, '<div style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: white; padding: 16px 20px; border-radius: 12px; font-weight: 700; font-size: 20px; margin: 15px 0; text-align: center; font-family: Inter, sans-serif; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);">🎤 FINAL SPEAKING</div>')
            .replace(/OVERALL/g, '<div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 14px 18px; border-radius: 10px; font-weight: 700; font-size: 16px; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #059669;">📊 OVERALL</div>')
            .replace(/COMPREHENSIVE SCORES:/g, '<div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #dc2626;">📋 COMPREHENSIVE SCORES:</div>')
            .replace(/DETAILED ANALYSIS:/g, '<div style="background: linear-gradient(135deg, #7c2d12 0%, #92400e 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #7c2d12;">🔍 DETAILED ANALYSIS:</div>')
            .replace(/STRENGTHS IDENTIFIED:/g, '<div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #16a34a;">💪 STRENGTHS IDENTIFIED:</div>')
            .replace(/PROFESSIONAL RECOMMENDATIONS:/g, '<div style="background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #1d4ed8;">🎯 PROFESSIONAL RECOMMENDATIONS:</div>')
            .replace(/(Final Speaking Score:)\s*(\d+\.\d+)\s*\/\s*(\d+\.\d+)/g, '<div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 10px 16px; border-radius: 20px; display: inline-block; font-weight: 700; margin: 8px 0; font-family: Inter, sans-serif; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);">🏆 $1 $2/$3</div>')
            
            // Better paragraph spacing
            .replace(/\n\n/g, '<br/><br/>')
            .replace(/\n/g, '<br/>');
    };

    const formatAIMessage = (content, messageIndex) => {
        const handleButtonClick = (value, buttonId) => {
            setClickedButtons(prev => new Set([...prev, buttonId]));
            sendMessage(value);
        };

        // Check for listening practice sentences - ALLOW MULTIPLE PLAYS
        // Handle both single-line and multi-line formats with flexible whitespace
        const listeningMatch = content.match(/LISTENING\s+ASSESSMENT.*?SENTENCE\s*\((\d+)\/(\d+)\)\s*:\s*([\s\S]+?)(?:\n\n|$)/i);
        if (listeningMatch) {
            const [, current, total, sentence] = listeningMatch;
            const playCount = playCounts[messageIndex] || 0;

            const handlePlayAudio = () => {
                if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(sentence.trim());
                    utterance.rate = 0.8;
                    utterance.pitch = 1;
                    speechSynthesis.speak(utterance);
                    setPlayCounts(prev => ({ ...prev, [messageIndex]: (prev[messageIndex] || 0) + 1 }));
                }
            };
            
            return (
                <div>
                    <div style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        color: 'white',
                        padding: '16px 20px',
                        borderRadius: '12px',
                        fontWeight: '700',
                        fontSize: '16px',
                        margin: '15px 0',
                        textAlign: 'center',
                        fontFamily: 'Inter, sans-serif',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                    }}>
                        🎧 LISTENING ASSESSMENT – SENTENCE ({current}/{total})
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '15px',
                        margin: '20px 0'
                    }}>
                        <button
                            onClick={handlePlayAudio}
                            style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '15px 30px',
                                borderRadius: '25px',
                                fontWeight: '600',
                                fontSize: '16px',
                                cursor: 'pointer',
                                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            🔊 {playCount > 0 ? `Play Again (${playCount})` : 'Play Audio'}
                        </button>
                        <div style={{
                            fontSize: '14px',
                            color: 'var(--muted)',
                            textAlign: 'center',
                            fontStyle: 'italic'
                        }}>
                            Listen carefully and then repeat what you heard. You can play the audio as many times as you need.
                        </div>
                    </div>
                </div>
            );
        }

        // Check for start button
        if (content.includes("Click 'start'") || content.includes("'start'")) {
            const parts = content.split("Click 'start'");
            const startButtonId = `start-${messageIndex}`;
            
            return (
                <div>
                    <div dangerouslySetInnerHTML={{ __html: formatMessageText(parts[0]) }} />
                    <div style={{ marginTop: 15, display: 'flex', gap: 10, justifyContent: 'center' }}>
                        <button 
                            onClick={() => handleButtonClick('start', startButtonId)}
                            disabled={clickedButtons.has(startButtonId)}
                            style={{
                                background: clickedButtons.has(startButtonId)
                                    ? 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
                                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '20px',
                                fontWeight: '600',
                                cursor: clickedButtons.has(startButtonId) ? 'not-allowed' : 'pointer',
                                boxShadow: clickedButtons.has(startButtonId)
                                    ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.3)',
                                transition: 'all 0.3s ease',
                                opacity: clickedButtons.has(startButtonId) ? 0.6 : 1
                            }}
                        >
                            START
                        </button>
                    </div>
                </div>
            );
        }
        
        // Check for next/done buttons
        if (content.includes("Click 'next'") || content.includes("'next'") || content.includes("Click 'done'") || content.includes("'done'")) {
            const hasNext = content.includes("next");
            const hasDone = content.includes("done");
            const parts = content.split(/Click '(next|done)'/)[0];
            const nextButtonId = `next-${messageIndex}`;
            const doneButtonId = `done-${messageIndex}`;
            
            return (
                <div>
                    <div dangerouslySetInnerHTML={{ __html: formatMessageText(parts) }} />
                    <div style={{ marginTop: 15, display: 'flex', gap: 10, justifyContent: 'center' }}>
                        {hasNext && (
                            <button 
                                onClick={() => handleButtonClick('next', nextButtonId)}
                                disabled={clickedButtons.has(nextButtonId)}
                                style={{
                                    background: clickedButtons.has(nextButtonId)
                                        ? 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
                                        : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '20px',
                                    fontWeight: '600',
                                    cursor: clickedButtons.has(nextButtonId) ? 'not-allowed' : 'pointer',
                                    boxShadow: clickedButtons.has(nextButtonId)
                                        ? 'none' : '0 4px 15px rgba(59, 130, 246, 0.3)',
                                    transition: 'all 0.3s ease',
                                    opacity: clickedButtons.has(nextButtonId) ? 0.6 : 1
                                }}
                            >
                                NEXT
                            </button>
                        )}
                        {hasDone && (
                            <button 
                                onClick={() => handleButtonClick('done', doneButtonId)}
                                disabled={clickedButtons.has(doneButtonId)}
                                style={{
                                    background: clickedButtons.has(doneButtonId)
                                        ? 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
                                        : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '20px',
                                    fontWeight: '600',
                                    cursor: clickedButtons.has(doneButtonId) ? 'not-allowed' : 'pointer',
                                    boxShadow: clickedButtons.has(doneButtonId)
                                        ? 'none' : '0 4px 15px rgba(220, 38, 38, 0.3)',
                                    transition: 'all 0.3s ease',
                                    opacity: clickedButtons.has(doneButtonId) ? 0.6 : 1
                                }}
                            >
                                DONE
                            </button>
                        )}
                    </div>
                </div>
            );
        }

        // Check for yes/no buttons
        if (content.includes("Click 'yes' or 'no'") || content.includes("'yes' or 'no'")) {
            const parts = content.split("Click 'yes' or 'no'.");
            const yesButtonId = `yes-${messageIndex}`;
            const noButtonId = `no-${messageIndex}`;
            
            return (
                <div>
                    <div dangerouslySetInnerHTML={{ __html: formatMessageText(parts[0]) }} />
                    <div style={{ marginTop: 15, display: 'flex', gap: 10, justifyContent: 'center' }}>
                        <button 
                            onClick={() => handleButtonClick('yes', yesButtonId)}
                            disabled={clickedButtons.has(yesButtonId) || clickedButtons.has(noButtonId)}
                            style={{
                                background: clickedButtons.has(yesButtonId) || clickedButtons.has(noButtonId) 
                                    ? 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
                                    : 'linear-gradient(135deg, #ffd93d 0%, #ff9500 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '20px',
                                fontWeight: '600',
                                cursor: clickedButtons.has(yesButtonId) || clickedButtons.has(noButtonId) ? 'not-allowed' : 'pointer',
                                boxShadow: clickedButtons.has(yesButtonId) || clickedButtons.has(noButtonId) 
                                    ? 'none' : '0 4px 15px rgba(255, 217, 61, 0.3)',
                                transition: 'all 0.3s ease',
                                opacity: clickedButtons.has(yesButtonId) || clickedButtons.has(noButtonId) ? 0.6 : 1
                            }}
                        >
                            Yes
                        </button>
                        <button 
                            onClick={() => handleButtonClick('no', noButtonId)}
                            disabled={clickedButtons.has(yesButtonId) || clickedButtons.has(noButtonId)}
                            style={{
                                background: clickedButtons.has(yesButtonId) || clickedButtons.has(noButtonId)
                                    ? 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
                                    : 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '20px',
                                fontWeight: '600',
                                cursor: clickedButtons.has(yesButtonId) || clickedButtons.has(noButtonId) ? 'not-allowed' : 'pointer',
                                boxShadow: clickedButtons.has(yesButtonId) || clickedButtons.has(noButtonId)
                                    ? 'none' : '0 4px 15px rgba(255, 107, 107, 0.3)',
                                transition: 'all 0.3s ease',
                                opacity: clickedButtons.has(yesButtonId) || clickedButtons.has(noButtonId) ? 0.6 : 1
                            }}
                        >
                            No
                        </button>
                    </div>
                </div>
            );
        }
        
        // Check for topic selection (1 or 2)
        if (content.includes("Click '1' or '2'") || content.includes("'1' or '2'")) {
            const parts = content.split("Click '1' or '2'.");
            const button1Id = `topic1-${messageIndex}`;
            const button2Id = `topic2-${messageIndex}`;
            
            return (
                <div>
                    <div dangerouslySetInnerHTML={{ __html: formatMessageText(parts[0]) }} />
                    <div style={{ marginTop: 15, display: 'flex', gap: 10, justifyContent: 'center' }}>
                        <button 
                            onClick={() => handleButtonClick('1', button1Id)}
                            disabled={clickedButtons.has(button1Id) || clickedButtons.has(button2Id)}
                            style={{
                                background: clickedButtons.has(button1Id) || clickedButtons.has(button2Id)
                                    ? 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
                                    : 'linear-gradient(135deg, #ffd93d 0%, #ff9500 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '20px',
                                fontWeight: '600',
                                cursor: clickedButtons.has(button1Id) || clickedButtons.has(button2Id) ? 'not-allowed' : 'pointer',
                                boxShadow: clickedButtons.has(button1Id) || clickedButtons.has(button2Id)
                                    ? 'none' : '0 4px 15px rgba(255, 217, 61, 0.3)',
                                transition: 'all 0.3s ease',
                                opacity: clickedButtons.has(button1Id) || clickedButtons.has(button2Id) ? 0.6 : 1
                            }}
                        >
                            1
                        </button>
                        <button 
                            onClick={() => handleButtonClick('2', button2Id)}
                            disabled={clickedButtons.has(button1Id) || clickedButtons.has(button2Id)}
                            style={{
                                background: clickedButtons.has(button1Id) || clickedButtons.has(button2Id)
                                    ? 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
                                    : 'linear-gradient(135deg, #ffd93d 0%, #ff9500 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '20px',
                                fontWeight: '600',
                                cursor: clickedButtons.has(button1Id) || clickedButtons.has(button2Id) ? 'not-allowed' : 'pointer',
                                boxShadow: clickedButtons.has(button1Id) || clickedButtons.has(button2Id)
                                    ? 'none' : '0 4px 15px rgba(255, 217, 61, 0.3)',
                                transition: 'all 0.3s ease',
                                opacity: clickedButtons.has(button1Id) || clickedButtons.has(button2Id) ? 0.6 : 1
                            }}
                        >
                            2
                        </button>
                    </div>
                </div>
            );
        }
        
        return <div dangerouslySetInnerHTML={{ __html: formatMessageText(content) }} />;
    };

    const initializeAIAgent = async () => {
        try {
            setIsLoading(true);
            await decrementPracticeCount();
            setChatMessages([]);

            const response = await fetch(import.meta.env.VITE_PRACTICE_AI_AGENT_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    body: {
                        testType: practiceType,
                        level: actualPracticeLevel,
                        sessionId: sessionId,
                        email: userEmail,
                        message: 'hi'
                    }
                })
            });

            const data = await response.json();
            const bodyData = JSON.parse(data.body);

            if (bodyData.aiResponse) {
                setChatMessages([{
                    type: 'ai',
                    content: bodyData.aiResponse,
                    timestamp: Date.now()
                }]);
            }
        } catch (error) {
            console.error('Error initializing AI agent:', error);
            setChatMessages([{
                type: 'ai',
                content: 'Error connecting to AI agent. Please try again.',
                timestamp: Date.now()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const startRecording = async () => {
        try {
            setRecordingState('preparing');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await sendAudioToTranscript(audioBlob);
            };

            mediaRecorder.start();
            setRecording(true);
            setRecordingState('recording');
            setHasRecorded(true);
            setTimeLeft(10);

            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        stopRecording();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            setChatMessages(prev => [...prev, {
                type: 'ai',
                content: 'Unable to access microphone. Please check permissions.',
                timestamp: Date.now()
            }]);
            setRecordingState('idle');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            setRecording(false);
            setRecordingState('processing');

            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        }
    };

    const sendAudioToTranscript = async (audioBlob) => {
        try {
            setIsLoading(true);
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);

            reader.onloadend = async () => {
                const base64Audio = reader.result.split(',')[1];

                const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/audiototranscript-api', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        body: JSON.stringify({ data: base64Audio }),
                        isBase64Encoded: false
                    })
                });

                const data = await response.json();
                const bodyData = JSON.parse(data.body);
                const transcript = bodyData.transcript;

                if (transcript) {
                    await sendMessage(transcript.trim());
                } else {
                    setChatMessages(prev => [...prev, {
                        type: 'ai',
                        content: 'Could not process audio. Please try again.',
                        timestamp: Date.now()
                    }]);
                }
                setIsLoading(false);
                setRecordingState('idle');
            };
        } catch (error) {
            console.error('Error transcribing audio:', error);
            setChatMessages(prev => [...prev, {
                type: 'ai',
                content: 'Error processing audio. Please try again.',
                timestamp: Date.now()
            }]);
            setIsLoading(false);
            setRecordingState('idle');
        }
    };

    const sendMessage = async (userMessage) => {
        setChatMessages(prev => [...prev, {
            type: 'user',
            content: userMessage,
            timestamp: Date.now()
        }]);

        try {
            setIsLoading(true);

            const response = await fetch('https://piw6c7f4sf.execute-api.ap-south-1.amazonaws.com/dev/comm-practice-ai-agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    body: {
                        testType: practiceType,
                        level: actualPracticeLevel,
                        sessionId: sessionId,
                        email: userEmail,
                        message: userMessage
                    }
                })
            });

            const data = await response.json();
            const bodyData = JSON.parse(data.body);

            if (bodyData.aiResponse) {
                setChatMessages(prev => [...prev, {
                    type: 'ai',
                    content: bodyData.aiResponse,
                    timestamp: Date.now()
                }]);

                if (bodyData.aiResponse.toLowerCase().includes('assessment report') ||
                    bodyData.aiResponse.toLowerCase().includes('final') ||
                    bodyData.aiResponse.toLowerCase().includes('score:')) {
                    setPracticeCompleted(true);
                    setFinalReport(bodyData.aiResponse);
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setChatMessages(prev => [...prev, {
                type: 'ai',
                content: 'Error communicating with AI. Please try again.',
                timestamp: Date.now()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEndPractice = () => {
        setShowEndConfirm(true);
    };

    const confirmEndPractice = (shouldRefresh) => {
        setShowEndConfirm(false);
        if (shouldRefresh) {
            setShowCongrats(true);
            setTimeout(() => {
                setShowCongrats(false);
                window.location.reload();
            }, 2000);
        }
    };

    const handleStartPractice = () => {
        setShowStartConfirm(true);
    };

    const confirmStartPractice = () => {
        setShowStartConfirm(false);
        setShowDashboard(false);
        setShowPracticePopup(true);
        initializeAIAgent();
    };

    const getLevelBadgeClass = () => {
        return `practice-level-${actualPracticeLevel}`;
    };

    return (
        <div className="practice-root">
            <div className="practice-topnav">
                <div className="left">
                    <button 
                        className="practice-back-btn"
                        onClick={() => navigate(-1)}
                        title="Go back"
                        text="Back"
                    >
                        ←
                    </button>
                        
                    <h1 style={{ fontSize: '20px' }}>{practiceTitle}</h1>
                    <button 
                        className={`theme-level-button ${theme}`}
                    >
                        {/* level */}
                        {actualPracticeLevel}
                    </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ 
                        marginRight: '15px', 
                        fontWeight: '600',
                        background: 'linear-gradient(135deg, #3B9797, #2c7a7a)',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '0.9rem'
                    }}>
                        🔥 {streakData.current_streak || 0}
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
                    <div className="theme-dropdown-wrapper">
                        <label style={{ color: 'var(--muted)',fontSize: '15px' }}>Select Theme - </label>
                        <select 
                            value={theme} 
                            onChange={(e) => setTheme(e.target.value)}
                            className={`theme-dropdown-select theme-dropdown-${theme}`}
                        >
                            <option value="dark">🌙 Dark</option>
                            <option value="light">☀️ Light</option>
                            {userType === 'premium' && <option value="premium">✨ Premium</option>}
                        </select>
                    </div>
                </div>
            </div>

            {/* Dashboard Section */}
            {showDashboard && !showPracticePopup && (
                <div style={{ padding: '20px' }}>
                    <PracticeDashboard
                        streakData={streakData}
                        practiceType={practiceType}
                        practiceTitle={practiceTitle}
                        practiceLevel={actualPracticeLevel}
                        remainingPractices={remainingPractices}
                        onNavigateToPractice={() => {
                            handleStartPractice();
                        }}
                    />
                </div>
            )}

            {!showPracticePopup && !showDashboard && (
                <div style={{ textAlign: 'center', padding: 60, width: '100%' }}>
                    <div style={{ fontWeight: 700, fontSize: 32, marginBottom: 20, color: 'var(--accent)' }}>
                        {practiceTitle}
                    </div>
                    <h2 style={{ color: 'var(--muted)', fontSize: '18px', marginTop: '10px', textTransform: 'capitalize' }}>
                        {actualPracticeLevel} Level
                    </h2>
                    <div style={{ fontSize: 18, color: 'var(--muted)', marginBottom: 20 }}>
                        {practiceDescription}
                    </div>
                    <div style={{ fontSize: 16, color: 'var(--accent)', marginBottom: 40, fontWeight: 600 }}>
                        Remaining Practices: {remainingPractices}
                    </div>
                    <button 
                        className="practice-start-btn" 
                        onClick={handleStartPractice}
                        disabled={remainingPractices <= 0}
                    >
                        {remainingPractices <= 0 ? 'No Practices Remaining' : `Start ${practiceTitle}`}
                    </button>
                </div>
            )}

            {showPracticePopup && (
                <div className="practice-popup-overlay">
                    <div className="practice-popup-content">
                        <div>
                            <div className="practice-chat-section">
                                <h2 style={{ color: 'var(--accent)' }}>
                                    {practiceTitle}
                                </h2>
                                <h2 style={{ color: 'var(--muted)', fontSize: '18px', marginTop: '10px', textTransform: 'capitalize' }}>
                                    {actualPracticeLevel} Level
                                </h2>
                                
                                <div className="practice-chat-container" ref={chatRef}>
                                    {chatMessages.map((msg, index) => (
                                        <div key={index} className={`practice-chat-message ${msg.type}`}>
                                            <div className={`practice-message-bubble ${msg.type}`}>
                                                {msg.type === 'ai' ? formatAIMessage(msg.content, index) : (
                                                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="practice-chat-message ai">
                                            <div className="practice-message-bubble ai">
                                                <span className="practice-loading-dots">Thinking</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ flex: 1 }}>
                                <div className="practice-mic-area">
                                    <h3 style={{ color: 'var(--text-color)', marginBottom: 20 }}>
                                        🎙️ Voice Recording
                                    </h3>
                                    
                                    {recordingState === 'preparing' && (
                                        <div className="practice-recording-status practice-status-preparing">
                                            🎤 Preparing to record... Get ready!
                                        </div>
                                    )}
                                    
                                    {recordingState === 'recording' && (
                                        <div className="practice-recording-status practice-status-recording">
                                            🔴 Recording
                                        </div>
                                    )}
                                    
                                    {recordingState === 'processing' && (
                                        <div className="practice-recording-status practice-status-processing">
                                            ⚡ Processing your audio...
                                        </div>
                                    )}

                                    <button
                                        className={`practice-mic-btn ${recording ? 'recording' : ''}`}
                                        onClick={recordingState === 'recording' ? stopRecording : startRecording}
                                        disabled={isLoading || recordingState === 'preparing' || recordingState === 'processing'}
                                        style={{
                                            cursor: isLoading || recordingState === 'preparing' || recordingState === 'processing' ? 'not-allowed' : 'pointer',
                                            opacity: isLoading || recordingState === 'preparing' || recordingState === 'processing' ? 0.6 : 1
                                        }}
                                    >
                                        {recording ? '⏹️' : '🎙️'}
                                    </button>

                                    <button
                                        onClick={handleEndPractice}
                                        className="modern-btn btn-danger"
                                        style={{ marginTop: 30, width: '50%' }}
                                    >
                                        End Practice
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showEndConfirm && (
                <div className="confirmation-modal">
                    <div className="confirmation-content">
                        <h3 style={{ color: '#333', marginBottom: 20, fontSize: 22 }}>End Practice?</h3>
                        <p style={{ color: '#666', marginBottom: 30, fontSize: 16 }}>Are you sure you want to end this practice session?</p>
                        <div style={{ display: 'flex', gap: 15, justifyContent: 'center' }}>
                            <button 
                                onClick={() => confirmEndPractice(false)}
                                className="modern-btn btn-secondary"
                            >
                                No, Continue
                            </button>
                            <button 
                                onClick={() => confirmEndPractice(true)}
                                className="modern-btn btn-danger"
                            >
                                Yes, End
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showStartConfirm && (
                <div className="confirmation-modal">
                    <div className="confirmation-content">
                        <h3>Ready to Start?</h3>
                        <p>Are you ready to start the {practiceTitle} practice session at {actualPracticeLevel} level?</p>
                        <div className="confirmation-buttons">
                            <button 
                                onClick={() => setShowStartConfirm(false)}
                                className="modern-btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmStartPractice}
                                className="modern-btn btn-primary"
                            >
                                Start Practice
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCongrats && (
                <div className="congrats-modal">
                    <div className="congrats-content">
                        <div style={{ fontSize: 60, marginBottom: 20 }}>🎉</div>
                        <h2 style={{ color: '#333', marginBottom: 15, fontSize: 28, fontWeight: 700 }}>Congratulations!</h2>
                        <p style={{ color: '#666', fontSize: 18, marginBottom: 20 }}>You have successfully completed the <br/>{practiceTitle} - {actualPracticeLevel} Level</p>
                        <div style={{ color: '#3B9797', fontSize: 16, fontWeight: 600 }}>Refreshing...</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BaseComponentPractice;
