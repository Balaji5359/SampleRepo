import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const styles = `
    :root {
        --bg: linear-gradient(180deg,#0f172a 0%,#071129 100%);
        --card-bg: rgba(255,255,255,0.04);
        --glass: rgba(255,255,255,0.06);
        --accent: #4f46e5;
        --muted: rgba(255,255,255,0.75);
        --text-color: #e6eef8;
        --focus: rgba(79,70,229,0.18);
    }

    .jam-root {
        min-height:100vh;
        display:flex;
        flex-direction:column;
        background: var(--bg);
        transition: background 400ms ease, color 300ms ease;
        color: var(--text-color);
        font-family: Inter, "Segoe UI", system-ui, Roboto, Arial;
    }

    .jam-topnav {
        position:sticky;
        top:0;
        z-index:60;
        display:flex;
        align-items:center;
        justify-content:space-between;
        padding:12px 24px;
        backdrop-filter: blur(6px);
        background: linear-gradient(90deg, rgba(0,0,0,0.15), rgba(255,255,255,0.02));
        border-bottom:1px solid rgba(255,255,255,0.04);
    }

    .jam-topnav .left {
        display:flex;
        gap:16px;
        align-items:center;
    }

    .jam-title {
        font-weight:700;
        font-size:18px;
        letter-spacing:0.2px;
        display:flex;
        gap:10px;
        align-items:center;
        color: var(--text-color);
    }

    .jam-nav {
        display:flex;
        gap:10px;
        align-items:center;
    }

    .jam-nav button {
        background:transparent;
        border:none;
        color:var(--muted);
        padding:8px 12px;
        border-radius:8px;
        cursor:pointer;
        font-weight:600;
        transition: all 180ms;
    }

    .jam-nav button.active {
        color: var(--text-color);
        background: linear-gradient(90deg, rgba(79,70,229,0.18), rgba(34,211,238,0.06));
        box-shadow: 0 6px 20px rgba(79,70,229,0.08);
        transform: translateY(-1px);
    }

    .jam-container {
        width:100%;
        max-width:1200px;
        margin:32px auto;
        display:flex;
        gap:20px;
        padding:24px;
        box-sizing:border-box;
    }

    .card {
        background: var(--card-bg);
        border-radius:14px;
        padding:18px;
        box-shadow: 0 8px 24px rgba(2,6,23,0.35);
        backdrop-filter: blur(6px);
        border: 1px solid rgba(255,255,255,0.04);
        color: var(--text-color);
    }

    .chat-container {
        width:100%;
        height:400px;
        overflow-y:auto;
        border:1px solid rgba(255,255,255,0.1);
        border-radius:12px;
        padding:16px;
        background:rgba(255,255,255,0.02);
    }

    .chat-message {
        margin-bottom:16px;
    }

    .chat-message.user {
        text-align:right;
    }

    .chat-message.ai {
        text-align:left;
    }

    .message-bubble {
        display:inline-block;
        max-width:80%;
        padding:12px 16px;
        border-radius:18px;
        font-size:14px;
        line-height:1.4;
    }

    .message-bubble.user {
        background:var(--accent);
        color:white;
    }

    .message-bubble.ai {
        background:rgba(255,255,255,0.08);
        color:var(--text-color);
    }

    .popup-overlay {
        position:fixed;
        top:0;
        left:0;
        right:0;
        bottom:0;
        background:rgba(0,0,0,0.7);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:1000;
    }

    .popup-content {
        background:var(--card-bg);
        border-radius:16px;
        padding:32px;
        max-width:600px;
        width:90%;
        backdrop-filter:blur(10px);
        border:1px solid rgba(255,255,255,0.1);
    }

    .start-btn {
        padding:16px 32px;
        font-size:18px;
        font-weight:700;
        border:none;
        border-radius:12px;
        background:linear-gradient(135deg,#10b981,#059669);
        color:white;
        cursor:pointer;
        transition:all 200ms;
    }

    .start-btn:hover {
        transform:translateY(-2px);
        box-shadow:0 8px 25px rgba(16,185,129,0.3);
    }

    .mic-btn {
        width:120px;
        height:120px;
        border-radius:999px;
        display:flex;
        align-items:center;
        justify-content:center;
        background: linear-gradient(135deg, var(--accent) 0%, #764ba2 100%);
        border:none;
        color:white;
        font-size:36px;
        cursor:pointer;
        box-shadow: 0 15px 35px rgba(0,0,0,0.25);
        transition: all 300ms ease;
        position:relative;
    }

    .mic-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.32);
    }

    .mic-btn.recording {
        animation: pulse 1.25s infinite;
        transform: scale(1.04);
    }

    @keyframes pulse {
        0% { box-shadow: 0 8px 22px rgba(79,70,229,0.12); }
        50% { box-shadow: 0 18px 40px rgba(79,70,229,0.22); }
        100% { box-shadow: 0 8px 22px rgba(79,70,229,0.12); }
    }

    .mic-area {
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:flex-start;
        gap:12px;
        text-align:center;
        min-height:700px;
    }

    .loading-dots {
        display:inline-block;
    }

    .loading-dots::after {
        content:'...';
        animation:dots 1.5s infinite;
    }

    @keyframes dots {
        0%, 20% { content:''; }
        40% { content:'.'; }
        60% { content:'..'; }
        80%, 100% { content:'...'; }
    }

    @media (max-width: 940px) {
        .jam-container {
            flex-direction:column;
            padding:16px;
            margin:16px;
        }
    }
`;

const BaseComponent = ({ 
    testType, 
    testTitle, 
    testDescription,
    apiEndpoint,
    useRecordingAPI = false,
    onTimeRecording = false
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { remainingTests: initialRemainingTests = 0 } = location.state || {};

    const [activeTab, setActiveTab] = useState(`${testTitle} Dashboard`);
    const [remainingTests, setRemainingTests] = useState(initialRemainingTests);
    const [sessionId] = useState(`${testType}-test-${Math.floor(1000000 + Math.random() * 9000000)}`);
    const [userEmail] = useState(localStorage.getItem("email"));
    const [chatMessages, setChatMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [recording, setRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);
    const [showTestPopup, setShowTestPopup] = useState(false);
    const [theme, setTheme] = useState('light');
    const [userType, setUserType] = useState('free');
    const [streakData, setStreakData] = useState({ current_streak: 0 });
    
    const chatRef = useRef(null);
    const recognitionRef = useRef(null);
    const timerRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const streamRef = useRef(null);

    useEffect(() => {
        const id = 'base-component-styles';
        if (!document.getElementById(id)) {
            const s = document.createElement('style');
            s.id = id;
            s.innerHTML = styles;
            document.head.appendChild(s);
        }

        fetchUserData();
        fetchTestCounts();
    }, []);

    const fetchUserData = async () => {
        try {
            const storedEmail = localStorage.getItem('email');
            if (!storedEmail) return;

            const [profileResponse, streakResponse] = await Promise.all([
                fetch('https://ntjkr8rnd6.execute-api.ap-south-1.amazonaws.com/dev/student_profilecreate/student_profile_senddata', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ college_email: storedEmail })
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
            ]);

            const profile = await profileResponse.json();
            const streak = await streakResponse.json();
            
            if (profile?.body) {
                const userData = JSON.parse(profile.body);
                const isPremium = userData?.user_type === 'premium' && userData?.premium_status === 'active';
                setUserType(isPremium ? 'premium' : 'free');
                setTheme(isPremium ? 'premium' : 'light');
            }
            
            if (streak?.body) {
                const streakDataResult = JSON.parse(streak.body);
                setStreakData(streakDataResult);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chatMessages]);

    useEffect(() => {
        const root = document.documentElement;
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
            root.style.setProperty('--accent', '#4f46e5');
            root.style.setProperty('--muted', 'rgba(255,255,255,0.85)');
            root.style.setProperty('--text-color', '#e6eef8');
        }
    }, [theme]);

    const fetchTestCounts = async () => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            try {
                const response = await fetch('https://ntjkr8rnd6.execute-api.ap-south-1.amazonaws.com/dev/student_profilecreate/student_profile_senddata', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ college_email: storedEmail })
                });
                const data = await response.json();
                const parsedData = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
                setRemainingTests(parsedData.tests?.[`${testType}_test`] || 0);
            } catch (error) {
                console.error('Error fetching test counts:', error);
            }
        }
    };

    const decrementTestCount = async () => {
        try {
            const email = localStorage.getItem('email');
            const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/comm-test-decrement', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    college_email: email,
                    test_key: `${testType}_test`
                })
            });
            
            const data = await response.json();
            if (data.statusCode === 200) {
                setRemainingTests(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error decrementing test count:', error);
        }
    };

    const sendAudioToRecordingAPI = async (audioBlob) => {
        try {
            setIsLoading(true);
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);

            reader.onloadend = async () => {
                const base64Audio = reader.result.split(',')[1];
                
                const requestBody = {
                    body: JSON.stringify({
                        data: base64Audio,
                        sessionId: sessionId
                    })
                };

                const response1 = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_recordingapi', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });

                // Poll for transcript
                let attempts = 0;
                const maxAttempts = 12;
                const pollTranscript = async () => {
                    try {
                        const response2 = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_transcribeapi', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ body: { sessionId: sessionId } })
                        });

                        const data2 = await response2.json();
                        let responseData = data2.body ? JSON.parse(data2.body) : data2;

                        if (responseData.status === 'completed' && responseData.transcript) {
                            await sendMessage(responseData.transcript.trim());
                            return;
                        }

                        if (attempts < maxAttempts && (responseData.error === 'Transcript JSON not found' || responseData.status === 'processing')) {
                            attempts++;
                            setTimeout(pollTranscript, 2000);
                            return;
                        }

                        setChatMessages(prev => [...prev, 
                            { type: 'ai', content: 'Audio processing timeout. Please try again.', timestamp: Date.now() }
                        ]);
                        setIsLoading(false);
                    } catch (error) {
                        if (attempts < maxAttempts) {
                            attempts++;
                            setTimeout(pollTranscript, 2000);
                        } else {
                            setChatMessages(prev => [...prev, 
                                { type: 'ai', content: 'Error processing audio. Please try again.', timestamp: Date.now() }
                            ]);
                            setIsLoading(false);
                        }
                    }
                };

                setTimeout(pollTranscript, 3000);
            };
        } catch (error) {
            console.error('Error processing audio:', error);
            setChatMessages(prev => [...prev, 
                { type: 'ai', content: 'Error processing audio. Please try again.', timestamp: Date.now() }
            ]);
            setIsLoading(false);
        }
    };

    const startRecording = async () => {
        if (useRecordingAPI) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;
                audioChunksRef.current = [];

                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                    await sendAudioToRecordingAPI(audioBlob);
                    
                    if (streamRef.current) {
                        streamRef.current.getTracks().forEach(track => track.stop());
                        streamRef.current = null;
                    }
                };

                mediaRecorder.start();
                setRecording(true);
            } catch (error) {
                console.error('Error starting recording:', error);
                alert('Failed to start recording. Please check microphone permissions.');
            }
        } else {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert('Speech Recognition not supported. Please type your response.');
                return;
            }

            try {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onstart = () => {
                    setRecording(true);
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
                };

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    sendMessage(transcript);
                };

                recognition.onerror = () => {
                    setRecording(false);
                    if (timerRef.current) clearInterval(timerRef.current);
                };

                recognition.onend = () => {
                    setRecording(false);
                    if (timerRef.current) clearInterval(timerRef.current);
                };

                recognition.start();
                recognitionRef.current = recognition;
            } catch (error) {
                console.error('Failed to start speech recognition:', error);
            }
        }
    };

    const stopRecording = () => {
        if (useRecordingAPI) {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        } else {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
        setRecording(false);
    };

    const sendMessage = async (message) => {
        setIsLoading(true);
        
        try {
            const requestBody = {
                body: {
                    message: message,
                    sessionId: sessionId,
                    email: userEmail
                }
            };

            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            let aiResponse = JSON.parse(data.body).response;
            
            const textarea = document.createElement('textarea');
            textarea.innerHTML = aiResponse;
            aiResponse = textarea.value;

            setChatMessages(prev => [
                ...prev,
                { type: 'user', content: message, timestamp: Date.now() },
                { type: 'ai', content: aiResponse, timestamp: Date.now() }
            ]);

        } catch (error) {
            console.error('Error sending message:', error);
            setChatMessages(prev => [
                ...prev,
                { type: 'user', content: message, timestamp: Date.now() },
                { type: 'ai', content: `Error: ${error.message}. Please try again.`, timestamp: Date.now() }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const startTest = async () => {
        if (remainingTests <= 0) {
            alert('No tests remaining!');
            return;
        }
        
        await decrementTestCount();
        setShowTestPopup(true);
        await sendMessage('hi');
    };

    return (
        <div className={`jam-root ${userType === 'premium' ? 'premium-bg' : 'free-bg'}`}>
            <div className="jam-topnav">
                <div className="left">
                    <div className="jam-title">
                        {testTitle}
                    </div>
                    <div className="jam-nav">
                        {['Back', 'Practice', `${testTitle} Dashboard`, `${testTitle} Leaderboard`].map((t) => (
                            <button
                                key={t}
                                className={activeTab === t ? 'active' : ''}
                                onClick={() => {
                                    if (t === 'Back') navigate('/test');
                                    else setActiveTab(t);
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
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
                    <label style={{ color: 'var(--muted)', fontSize: 13 }}>Theme:</label>
                    <select 
                        value={theme} 
                        onChange={(e) => setTheme(e.target.value)}
                        style={{ 
                            background: 'rgba(255,255,255,0.03)', 
                            border: 'none', 
                            padding: '6px 8px', 
                            borderRadius: '8px', 
                            color: 'var(--muted)' 
                        }}
                    >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        {userType === 'premium' && <option value="premium">Premium</option>}
                    </select>
                </div>
            </div>

            <div className="jam-container">
                {!showTestPopup && (
                    <div className="card" style={{ textAlign: 'center', padding: 60, width: '100%' }}>
                        <div style={{ fontWeight: 700, fontSize: 32, marginBottom: 20, color: 'var(--accent)' }}>
                            {testTitle}
                        </div>
                        <div style={{ fontSize: 18, color: 'var(--muted)', marginBottom: 20 }}>
                            {testDescription}
                        </div>
                        <div style={{ fontSize: 16, color: 'var(--accent)', marginBottom: 40, fontWeight: 600 }}>
                            Remaining Tests: {remainingTests}
                        </div>
                        <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
                            <button 
                                className="start-btn" 
                                onClick={startTest} 
                                disabled={remainingTests <= 0}
                            >
                                {remainingTests <= 0 ? 'No Tests Remaining' : `Start ${testTitle}`}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showTestPopup && (
                <div className="popup-overlay">
                    <div className="popup-content" style={{ maxWidth: '1300px', width: '80%', height: '90%' }}>
                        <div style={{ display: 'flex', gap: 20, height: '100%' }}>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ color: 'var(--accent)' }}>
                                    {testTitle}
                                </h2>
                                
                                <div className="chat-container" ref={chatRef} style={{ height: '550px' }}>
                                    {chatMessages.map((msg, index) => (
                                        <div key={index} className={`chat-message ${msg.type}`}>
                                            <div className={`message-bubble ${msg.type}`}>
                                                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="chat-message ai">
                                            <div className="message-bubble ai">
                                                <span className="loading-dots">Thinking</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ flex: 1 }}>
                                <div className="mic-area">
                                    <h3 style={{ color: 'var(--text-color)', marginBottom: 20 }}>
                                        Voice Recording
                                    </h3>
                                    
                                    {recording && !useRecordingAPI && (
                                        <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--accent)', marginBottom: 16 }}>
                                            Recording: {timeLeft}s
                                        </div>
                                    )}

                                    <button
                                        className={`mic-btn ${recording ? 'recording' : ''}`}
                                        onClick={recording ? stopRecording : startRecording}
                                        disabled={isLoading}
                                    >
                                        {recording ? (
                                            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                                                <rect x="6" y="6" width="12" height="12" rx="2" />
                                            </svg>
                                        ) : (
                                            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
                                                <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                                                <line x1="12" y1="19" x2="12" y2="23" />
                                                <line x1="8" y1="23" x2="16" y2="23" />
                                            </svg>
                                        )}
                                    </button>

                                    <p style={{ color: 'var(--muted)', fontSize: '14px', textAlign: 'center', marginTop: 20 }}>
                                        {useRecordingAPI 
                                            ? "Click to start/stop recording (one-time recording)"
                                            : "Click to record for 10 seconds"
                                        }
                                    </p>

                                    <button
                                        onClick={() => {
                                            alert('Test completed!');
                                            window.location.reload();
                                        }}
                                        style={{
                                            marginTop: 40,
                                            padding: '12px 24px',
                                            background: '#ef4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        End Test
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BaseComponent;