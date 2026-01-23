import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const styles = `
    .base-root {
        min-height:100vh;
        display:flex;
        flex-direction:column;
        background: var(--bg);
        transition: background 400ms ease, color 300ms ease;
        color: var(--text-color);
        font-family: Inter, "Segoe UI", system-ui, Roboto, Arial;
    }

    .base-topnav {
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

    .base-topnav .left {
        display:flex;
        gap:16px;
        align-items:center;
    }

    .base-title {
        font-weight:700;
        font-size:18px;
        letter-spacing:0.2px;
        display:flex;
        gap:10px;
        align-items:center;
        color: var(--text-color);
    }

    .base-nav {
        display:flex;
        gap:10px;
        align-items:center;
    }

    .base-nav button {
        background:transparent;
        border:none;
        color:var(--muted);
        padding:8px 12px;
        border-radius:8px;
        cursor:pointer;
        font-weight:600;
        transition: all 180ms;
    }

    .base-nav button.active {
        color: var(--text-color);
        background: linear-gradient(90deg, rgba(79,70,229,0.18), rgba(34,211,238,0.06));
        box-shadow: 0 6px 20px rgba(79,70,229,0.08);
        transform: translateY(-1px);
    }

    .base-container {
        width:100%;
        max-width:1200px;
        margin:32px auto;
        display:flex;
        gap:20px;
        padding:24px;
        box-sizing:border-box;
    }

    .base-card {
        background: var(--card-bg);
        border-radius:14px;
        padding:18px;
        box-shadow: 0 8px 24px rgba(2,6,23,0.35);
        backdrop-filter: blur(6px);
        border: 1px solid rgba(255,255,255,0.04);
        color: var(--text-color);
    }

    .base-chat-container {
        width:100%;
        height:400px;
        overflow-y:auto;
        border:1px solid rgba(255,255,255,0.1);
        border-radius:12px;
        padding:16px;
        background:rgba(255,255,255,0.02);
        font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
    }

    .base-chat-message {
        margin-bottom:20px;
    }

    .base-chat-message.user {
        text-align:right;
    }

    .base-chat-message.ai {
        text-align:left;
    }

    .base-message-bubble {
        display:inline-block;
        max-width:80%;
        padding:16px 20px;
        border-radius:18px;
        font-size:15px;
        line-height:1.6;
        font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
        font-weight: 400;
        letter-spacing: 0.3px;
    }

    .base-message-bubble.user {
        background:var(--accent);
        color:white;
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }

    .base-message-bubble.ai {
        background:rgba(255,255,255,0.08);
        color:var(--text-color);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .base-popup-overlay {
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

    .base-popup-content {
        background: white;
        border-radius:20px;
        padding:32px;
        max-width:600px;
        width:90%;
        height: 70vh;
        box-shadow: 0 25px 50px rgba(0,0,0,0.25);
        border: none;
    }

    .modern-btn {
        padding: 12px 24px;
        border: none;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
    }

    .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    .btn-danger {
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
        color: white;
    }

    .btn-danger:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
    }

    .btn-success {
        background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
        color: white;
    }

    .btn-secondary {
        background: #f8f9fa;
        color: #495057;
        border: 2px solid #e9ecef;
    }

    .confirmation-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    }

    .confirmation-content {
        background: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 25px 50px rgba(0,0,0,0.3);
        max-width: 400px;
        width: 90%;
    }

    .congrats-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
    }

    .congrats-content {
        background: white;
        padding: 60px 40px;
        border-radius: 25px;
        text-align: center;
        box-shadow: 0 30px 60px rgba(0,0,0,0.3);
        max-width: 500px;
        width: 90%;
        animation: bounceIn 0.6s ease;
    }

    @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
    }

    .recording-status {
        padding: 16px;
        border-radius: 12px;
        margin: 20px 0;
        text-align: center;
        font-weight: 600;
    }

    .status-preparing {
        background: linear-gradient(135deg, #ffd93d 0%, #ff9500 100%);
        color: white;
    }

    .status-recording {
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
        color: white;
        animation: pulse 1.5s infinite;
    }

    .status-processing {
        background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
        color: white;
    }

    .base-start-btn {
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

    .base-start-btn:hover {
        transform:translateY(-2px);
        box-shadow:0 8px 25px rgba(16,185,129,0.3);
    }

    .base-mic-btn {
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

    .base-mic-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.32);
    }

    .base-mic-btn.recording {
        animation: base-pulse 1.25s infinite;
        transform: scale(1.04);
    }

    @keyframes base-pulse {
        0% { box-shadow: 0 8px 22px rgba(79,70,229,0.12); }
        50% { box-shadow: 0 18px 40px rgba(79,70,229,0.22); }
        100% { box-shadow: 0 8px 22px rgba(79,70,229,0.12); }
    }

    .base-mic-area {
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:flex-start;
        gap:12px;
        text-align:center;
        min-height:700px;
    }

    .base-loading-dots {
        display:inline-block;
    }

    .base-loading-dots::after {
        content:'...';
        animation:base-dots 1.5s infinite;
    }

    @keyframes base-dots {
        0%, 20% { content:''; }
        40% { content:'.'; }
        60% { content:'..'; }
        80%, 100% { content:'...'; }
    }

    :root {
        --bg: linear-gradient(180deg,#0f172a 0%,#071129 100%);
        --card-bg: rgba(255,255,255,0.04);
        --accent: #4f46e5;
        --muted: rgba(255,255,255,0.75);
        --text-color: #e6eef8;
    }

    @media (max-width: 940px) {
        .base-container {
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
    testLevel = 'basic',
    testDuration = 600,
    apiEndpoint,
    recordingMode = 'short',
    autoStartMessage = 'hi'
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { remainingTests: initialRemainingTests = 0, testLevel: passedTestLevel = 'basic' } = location.state || {};
    
    const actualTestLevel = passedTestLevel !== 'basic' ? passedTestLevel : testLevel;

    const [activeTab, setActiveTab] = useState(`${testTitle} Dashboard`);
    const [remainingTests, setRemainingTests] = useState(initialRemainingTests);
    const sessionIdRef = useRef(null);
    if (!sessionIdRef.current) {
        sessionIdRef.current = `${testType}-test-${actualTestLevel}-${Math.floor(1000000 + Math.random() * 9000000)}`;
        console.log('Generated Session ID:', sessionIdRef.current);
    }
    const sessionId = sessionIdRef.current;
    const [userEmail] = useState(localStorage.getItem("email"));
    const [chatMessages, setChatMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [recording, setRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);
    const [showTestPopup, setShowTestPopup] = useState(false);
    const [theme, setTheme] = useState('light');
    const [userType, setUserType] = useState('free');
    const [streakData, setStreakData] = useState({ current_streak: 0 });
    const [recordingState, setRecordingState] = useState('idle'); // idle, preparing, recording, processing
    const [showEndConfirm, setShowEndConfirm] = useState(false);
    const [showCongrats, setShowCongrats] = useState(false);
    const [hasRecorded, setHasRecorded] = useState(false);
    const [clickedButtons, setClickedButtons] = useState(new Set());
    const [testTimeLeft, setTestTimeLeft] = useState(testDuration);
    const testTimerRef = useRef(null);
    
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
                console.log(testType)
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

    const sendAudioToDirectAPI = async (audioBlob) => {
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
                const transcript = JSON.parse(data.body).transcript;
                
                if (transcript) {
                    await sendMessage(transcript.trim());
                } else {
                    setChatMessages(prev => [...prev, 
                        { type: 'ai', content: 'Could not process audio. Please try again.', timestamp: Date.now() }
                    ]);
                }
                setIsLoading(false);
            };
        } catch (error) {
            console.error('Error processing audio:', error);
            setChatMessages(prev => [...prev, 
                { type: 'ai', content: 'Error processing audio. Please try again.', timestamp: Date.now() }
            ]);
            setIsLoading(false);
        }
    };

    const sendAudioToLongRecordingAPI = async (audioBlob) => {
        try {
            setIsLoading(true);
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);

            reader.onloadend = async () => {
                const base64Audio = reader.result.split(',')[1];
                
                console.log('Using sessionId for recording API:', sessionId);
                const requestBody = {
                    body: JSON.stringify({
                        data: base64Audio,
                        sessionId: sessionId,
                        testType: testType,
                        testLevel: actualTestLevel
                    })
                };

                await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_recordingapi', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });

                let attempts = 0;
                const maxAttempts = 12;
                const pollTranscript = async () => {
                    try {
                        console.log('Using sessionId for transcribe API:', sessionId);
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

    // Get recording duration based on test type
    const getRecordingDuration = () => {
        if (testType === 'jam' || testType === 'situation') return 60;
        if (testType === 'listening' || testType === 'pronunciation') {
            return actualTestLevel === 'advanced' ? 15 : 10;
        }
        return 30;
    };

    const startRecording = async () => {
        if (hasRecorded && (testType === 'jam' || testType === 'situation')) {
            return; // Only allow one recording for JAM and situation tests
        }

        setRecordingState('preparing');
        
        // Wait 2-3 seconds before starting
        setTimeout(async () => {
            const duration = getRecordingDuration();
            setTimeLeft(duration);
            setRecordingState('recording');
            setRecording(true);
            
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
                    setRecordingState('processing');
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                    
                    // Wait 2-3 seconds for processing UI
                    setTimeout(async () => {
                        if (testType === 'pronunciation' || testType === 'listening') {
                            await sendAudioToDirectAPI(audioBlob);
                        } else {
                            await sendAudioToLongRecordingAPI(audioBlob);
                        }
                        setRecordingState('idle');
                        if (testType === 'jam' || testType === 'situation') {
                            setHasRecorded(true);
                        }
                    }, 2500);
                    
                    if (streamRef.current) {
                        streamRef.current.getTracks().forEach(track => track.stop());
                        streamRef.current = null;
                    }
                };

                mediaRecorder.start();
                
                // Auto-stop after duration
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
                console.error('Error starting recording:', error);
                setRecordingState('idle');
                alert('Failed to start recording. Please check microphone permissions.');
            }
        }, 2500);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setRecording(false);
    };

    const handleEndTest = () => {
        setShowEndConfirm(true);
    };

    const confirmEndTest = () => {
        if (testTimerRef.current) {
            clearInterval(testTimerRef.current);
        }
        setShowCongrats(true);
        setTimeout(() => {
            window.location.reload();
        }, 4000);
    };

    // Format AI message content with proper styling and interactive buttons
    const formatAIMessage = (content, messageIndex) => {
        const handleButtonClick = (value, buttonId) => {
            setClickedButtons(prev => new Set([...prev, buttonId]));
            sendMessage(value);
        };

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

    // Format message text with proper styling
    const formatMessageText = (text) => {
        return text
            // Final Assessment headers
            .replace(/FINAL SPEAKING/g, '<div style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: white; padding: 16px 20px; border-radius: 12px; font-weight: 700; font-size: 20px; margin: 15px 0; text-align: center; font-family: Inter, sans-serif; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);">🎤 FINAL SPEAKING</div>')
            .replace(/OVERALL/g, '<div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 14px 18px; border-radius: 10px; font-weight: 700; font-size: 16px; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #059669;">📊 OVERALL</div>')
            .replace(/COMPREHENSIVE SCORES:/g, '<div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #dc2626;">📋 COMPREHENSIVE SCORES:</div>')
            .replace(/DETAILED ANALYSIS:/g, '<div style="background: linear-gradient(135deg, #7c2d12 0%, #92400e 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #7c2d12;">🔍 DETAILED ANALYSIS:</div>')
            .replace(/STRENGTHS IDENTIFIED:/g, '<div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #16a34a;">💪 STRENGTHS IDENTIFIED:</div>')
            .replace(/PROFESSIONAL RECOMMENDATIONS:/g, '<div style="background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #1d4ed8;">🎯 PROFESSIONAL RECOMMENDATIONS:</div>')
            .replace(/(Final Speaking Score:)\s*(\d+\.\d+)\s*\/\s*(\d+\.\d+)/g, '<div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 10px 16px; border-radius: 20px; display: inline-block; font-weight: 700; margin: 8px 0; font-family: Inter, sans-serif; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);">🏆 $1 $2/$3</div>')
            
            // Pronunciation Test specific headers
            .replace(/SPEAKING ASSESSMENT - SENTENCE \((\d+\/\d+)\):/g, '<div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 16px 20px; border-radius: 12px; font-weight: 700; font-size: 18px; margin: 15px 0; text-align: center; font-family: Inter, sans-serif; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);">🎤 SPEAKING ASSESSMENT - SENTENCE ($1):</div>')
            .replace(/PRONUNCIATION ANALYSIS REPORT/g, '<div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 16px 20px; border-radius: 12px; font-weight: 700; font-size: 18px; margin: 15px 0; text-align: center; font-family: Inter, sans-serif; box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);">📊 PRONUNCIATION ANALYSIS REPORT</div>')
            .replace(/YOUR SPEECH:/g, '<div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #f59e0b;">🗣️ YOUR SPEECH:</div>')
            .replace(/ACCURACY ANALYSIS:/g, '<div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #10b981;">🎯 ACCURACY ANALYSIS:</div>')
            .replace(/PERFORMANCE METRICS:/g, '<div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #3b82f6;">📈 PERFORMANCE METRICS:</div>')
            .replace(/PRONUNCIATION FOCUS:/g, '<div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #ef4444;">🎯 PRONUNCIATION FOCUS:</div>')
            .replace(/(SENTENCE SCORE:)\s*(\d+\.\d+)\s*\/\s*(\d+\.\d+)/g, '<div style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); color: white; padding: 8px 14px; border-radius: 20px; display: inline-block; font-weight: 700; margin: 6px 0; font-family: Inter, sans-serif; box-shadow: 0 3px 10px rgba(255, 152, 0, 0.4);">⭐ $1 $2/$3</div>')
            
            // Assessment Report Headers
            .replace(/ASSESSMENT REPORT/g, '<div style="background: linear-gradient(135deg, #b4beafff 0%, #b2e357ff 100%); color: black; padding: 16px 20px; border-radius: 12px; font-weight: 700; font-size: 18px; margin: 15px 0; text-align: center; font-family: Inter, sans-serif; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">📊 ASSESSMENT REPORT</div>')
            .replace(/SITUATIONAL ASSESSMENT REPORT/g, '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 20px; border-radius: 12px; font-weight: 700; font-size: 18px; margin: 15px 0; text-align: center; font-family: Inter, sans-serif; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">📊 SITUATIONAL ASSESSMENT REPORT</div>')
            
            // Topic and Scenario headers
            .replace(/TOPIC:/g, '<div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); color: #1565c0; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #1565c0;">🎯 TOPIC:</div>')
            .replace(/SCENARIO:/g, '<div style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); color: #2e7d32; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #2e7d32;">🎭 SCENARIO:</div>')
            .replace(/Situation:/g, '<div style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); color: #2e7d32; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #2e7d32;">🎭 Situation:</div>')
            
            // Performance and Analysis sections
            .replace(/PERFORMANCE SUMMARY:/g, '<div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); color: #ef6c00; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #ef6c00;">📈 PERFORMANCE SUMMARY:</div>')
            .replace(/RESPONSE ANALYSIS:/g, '<div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); color: #ef6c00; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #ef6c00;">📈 RESPONSE ANALYSIS:</div>')
            .replace(/DETAILED EVALUATION:/g, '<div style="background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); color: #7b1fa2; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #7b1fa2;">🔍 DETAILED EVALUATION:</div>')
            
            // Development and Readiness sections
            .replace(/PROFESSIONAL DEVELOPMENT AREAS:/g, '<div style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); color: #388e3c; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #388e3c;">🚀 DEVELOPMENT AREAS:</div>')
            .replace(/INTERVIEW READINESS ASSESSMENT:/g, '<div style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); color: #388e3c; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #388e3c;">💼 INTERVIEW READINESS:</div>')
            
            // Placement sections
            .replace(/PLACEMENT READINESS:/g, '<div style="background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);">🎯 PLACEMENT READINESS:</div>')
            .replace(/PLACEMENT EVALUATION:/g, '<div style="background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);">🎯 PLACEMENT EVALUATION:</div>')
            
            // Scores with highlighting
            .replace(/(JAM Score:|Situational Score:)\s*(\d+\.\d+)\s*\/\s*(\d+\.\d+)/g, '<div style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); color: white; padding: 8px 14px; border-radius: 20px; display: inline-block; font-weight: 700; margin: 6px 0; font-family: Inter, sans-serif; box-shadow: 0 3px 10px rgba(255, 152, 0, 0.4);">⭐ $1 $2/$3</div>')
            
            // Bullet points with better styling
            .replace(/^- /gm, '<span style="color: #667eea; font-weight: 600; margin-right: 8px;">•</span> ')
            .replace(/^\d+\. /gm, (match) => `<span style="color: #667eea; font-weight: 700; background: rgba(102, 126, 234, 0.1); padding: 2px 8px; border-radius: 12px; margin-right: 8px; font-size: 13px;">${match}</span>`)
            
            // Better paragraph spacing
            .replace(/\n\n/g, '<br/><br/>')
            .replace(/\n/g, '<br/>');
    };
    const sendMessage = async (message) => {
        setIsLoading(true);
        
        try {
            console.log('Using sessionId for AI agent:', sessionId);
            const requestBody = {
                body: {
                    message: message,
                    sessionId: sessionId,
                    email: userEmail,
                    level: actualTestLevel
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
        setTestTimeLeft(testDuration);
        
        // Start test timer
        testTimerRef.current = setInterval(() => {
            setTestTimeLeft(prev => {
                if (prev <= 1) {
                    confirmEndTest(); // Auto-end test when time runs out
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        await sendMessage(autoStartMessage);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`base-root ${userType === 'premium' ? 'premium-bg' : 'free-bg'}`}>
            <div className="base-topnav">
                <div className="left">
                    <div className="base-title">
                        {testTitle}
                    </div>
                    <div className="base-nav">
                        {['Back', 'Practice', `${testTitle} Dashboard`, `${testTitle} Leaderboard`].map((t) => {
                            const getRoute = (tabName) => {
                                if (tabName === 'Back') return '/test';
                                if (tabName === 'Practice') return '/practice';
                                if (tabName === `${testTitle} Dashboard`) {
                                    const dashboardRoutes = {
                                        'JAM Test': '#',
                                        'Situation Speaking': '#',
                                        'Listening Test': '#',
                                        'Pronunciation Test': '#'
                                    };
                                    return dashboardRoutes[testTitle] || '/student-dashboard';
                                }
                                if (tabName === `${testTitle} Leaderboard`) return '/student-leaderboard';
                                return '#';
                            };
                            
                            return (
                                <button
                                    key={t}
                                    className={activeTab === t ? 'active' : ''}
                                    onClick={() => {
                                        const route = getRoute(t);
                                        if (route !== '#') {
                                            navigate(route);
                                        } else {
                                            setActiveTab(t);
                                        }
                                    }}
                                >
                                    {t}
                                </button>
                            );
                        })}
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

            <div className="base-container">
                {!showTestPopup && (
                    <div className="base-card" style={{ textAlign: 'center', padding: 60, width: '100%' }}>
                        <div style={{ fontWeight: 700, fontSize: 32, marginBottom: 20, color: 'var(--accent)' }}>
                            {testTitle}
                        </div>
                        <h2 style={{ color: 'var(--muted)', fontSize: '18px', marginTop: '10px', textTransform: 'capitalize' }}>
                            {actualTestLevel} Level
                        </h2>
                        <div style={{ fontSize: 18, color: 'var(--muted)', marginBottom: 20 }}>
                            {testDescription}
                        </div>
                        <div style={{ fontSize: 16, color: 'var(--accent)', marginBottom: 40, fontWeight: 600 }}>
                            Remaining Tests: {remainingTests}
                        </div>
                        <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
                            <button 
                                className="base-start-btn" 
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
                <div className="base-popup-overlay">
                    <div className="base-popup-content" style={{ maxWidth: '1300px', width: '80%', height: '80%' }}>
                        <div style={{ display: 'flex', gap: 20, height: '100%' }}>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ color: 'var(--accent)' }}>
                                    {testTitle}
                                </h2>
                                <h2 style={{ color: 'var(--muted)', fontSize: '18px', marginTop: '10px', textTransform: 'capitalize' }}>
                                    {actualTestLevel} Level
                                </h2>
                                
                                <div className="base-chat-container" ref={chatRef} style={{ height: '450px' }}>
                                    {chatMessages.map((msg, index) => (
                                        <div key={index} className={`base-chat-message ${msg.type}`}>
                                            <div className={`base-message-bubble ${msg.type}`} style={{
                                                background: msg.type === 'user' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa',
                                                color: msg.type === 'user' ? 'white' : '#333',
                                                border: msg.type === 'ai' ? '2px solid #e9ecef' : 'none',
                                                maxWidth: '85%',
                                                padding: '12px 16px',
                                                lineHeight: '1.5'
                                            }}>
                                                {msg.type === 'ai' ? formatAIMessage(msg.content, index) : (
                                                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="base-chat-message ai">
                                            <div className="base-message-bubble ai" style={{ background: '#f8f9fa', color: '#333', border: '2px solid #e9ecef' }}>
                                                <span className="base-loading-dots">Thinking</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ flex: 1 }}>
                                <div className="base-mic-area">
                                    <h3 style={{ color: 'var(--text-color)', marginBottom: 20 }}>
                                        Voice Recording
                                    </h3>
                                    
                                    {recordingState === 'preparing' && (
                                        <div className="recording-status status-preparing">
                                            🎤 Preparing to record... Get ready!
                                        </div>
                                    )}
                                    
                                    {recordingState === 'recording' && (
                                        <div className="recording-status status-recording">
                                            🔴 Recording: {timeLeft}s remaining
                                        </div>
                                    )}
                                    
                                    {recordingState === 'processing' && (
                                        <div className="recording-status status-processing">
                                            ⚡ Processing your audio...
                                        </div>
                                    )}

                                    <button
                                        className={`base-mic-btn ${recording ? 'recording' : ''}`}
                                        onClick={recordingState === 'recording' ? stopRecording : startRecording}
                                        disabled={isLoading || recordingState === 'preparing' || recordingState === 'processing' || (hasRecorded && (testType === 'jam' || testType === 'situation'))}
                                        style={{
                                            background: hasRecorded && (testType === 'jam' || testType === 'situation') 
                                                ? 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
                                                : recordingState === 'recording' 
                                                ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)'
                                                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            cursor: (hasRecorded && (testType === 'jam' || testType === 'situation')) || isLoading || recordingState === 'preparing' || recordingState === 'processing' ? 'not-allowed' : 'pointer',
                                            opacity: (hasRecorded && (testType === 'jam' || testType === 'situation')) || isLoading || recordingState === 'preparing' || recordingState === 'processing' ? 0.6 : 1
                                        }}
                                    >
                                        {recordingState === 'preparing' ? (
                                            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                                                <circle cx="12" cy="12" r="10" opacity="0.3"/>
                                                <path d="M12 6v6l4 2"/>
                                            </svg>
                                        ) : recordingState === 'processing' ? (
                                            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                                                <circle cx="12" cy="12" r="3" opacity="0.8"/>
                                                <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
                                            </svg>
                                        ) : recording ? (
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
                                        {hasRecorded && (testType === 'jam' || testType === 'situation') ? (
                                            "⏳ Please wait 10-15 seconds for AI feedback and score"
                                        ) : recordingMode === 'long'
                                            ? "Click to start/stop recording (one-time recording)"
                                            : `Click to record for ${recordingMode === 'short' ? '10' : '30'} seconds`
                                        }
                                    </p>

                                    <button
                                        onClick={handleEndTest}
                                        className="modern-btn btn-danger"
                                        style={{ marginTop: 30, width: '30%' }}
                                    >
                                        End Test
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
                        <h3 style={{ color: '#333', marginBottom: 20, fontSize: 22 }}>End Test?</h3>
                        <p style={{ color: '#666', marginBottom: 30, fontSize: 16 }}>Are you sure you want to end this test? Your progress will be saved.</p>
                        <div style={{ display: 'flex', gap: 15, justifyContent: 'center' }}>
                            <button 
                                onClick={() => setShowEndConfirm(false)}
                                className="modern-btn btn-secondary"
                            >
                                No, Continue
                            </button>
                            <button 
                                onClick={confirmEndTest}
                                className="modern-btn btn-danger"
                            >
                                Yes, End Test
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
                        <p style={{ color: '#666', fontSize: 18, marginBottom: 20 }}>You have successfully completed the {testTitle} - {actualTestLevel} Level</p>
                        <div style={{ color: '#667eea', fontSize: 16, fontWeight: 600 }}>Redirecting in a moment...</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BaseComponent;