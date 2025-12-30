import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "./test.css";

/**
 * Corrected JAM.jsx
 *
 * Fixes:
 *  - Theme/background changes now affect the whole screen.
 *  - CSS variables are defined on :root (document.documentElement) so JS updates override defaults.
 *  - Component reads colors from CSS variables (text, card bg, accent) so switching theme updates UI instantly.
 *
 * Notes:
 *  - If you want the body to fully show gradients behind the app, ensure the app container does not set an opaque background.
 *  - Optional: remove any global CSS that conflicts with these variables.
 */

let Recharts;
try {
    Recharts = require('recharts');
} catch (e) {
    Recharts = null;
}

/* ---------- Utility helpers ---------- */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const formatNumber = (n) => n?.toLocaleString?.() ?? String(n ?? 0);

/* ---------- Inline CSS injected (moved defaults to :root) ---------- */
const styles = `
    :root {
    /* default theme variables (can be overwritten by JS) */
    --bg: linear-gradient(180deg,#0f172a 0%,#071129 100%);
    --card-bg: rgba(255,255,255,0.04);
    --glass: rgba(255,255,255,0.06);
    --accent: #4f46e5;
    --muted: rgba(255,255,255,0.75);
    --text-color: #e6eef8;
    --focus: rgba(79,70,229,0.18);
    --theme-update: 0;
    }

    /* Root container uses the variable values (will reflect changes to :root variables) */
    .jam-root {
    min-height:100vh;
    display:flex;
    flex-direction:column;
    background: var(--bg);
    transition: background 400ms ease, color 300ms ease;
    color: var(--text-color);
    font-family: Inter, "Segoe UI", system-ui, Roboto, Arial;
    }

    /* layout */
    .jam-container { width:100%; max-width:1200px; margin:32px auto; display:flex; gap:20px; padding:24px; box-sizing:border-box; }
    .jam-topnav { position:sticky; top:0; z-index:60; display:flex; align-items:center; justify-content:space-between; padding:12px 24px; backdrop-filter: blur(6px); background: linear-gradient(90deg, rgba(0,0,0,0.15), rgba(255,255,255,0.02)); border-bottom:1px solid rgba(255,255,255,0.04); }
    .jam-topnav .left { display:flex; gap:16px; align-items:center; }
    .jam-title { font-weight:700; font-size:18px; letter-spacing:0.2px; display:flex; gap:10px; align-items:center; color: var(--text-color); }
    .jam-nav { display:flex; gap:10px; align-items:center; }
    .jam-nav button { background:transparent; border:none; color:var(--muted); padding:8px 12px; border-radius:8px; cursor:pointer; font-weight:600; transition: all 180ms; }
    .jam-nav button:focus { outline:3px solid var(--focus); }
    .jam-nav button.active { color: var(--text-color); background: linear-gradient(90deg, rgba(79,70,229,0.18), rgba(34,211,238,0.06)); box-shadow: 0 6px 20px rgba(79,70,229,0.08); transform: translateY(-1px); }
    .jam-layout { display:flex; gap:20px; width:100%; }
    .jam-left { flex: 2.5; display:flex; flex-direction:column; gap:18px; }
    .jam-right { flex: 1; display:flex; flex-direction:column; gap:18px; min-width:300px; }

    /* cards read --card-bg so theme change applies */
    .card { background: var(--card-bg); border-radius:14px; padding:18px; box-shadow: 0 8px 24px rgba(2,6,23,0.35); backdrop-filter: blur(6px); border: 1px solid rgba(255,255,255,0.04); color: var(--text-color); }
    .stats-grid { display:grid; grid-template-columns: repeat(2, 1fr); gap:14px; }
    .stat { display:flex; flex-direction:column; gap:6px; }
    .stat .label { color:var(--muted); font-size:13px; }
    .stat .value { font-weight:700; font-size:22px; color: var(--text-color); }
    .stat .small { font-size:12px; color:var(--muted); }

    /* chart area */
    .chart-area { height:320px; display:flex; align-items:center; justify-content:center; }

    /* donut */
    .donut { width:120px; height:120px; display:flex; align-items:center; justify-content:center; margin:auto; position:relative; }
    .donut svg { transform: rotate(-90deg); }
    .donut .center { position:absolute; text-align:center; color:var(--text-color); }
    .center .num { font-weight:700; font-size:18px; }
    .center .lbl { font-size:12px; color:var(--muted); }

    /* microphone */
    .mic-area { display:flex; flex-direction:column; align-items:center; justify-content:flex-start; gap:12px; text-align:center; min-height:700px; }
    
    /* chat styles */
    .chat-container { width:100%; height:400px; overflow-y:auto; border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:16px; background:rgba(255,255,255,0.02); }
    .chat-message { margin-bottom:16px; }
    .chat-message.user { text-align:right; }
    .chat-message.ai { text-align:left; }
    .message-bubble { display:inline-block; max-width:80%; padding:12px 16px; border-radius:18px; font-size:14px; line-height:1.4; }
    .message-bubble.user { background:var(--accent); color:white; }
    .message-bubble.ai { background:rgba(255,255,255,0.08); color:var(--text-color); }
    .chat-buttons { display:flex; gap:8px; justify-content:center; margin-top:12px; flex-wrap:wrap; }
    .chat-btn { padding:8px 16px; border:none; border-radius:20px; background:var(--accent); color:white; cursor:pointer; font-size:13px; transition:all 200ms; }
    .chat-btn:hover { transform:translateY(-1px); box-shadow:0 4px 12px rgba(79,70,229,0.3); }
    .loading-dots { display:inline-block; }
    .loading-dots::after { content:'...'; animation:dots 1.5s infinite; }
    @keyframes dots { 0%, 20% { content:''; } 40% { content:'.'; } 60% { content:'..'; } 80%, 100% { content:'...'; } }
    
    /* popup styles */
    .popup-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:1000; }
    .popup-content { background:var(--card-bg); border-radius:16px; padding:32px; max-width:600px; width:90%; backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.1); }
    
    /* timer styles */
    .timer-container { position:relative; display:inline-block; }
    .timer-circle { width:140px; height:140px; }
    .timer-bg { fill:none; stroke:rgba(255,255,255,0.1); stroke-width:8; }
    .timer-progress { fill:none; stroke:var(--accent); stroke-width:8; stroke-linecap:round; transform:rotate(-90deg); transform-origin:50% 50%; transition:stroke-dashoffset 1s linear; }
    .timer-text { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-size:24px; font-weight:700; color:var(--text-color); }
    
    .start-btn { padding:16px 32px; font-size:18px; font-weight:700; border:none; border-radius:12px; background:linear-gradient(135deg,#10b981,#059669); color:white; cursor:pointer; transition:all 200ms; }
    .start-btn:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(16,185,129,0.3); }
    .end-btn { padding:12px 24px; font-size:16px; font-weight:600; border:none; border-radius:8px; background:#ef4444; color:white; cursor:pointer; transition:all 200ms; }
    .end-btn:hover { background:#dc2626; }
    .mic-btn { width:120px; height:120px; border-radius:999px; display:flex; align-items:center; justify-content:center; background: linear-gradient(135deg, var(--accent) 0%, #764ba2 100%); border:none; color:white; font-size:36px; cursor:pointer; box-shadow: 0 15px 35px rgba(0,0,0,0.25); transition: all 300ms ease; position:relative; }
    .mic-btn:hover { transform: translateY(-2px); box-shadow: 0 20px 40px rgba(0,0,0,0.32); }
    .mic-btn.recording { animation: pulse 1.25s infinite; transform: scale(1.04); }
    @keyframes pulse { 0% { box-shadow: 0 8px 22px rgba(79,70,229,0.12); } 50% { box-shadow: 0 18px 40px rgba(79,70,229,0.22); } 100% { box-shadow: 0 8px 22px rgba(79,70,229,0.12); } }
    .waveform { height:34px; width:100%; max-width:240px; display:flex; gap:4px; align-items:end; justify-content:center; }
    .waveform span { display:block; width:6px; background:linear-gradient(180deg,#fff,#cde9ff); border-radius:3px; opacity:0.9; animation: wave 800ms infinite ease; }
    .waveform span:nth-child(2) { animation-delay:120ms; }
    .waveform span:nth-child(3) { animation-delay:280ms; }
    .waveform span:nth-child(4) { animation-delay:430ms; }
    @keyframes wave { 0% { height:6px; } 50% { height:26px; } 100% { height:6px; } }

    /* utterances */
    .utter-list { width:100%; display:flex; flex-direction:column; gap:8px; margin-top:6px; }
    .utter-item { display:flex; justify-content:space-between; gap:10px; padding:8px 10px; border-radius:8px; background: rgba(255,255,255,0.02); font-size:13px; align-items:center; }

    /* theme controls */
    .theme-row { display:flex; gap:8px; align-items:center; justify-content:center; flex-wrap:wrap; }
    .small-btn { padding:8px 10px; border-radius:8px; border:none; cursor:pointer; background: rgba(255,255,255,0.03); color:var(--muted); }
    .small-btn.selected { background: linear-gradient(90deg, rgba(79,70,229,0.14), rgba(34,211,238,0.04)); color: var(--text-color); box-shadow: 0 8px 20px rgba(79,70,229,0.06); }

    /* small select controls */
    .jam-topnav select, .jam-topnav label { color: var(--muted); font-size:13px; }
    .jam-topnav select { background: rgba(255,255,255,0.03); border: none; padding:6px 8px; border-radius:8px; color: inherit; }

    .footer-note { color:var(--muted); font-size:12px; text-align:center; margin-top:6px; }

    /* responsive */
    @media (max-width: 940px) {
    .jam-container { flex-direction:column; padding:16px; margin:16px; }
    .jam-layout { flex-direction:column; }
    .stats-grid { grid-template-columns: repeat(2,1fr); }
    }

    /* reduced motion */
    @media (prefers-reduced-motion: reduce) {
    .mic-btn.recording { animation: none; transform:none; }
    .waveform span { animation: none; height:14px; }
    }
    `;

/* ---------- Component ---------- */
export default function JAM1({
    initialData = null,
    onUtterance = () => { },
    onThemeChange = () => { },
}) {
    const location = useLocation();
    const { remainingTests: initialRemainingTests = 0, testKey = 'jam_test' } = location.state || {};
    const [remainingTests, setRemainingTests] = useState(initialRemainingTests);
    // default placeholder data if none provided
    const placeholder = {
        jamPoints: 1280,
        averageScore: 72.4,
        totalTests: 18,
        wordsSpoken: 56300,
        trends: Array.from({ length: 12 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (11 - i));
            return {
                date: date.toISOString().slice(0, 10),
                score: Math.round(60 + Math.random() * 30),
                words: Math.round(1000 + Math.random() * 2000),
            };
        }),
        recentUtterances: [
            { id: 's1', text: 'Hello there', score: 72, datetime: new Date().toISOString() },
        ],
    };

    // const data = useMemo(() => ({ ...placeholder, ...(initialData || {}) }), [initialData]);

    // UI state
    const [activeTab, setActiveTab] = useState('JAM Dashboard');
    const [theme, setTheme] = useState('light'); // 'dark' | 'light' | 'custom'
    const [bgIndex, setBgIndex] = useState(0);
    const [recording, setRecording] = useState(false);
    const [recordingDisabled, setRecordingDisabled] = useState(false);
    const [recordingUsed, setRecordingUsed] = useState(false);
    const [interim, setInterim] = useState('');
    const [utterances, setUtterances] = useState([]);
    const [displayCounts, setDisplayCounts] = useState({
        jamPoints: 0,
        totalTests: 0,
        wordsSpoken: 0,
    });
    const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
    const [bgDropdownOpen, setBgDropdownOpen] = useState(false);

    // references for speech recognition and chat
    const recognitionRef = useRef(null);
    const mountedRef = useRef(true);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const streamRef = useRef(null);

    // Chat state
    const [chatMessages, setChatMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(`jam-test-${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`);
    const [userEmail] = useState(localStorage.getItem('email'));
    const [jamData, setJamData] = useState(null);
    const [data, setData] = useState(placeholder);

    // Initialize utterances after data is set
    useEffect(() => {
        setUtterances(data.recentUtterances || []);
    }, [data.recentUtterances]);

    // Test state
    const [showTestPopup, setShowTestPopup] = useState(false);
    const [testActive, setTestActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
    const [micTimeLeft, setMicTimeLeft] = useState(50); // 50 seconds for recording
    const chatContainerRef = useRef(null);
    const [currentRecording, setCurrentRecording] = useState('');
    const timerRef = useRef(null);
    const micTimerRef = useRef(null);
    const testTimerRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    useEffect(() => {
        // inject styles into head once
        const id = 'jam-styles';
        if (!document.getElementById(id)) {
            const s = document.createElement('style');
            s.id = id;
            s.innerHTML = styles;
            document.head.appendChild(s);
        }
        
        // Fetch current test counts
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
                    setRemainingTests(parsedData.tests?.jam_test || 0);
                } catch (error) {
                    console.error('Error fetching test counts:', error);
                }
            }
        };
        
        fetchTestCounts();
        return () => { mountedRef.current = false; };
    }, []);

    // Background options for custom themes
    // const back
    // groundOptions = [
    //     { id: 0, label: 'Aurora', css: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    //     { id: 1, label: 'Sunset', css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    //     { id: 2, label: 'Ocean', css: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    //     { id: 3, label: 'Forest', css: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    //     { id: 4, label: 'Purple', css: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    // ];

    // animate counts when data changes
    useEffect(() => {
        const start = performance.now();
        const duration = 900;
        const initial = { ...displayCounts };
        const target = { jamPoints: data.jamPoints, totalTests: data.totalTests, wordsSpoken: data.wordsSpoken };

        let raf = null;
        const step = (t) => {
            const p = clamp((t - start) / duration, 0, 1);
            if (!mountedRef.current) return;
            setDisplayCounts({
                jamPoints: Math.round(initial.jamPoints + (target.jamPoints - initial.jamPoints) * p),
                totalTests: Math.round(initial.totalTests + (target.totalTests - initial.totalTests) * p),
                wordsSpoken: Math.round(initial.wordsSpoken + (target.wordsSpoken - initial.wordsSpoken) * p),
            });
            if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => raf && cancelAnimationFrame(raf);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.jamPoints, data.totalTests, data.wordsSpoken]);

    // Theme handling & backgrounds
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'light') {
            root.style.setProperty('--bg', 'linear-gradient(180deg,#f8fafc 0%,#eef2ff 100%)');
            root.style.setProperty('--card-bg', 'rgba(19,21,27,0.04)');
            root.style.setProperty('--accent', '#0ea5a4');
            root.style.setProperty('--muted', '#374151');
            root.style.setProperty('--text-color', '#0b1220');
            root.style.setProperty('color-scheme', 'light');
        } else if (theme === 'custom') {
            root.style.setProperty('--bg', 'linear-gradient(135deg, #a3f0f0ff, #3f4f4fff)');
            root.style.setProperty('--card-bg', 'rgba(7, 100, 80, 0.04)');
            root.style.setProperty('--accent', '#043e4aff');
            root.style.setProperty('--muted', 'rgba(17, 18, 18, 0.85)');
            root.style.setProperty('--text-color', '#01100eff');
        } else {
            // dark default
            root.style.setProperty('--bg', 'linear-gradient(180deg,#0f172a 0%,#071129 100%)');
            root.style.setProperty('--card-bg', 'rgba(255,255,255,0.04)');
            root.style.setProperty('--accent', '#4f46e5');
            root.style.setProperty('--muted', 'rgba(255,255,255,0.85)');
            root.style.setProperty('--text-color', '#e6eef8');
            root.style.setProperty('color-scheme', 'dark');
        }
        // small toggle so CSS reflow picks up changes reliably
        root.style.setProperty('--theme-update', Date.now().toString());
        // notify parent
        onThemeChange({ theme, bgIndex });
    }, [theme, bgIndex, onThemeChange]);

    /* ---------- Audio Recording ---------- */
    const startAudioRecording = async () => {
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
                await sendAudioToLambda(audioBlob);

                // Stop all tracks
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                    streamRef.current = null;
                }
            };

            mediaRecorder.start();
            setRecording(true);
            setRecordingDisabled(true);

            // Start 50-second mic timer
            setMicTimeLeft(50);
            micTimerRef.current = setInterval(() => {
                setMicTimeLeft(prev => {
                    if (prev <= 1) {
                        stopAudioRecording();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } catch (error) {
            console.error('Error starting audio recording:', error);
            alert('Failed to start audio recording. Please check microphone permissions.');
        }
    };

    const stopAudioRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }

        // Stop all audio tracks
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        setRecording(false);
        setMicTimeLeft(50);
        setRecordingUsed(true); // Mark recording as used

        if (micTimerRef.current) {
            clearInterval(micTimerRef.current);
            micTimerRef.current = null;
        }

        // Permanently disable recording after first use
        setRecordingDisabled(true);
    };

    // Helper function to decode HTML entities
    const decodeHtmlEntities = (text) => {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    };

    const sendAudioToLambda = async (audioBlob) => {
        try {
            setIsLoading(true);

            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);

            reader.onloadend = async () => {
                const base64Audio = reader.result.split(',')[1];

                console.log('Audio blob size:', audioBlob.size);
                console.log('Base64 audio length:', base64Audio.length);
                console.log('Session ID:', sessionId);

                // Try different request formats to match API expectations
                const requestBody = {
                    body: JSON.stringify({
                        data: base64Audio,
                        sessionId: sessionId
                    })
                };

                console.log('Sending recording request with format:', {
                    hasBody: !!requestBody.body,
                    bodyKeys: Object.keys(JSON.parse(requestBody.body))
                });

                // Send to Lambda1 (recording API)
                const response1 = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_recordingapi', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                console.log('Recording response status:', response1.status);
                const data1 = await response1.json();
                console.log('Recording response:', data1);

                // Poll Lambda2 (transcribe API) for transcript
                let attempts = 0;
                const maxAttempts = 12; // Allow up to 15 seconds (9s estimated + buffer)
                let pollInterval = 2000; // Start with 2 seconds

                const pollTranscript = async () => {
                    try {
                        const response2 = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_transcribeapi', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ body: { sessionId: sessionId } })
                        });

                        const data2 = await response2.json();
                        console.log('Transcription poll response:', data2);

                        console.log('Raw transcription response:', data2);

                        // Parse the response - it has a nested JSON structure
                        let responseData;
                        if (data2.body && typeof data2.body === 'string') {
                            try {
                                responseData = JSON.parse(data2.body);
                            } catch (e) {
                                console.error('Failed to parse response body:', e);
                                responseData = data2;
                            }
                        } else {
                            responseData = data2.body || data2;
                        }

                        console.log('Parsed response data:', responseData);

                        // Check if transcription is completed and has transcript
                        if (responseData.status === 'completed' && responseData.transcript) {
                            const transcript = responseData.transcript.trim();
                            if (transcript) {
                                console.log('Found transcript:', transcript);
                                await sendMessageToJAM(transcript);
                                return;
                            }
                        }

                        // Handle 404 error (transcript not ready yet) or processing status
                        if (responseData.error === 'Transcript JSON not found' || responseData.status === 'processing' || data2.statusCode === 404) {
                            if (attempts < maxAttempts) {
                                attempts++;
                                console.log(`Polling attempt ${attempts}/${maxAttempts} - Transcript not ready yet`);
                                // Increase wait time gradually
                                if (attempts > 5) pollInterval = 3000;
                                if (attempts > 10) pollInterval = 4000;
                                setTimeout(pollTranscript, pollInterval);
                                return;
                            }
                        }

                        // Check for other error statuses
                        if (responseData.status === 'error' || responseData.status === 'failed') {
                            console.error('Transcription error:', responseData);
                            setChatMessages(prev => [...prev,
                                { type: 'ai', content: 'Audio transcription failed. Please try again.', timestamp: Date.now() }
                            ]);
                            setIsLoading(false);
                            return;
                        }

                        // Timeout after max attempts
                        console.log('Transcription timeout - max attempts reached');
                        setChatMessages(prev => [...prev,
                            { type: 'ai', content: 'Audio processing is taking longer than expected. Please try speaking again or type your response.', timestamp: Date.now() }
                        ]);
                        setIsLoading(false);
                    } catch (pollError) {
                        console.error('Polling error:', pollError);
                        if (attempts < maxAttempts) {
                            attempts++;
                            setTimeout(pollTranscript, pollInterval);
                        } else {
                            setChatMessages(prev => [...prev,
                                { type: 'ai', content: 'Error processing audio. Please try again.', timestamp: Date.now() }
                            ]);
                            setIsLoading(false);
                        }
                    }
                };

                // Start polling after 3 seconds (test shows 9s total, so start earlier)
                setTimeout(pollTranscript, 3000);
            };

        } catch (error) {
            console.error('Error:', error);
            setChatMessages(prev => [...prev,
                { type: 'ai', content: `Error: ${error.message}`, timestamp: Date.now() }
            ]);
            setIsLoading(false);
        }
    };

    /* ---------- Speech recognition ---------- */
    const startRecognition = () => {
        const win = window;
        const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech Recognition is not supported in this browser. You can type your response instead.');
            return;
        }
        try {
            const rec = new SpeechRecognition();
            rec.continuous = false;
            rec.interimResults = true;
            rec.lang = 'en-IN';
            rec.onstart = () => {
                setRecording(true);
                setInterim('');
            };
            rec.onerror = (e) => {
                console.warn('speech error', e);
                setRecording(false);
                setInterim('');
            };
            rec.onresult = (ev) => {
                let interimText = '';
                let finalText = '';
                for (let i = ev.resultIndex; i < ev.results.length; ++i) {
                    const r = ev.results[i];
                    if (r.isFinal) finalText += r[0].transcript;
                    else interimText += r[0].transcript;
                }
                setInterim(interimText);
                if (finalText) {
                    setCurrentRecording(prev => prev + ' ' + finalText);
                }
            };
            rec.onend = () => {
                setRecording(false);
                setInterim('');
            };
            rec.start();
            recognitionRef.current = rec;

            // Start 60-second mic timer
            setMicTimeLeft(60);
            micTimerRef.current = setInterval(() => {
                setMicTimeLeft(prev => {
                    if (prev <= 1) {
                        stopRecognition();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (err) {
            console.warn('speech init failed', err);
            alert('Failed to initialize speech recognition.');
        }
    };

    const stopRecognition = () => {
        const rec = recognitionRef.current;
        if (rec) {
            try { rec.stop(); } catch (e) { }
            recognitionRef.current = null;
        }
        setRecording(false);
        setInterim('');

        // Clear mic timer and send recording
        if (micTimerRef.current) {
            clearInterval(micTimerRef.current);
            micTimerRef.current = null;
        }

        // Send current recording if exists
        if (currentRecording.trim()) {
            sendMessageToJAM(currentRecording);
            setCurrentRecording('');
        }
    };

    const decrementTestCount = async () => {
        try {
            const email = localStorage.getItem('email');
            const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/comm-test-decrement', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    college_email: email,
                    test_key: 'jam_test'
                })
            });
            
            const data = await response.json();
            if (data.statusCode === 200) {
                console.log('Test count decremented successfully');
                // Update remaining tests locally
                setRemainingTests(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error decrementing test count:', error);
        }
    };

    const startTest = async () => {
        if (remainingTests <= 0) {
            alert('No tests remaining!');
            return;
        }
        
        await decrementTestCount();
        setShowTestPopup(true);
        setTestActive(true);
        setCurrentRecording('');
        await sendMessageToJAM('hi');
    };

    const endTest = () => {
        // Clear mic timer if recording
        if (micTimerRef.current) {
            clearInterval(micTimerRef.current);
            micTimerRef.current = null;
        }

        // Show alert and refresh page
        alert('Test completed!');
        window.location.reload();
    };

    const TimerCircle = ({ time, maxTime, label }) => {
        const radius = 62;
        const circumference = 2 * Math.PI * radius;
        const progress = ((maxTime - time) / maxTime) * circumference;

        return (
            <div className="timer-container">
                <svg className="timer-circle" viewBox="0 0 140 140">
                    <circle className="timer-bg" cx="70" cy="70" r={radius} />
                    <circle
                        className="timer-progress"
                        cx="70"
                        cy="70"
                        r={radius}
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - progress}
                    />
                </svg>
                <div className="timer-text">{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</div>
                <div style={{ position: 'absolute', bottom: '-30px', left: '50%', transform: 'translateX(-50%)', fontSize: '12px', color: 'var(--muted)' }}>{label}</div>
            </div>
        );
    };


    const pushUtterance = (text) => {
        const newUt = { id: `u${Date.now()}`, text, score: Math.round(50 + Math.random() * 50), datetime: new Date().toISOString() };
        setUtterances((s) => [newUt, ...(s || [])].slice(0, 6));
        try { onUtterance(text); } catch (e) { /* ignore */ }
    };

    // Function to update feedback score
    const updateFeedbackScore = async (aiResponse) => {
        try {
            // Check if this is a final assessment report
            if (aiResponse.includes('ASSESSMENT REPORT') || aiResponse.includes('JAM Score:')) {
                // Extract score from AI response
                const scoreMatch = aiResponse.match(/JAM Score:\s*([\d.]+)\s*\/\s*([\d.]+)/i);
                if (scoreMatch) {
                    const score = parseFloat(scoreMatch[1]);
                    const maxScore = parseFloat(scoreMatch[2]);
                    const normalizedScore = (score / maxScore) * 10; // Normalize to 10
                    
                    const feedbackData = {
                        college_email: userEmail,
                        test_type: 'jam_test',
                        test_id: sessionId,
                        final_score: normalizedScore,
                        ai_feedback: aiResponse
                    };
                    
                    console.log('Updating feedback score:', feedbackData);
                    
                    const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/comm-test-feedback-update', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(feedbackData)
                    });
                    
                    const result = await response.json();
                    console.log('Feedback update result:', result);
                }
            }
        } catch (error) {
            console.error('Error updating feedback score:', error);
        }
    };

    // Chat API integration
    const sendMessageToJAM = async (message) => {
        setIsLoading(true);
        console.log('Sending message:', message, 'SessionId:', sessionId, 'Email:', userEmail);

        try {
            const requestBody = {
                body: {
                    message: message,
                    sessionId: sessionId,
                    email: userEmail
                }
            };

            console.log('Request body:', requestBody);

            const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/jamagent-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response data:', data);

            let aiResponse = JSON.parse(data.body).response;
            console.log('AI Response:', aiResponse);

            // Decode HTML entities
            aiResponse = decodeHtmlEntities(aiResponse);

            // Check if this is a final feedback and update score
            await updateFeedbackScore(aiResponse);

            // Add user message
            setChatMessages(prev => [...prev, { type: 'user', content: message, timestamp: Date.now() }]);

            // Add AI response
            setChatMessages(prev => [...prev, { type: 'ai', content: aiResponse, timestamp: Date.now() }]);

        } catch (error) {
            console.error('Error sending message:', error);
            setChatMessages(prev => [...prev,
            { type: 'user', content: message, timestamp: Date.now() },
            { type: 'ai', content: `Sorry, I encountered an error: ${error.message}. Please try again.`, timestamp: Date.now() }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const [buttonClicked, setButtonClicked] = useState(new Set());

    const handleButtonClick = (buttonText, messageIndex) => {
        setButtonClicked(prev => new Set([...prev, messageIndex]));
        sendMessageToJAM(buttonText);
    };

    /* ---------- Enhanced Message Formatting ---------- */
    const formatAIMessage = (content) => {
        return content
            // Main headings - larger, accent color with icons
            .replace(/(WELCOME TO THE JAM SESSION ASSESSMENT|ASSESSMENT REPORT|JAM SESSION ASSESSMENT|FINAL JAM ASSESSMENT)/g, 
                '<div style="color: var(--accent); font-size: 18px; font-weight: 700; margin: 16px 0 12px 0; text-align: center; border-bottom: 2px solid var(--accent); padding-bottom: 8px;">🎯 $1</div>')
            
            // Section headers - structured boxes
            .replace(/(PERFORMANCE SUMMARY|DETAILED EVALUATION|PROFESSIONAL DEVELOPMENT AREAS|PLACEMENT READINESS|TOPIC):/g, 
                '<div style="color: var(--text-color); font-size: 15px; font-weight: 600; margin: 16px 0 8px 0; padding: 8px 12px; background: rgba(79,70,229,0.1); border-radius: 8px; border-left: 4px solid var(--accent);">📊 $1:</div>')
            
            // JAM Scores - highlighted with gradient
            .replace(/(JAM Score: [\d.]+\s*\/\s*[\d.]+|\d+\.\d+\s*\/\s*\d+\.\d+)/g, 
                '<span style="background: linear-gradient(135deg, var(--accent), #764ba2); color: white; padding: 6px 12px; border-radius: 8px; font-weight: 700; margin: 0 4px; box-shadow: 0 3px 6px rgba(0,0,0,0.2); font-size: 16px;">🏆 $1</span>')
            
            // Quality ratings - color-coded badges
            .replace(/(Good|Excellent|Outstanding)/g, 
                '<span style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">✨ $1</span>')
            .replace(/(Average|Fair)/g, 
                '<span style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">👍 $1</span>')
            .replace(/(Needs Improvement|Poor)/g, 
                '<span style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">⚠️ $1</span>')
            
            // Topic selection - highlighted boxes
            .replace(/(\d+\. [^\n]+)/g, 
                '<div style="background: rgba(79,70,229,0.08); padding: 10px 16px; border-radius: 8px; margin: 6px 0; border-left: 4px solid var(--accent); font-weight: 500;">📝 $1</div>')
            
            // Evaluation criteria with dashes
            .replace(/^-\s+(.+)$/gm, 
                '<div style="margin: 8px 0; padding: 8px 12px; background: rgba(255,255,255,0.02); border-left: 3px solid var(--accent); border-radius: 0 6px 6px 0;">• $1</div>')
            
            // Instructions with 'Type' - button-like appearance
            .replace(/(Type '[^']+' [^.\n]+|Type "[^"]+" [^.\n]+)/g, 
                '<div style="background: linear-gradient(135deg, rgba(79,70,229,0.1), rgba(34,211,238,0.05)); padding: 12px 16px; border-radius: 8px; margin: 10px 0; border: 1px solid rgba(79,70,229,0.2); text-align: center; font-weight: 500;">💬 $1</div>')
            
            // Assessment categories
            .replace(/(Grammar & Language|Vocabulary & Expression|Content Relevance|Fluency & Delivery|Structure & Organization|Time Utilization):/g, 
                '<div style="display: flex; justify-content: space-between; padding: 6px 12px; margin: 4px 0; background: rgba(79,70,229,0.05); border-radius: 6px; border-left: 3px solid var(--accent); font-weight: 500;"><span>$1:</span></div>')
            
            // Professional readiness status
            .replace(/(PLACEMENT READINESS: .+)/g, 
                '<div style="background: linear-gradient(135deg, rgba(79,70,229,0.1), rgba(34,211,238,0.05)); padding: 12px; border-radius: 8px; margin: 16px 0; border: 2px solid rgba(79,70,229,0.2); text-align: center; font-weight: 600; font-size: 15px;">🎯 $1</div>');
    };

    const extractButtons = (text) => {
        const buttons = [];

        // Check for yes/no buttons
        if ((text.includes("'yes'") || text.includes('"yes"')) && (text.includes("'no'") || text.includes('"no"'))) {
            buttons.push('YES', 'NO');
        }

        // Check for topic selection (1 or 2)
        if (text.includes("'1'") && text.includes("'2'")) {
            buttons.push('1', '2');
        }

        return { cleanText: text, buttons };
    };


    const fetchJamData = async () => {
        try {
            const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_retrivalapi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    college_email: userEmail,
                    test_type: 'JAM'
                })
            });
            const data = await response.json();
            const parsedData = JSON.parse(data.body);
            setJamData(parsedData);

            // Calculate stats
            const sessions = parsedData.sessions || [];
            const totalSessions = sessions.length;
            let totalWords = 0;
            let totalScore = 0;
            let scoreCount = 0;

            const chartData = [];

            sessions.forEach(session => {
                let sessionScore = 0;
                let sessionWords = 0;

                session.conversationHistory?.forEach(conv => {
                    if (conv.agent) {
                        const scoreMatch = conv.agent.match(/JAM Score: ([\d.]+)/i);
                        const wordMatch = conv.agent.match(/WORD COUNT: (\d+) words/i);

                        if (scoreMatch) {
                            sessionScore = parseFloat(scoreMatch[1]);
                            totalScore += sessionScore;
                            scoreCount++;
                        }

                        if (wordMatch) {
                            sessionWords = parseInt(wordMatch[1]);
                            totalWords += sessionWords;
                        }
                    }
                });

                if (sessionScore > 0 && sessionWords > 0) {
                    chartData.push({
                        session: session.sessionId.replace('jam-test-', ''),
                        score: sessionScore,
                        words: sessionWords,
                        date: session.timestamp
                    });
                }
            });

            const avgScore = scoreCount > 0 ? totalScore / scoreCount : 0;

            setDisplayCounts({
                jamPoints: Math.round(avgScore * 100),
                totalTests: totalSessions,
                wordsSpoken: totalWords
            });

            // Update chart data
            const updatedData = { ...data, trends: chartData.slice(-12) };
            setData(updatedData);

        } catch (error) {
            console.error('Error fetching JAM data:', error);
        }
    };

    // Fetch data on mount
    useEffect(() => {
        fetchJamData();
    }, []);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    /* ---------- UI helpers ---------- */
    const toggleMic = () => {
        if (recording) {
            // Always allow stopping recording
            stopAudioRecording();
        } else if (!recordingUsed && !recordingDisabled) {
            // Only allow starting if not used before and not disabled
            startAudioRecording();
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        const t = e.target.elements['manual'].value.trim();
        if (t && !isLoading) {
            sendMessageToJAM(t);
            e.target.reset();
        }
    };

    const handleSpeechResult = (text) => {
        if (text && !isLoading) {
            sendMessageToJAM(text);
        }
    };

    /* ---------- Chart rendering ---------- */
    const ChartArea = () => {
        const getThemeColors = () => {
            if (theme === 'light') {
                return {
                    gridStroke: 'rgba(156,163,175,0.2)',
                    axisColor: '#6b7280',
                    tooltipBg: 'rgba(255,255,255,0.95)',
                    tooltipText: '#1f2937',
                    legendColor: '#374151',
                    lineScore: '#0ea5a4',
                    lineWords: '#10b981',
                    areaFill: '#0ea5a4'
                };
            } else if (theme === 'custom') {
                return {
                    gridStroke: 'rgba(4,62,74,0.3)',
                    axisColor: '#043e4a',
                    tooltipBg: 'rgba(4,62,74,0.95)',
                    tooltipText: '#ffffff',
                    legendColor: '#043e4a',
                    lineScore: '#ffffff',
                    lineWords: '#043e4a',
                    areaFill: '#043e4a'
                };
            } else {
                return {
                    gridStroke: 'rgba(255,255,255,0.03)',
                    axisColor: 'rgba(255,255,255,0.7)',
                    tooltipBg: 'rgba(11,18,32,0.9)',
                    tooltipText: '#fff',
                    legendColor: 'rgba(255,255,255,0.8)',
                    lineScore: '#60a5fa',
                    lineWords: '#06b6d4',
                    areaFill: '#60a5fa'
                };
            }
        };

        const colors = getThemeColors();

        if (Recharts) {
            const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Area, CartesianGrid, Legend } = Recharts;
            return (
                <div style={{ width: '100%', height: '100%' }}>
                    <ResponsiveContainer>
                        <LineChart data={data.trends}>
                            <defs>
                                <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="5%" stopColor={colors.areaFill} stopOpacity={0.6} />
                                    <stop offset="95%" stopColor={colors.areaFill} stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke={colors.gridStroke} />
                            <XAxis dataKey="date" tick={{ fill: colors.axisColor, fontSize: 12 }} />
                            <YAxis yAxisId="left" orientation="left" tick={{ fill: colors.axisColor, fontSize: 12 }} />
                            <YAxis yAxisId="right" orientation="right" tick={false} />
                            <Tooltip
                                wrapperStyle={{ background: colors.tooltipBg, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                                contentStyle={{ color: colors.tooltipText, border: 'none', borderRadius: '8px' }}
                            />
                            <Legend wrapperStyle={{ color: colors.legendColor }} />
                            <Area yAxisId="left" type="monotone" dataKey="words" stroke={colors.lineWords} fill="url(#g1)" strokeWidth={2} />
                            <Line yAxisId="left" type="monotone" dataKey="score" stroke={colors.lineScore} strokeWidth={3} dot={{ r: 3, fill: colors.lineScore }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            );
        }
        // fallback svg
        const pointsScore = data.trends.map((d, i) => `${(i / (data.trends.length - 1)) * 100},${100 - (d.score / 100) * 80}`).join(' ');
        const pointsWords = data.trends.map((d, i) => `${(i / (data.trends.length - 1)) * 100},${100 - (Math.min(d.words, 3000) / 3000) * 80}`).join(' ');
        return (
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                <polyline points={pointsWords} fill="none" stroke={colors.lineWords} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points={pointsScore} fill="none" stroke={colors.lineScore} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    };

    /* Donut (unchanged) */
    const Donut = ({ percent = 0 }) => {
        const radius = 48;
        const stroke = 10;
        const normalizedRadius = radius - stroke / 2;
        const circumference = normalizedRadius * 2 * Math.PI;
        const strokeDashoffset = circumference - (percent / 100) * circumference;
        return (
            <div className="donut" role="img" aria-label={`Average score ${percent}%`}>
                <svg height={radius * 2} width={radius * 2}>
                    <circle stroke="rgba(255,255,255,0.08)" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
                    <circle stroke="url(#grad1)" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} style={{ strokeDashoffset, transition: 'stroke-dashoffset 700ms ease' }} r={normalizedRadius} cx={radius} cy={radius} strokeLinecap="round" />
                    <defs>
                        <linearGradient id="grad1" x1="0" x2="1">
                            <stop offset="0%" stopColor="#60a5fa" />
                            <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="center">
                    <div className="num">{Math.round(percent)}%</div>
                    <div className="lbl">Avg</div>
                </div>
            </div>
        );
    };

    return (
        <div className="jam-root" role="application" aria-label="JAM Dashboard">
            <div className="jam-topnav" role="navigation" aria-label="Top navigation">
                <div className="left">
                    <div className="jam-title" aria-hidden>
                        JAM Test
                    </div>
                    <div className="jam-nav" role="tablist" aria-label="Main tabs">
                        {['Back', 'Practice', 'JAM Dashboard', 'JAM Leaderboard'].map((t) => (
                            <button
                                key={t}
                                role="tab"
                                aria-selected={activeTab === t}
                                className={activeTab === t ? 'active' : ''}
                                onClick={() => {
                                    if (t === 'Back') window.history.back();
                                    else setActiveTab(t);
                                }}
                                title={t}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ color: 'var(--muted)', fontSize: 13, marginRight: 6 }}>Theme</div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <select value={theme} onChange={(e) => setTheme(e.target.value)} aria-label="Select theme">
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>
                    </div>
                </div>

                        <div className="jam-container">
                            <div className="jam-layout" style={{ width: '100%' }}>
                                <div className="jam-left">
                                    {!showTestPopup && (
                                        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
                                            <div style={{ fontWeight: 700, fontSize: 32, marginBottom: 20, color: 'linear-gradient(135deg, #3b9797, #5bb5b5)' }}>JAM Practice Test</div>
                                            <div style={{ fontSize: 18, color: 'var(--muted)', marginBottom: 20 }}>Test your Just A Minute speaking skills</div>
                                            <div style={{ fontSize: 16, color: 'var(--accent)', marginBottom: 40, fontWeight: 600 }}>
                                                Remaining Tests: {remainingTests}
                                            </div>

                                            <button className="start-btn" onClick={startTest} disabled={remainingTests <= 0}>
                                                {remainingTests <= 0 ? 'No Tests Remaining' : 'Start JAM Test'}
                                            </button>

                                            {/* {jamData && (
                                                <>
                                                    <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 600, margin: '40px auto 0' }}>
                                                        <div className="stat card" style={{ padding: 20 }}>
                                                            <div className="label">Average Score</div>
                                                            <div className="value">{(displayCounts.jamPoints / 100).toFixed(1)}/10</div>
                                                        </div>
                                                        <div className="stat card" style={{ padding: 20 }}>
                                                            <div className="label">Tests Taken</div>
                                                            <div className="value">{displayCounts.totalTests}</div>
                                                        </div>
                                                        <div className="stat card" style={{ padding: 20 }}>
                                                            <div className="label">Words Spoken</div>
                                                            <div className="value">{formatNumber(displayCounts.wordsSpoken)}</div>
                                                        </div>
                                                    </div>
                                                </>
                                            )} */}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {activeTab === 'JAM Leaderboard' && (
                            <div style={{ width: '100%', textAlign: 'center', padding: 40 }}>
                                {/* <h2 style={{ color: 'var(--text-color)', marginBottom: 20 }}>JAM Leaderboard</h2> */}
                                {/* <p style={{ color: 'var(--muted)' }}>Coming soon - compete with other students!</p> */}
                            </div>
                        )}

                        {showTestPopup && (
                            <div className="popup-overlay">
                                <div className="popup-content" style={{
                                    maxWidth: '1400px',
                                    width: '95%',
                                    background: theme === 'light' ? 'linear-gradient(135deg, #ffffff, #f0f9ff)' :
                                        theme === 'custom' ? 'linear-gradient(135deg, rgba(59,151,151,0.95), rgba(91,181,181,0.95))' :
                                            'var(--card-bg)',
                                    color: theme === 'light' ? '#1f2937' : theme === 'custom' ? '#ffffff' : 'var(--text-color)'
                                }}>
                                    <div style={{ display: 'flex', gap: 30 }}>
                                        <div style={{ flex: 1 }}>
                                            <h2 style={{
                                                color: theme === 'light' ? '#0ea5a4' : theme === 'custom' ? '#ffffff' : 'var(--accent)',
                                                marginBottom: 16,
                                                textShadow: theme === 'custom' ? '0 2px 4px rgba(0,0,0,0.3)' : 'none'
                                            }}>
                                                {theme === 'light' ? '🎯 JAM Speaking Challenge' :
                                                    theme === 'custom' ? '✨ JAM Excellence Mode' :
                                                        '🚀 JAM Test in Progress'}
                                            </h2>
                                            <p style={{
                                                fontSize: 14,
                                                marginBottom: 20,
                                                color: theme === 'light' ? '#6b7280' : theme === 'custom' ? 'rgba(255,255,255,0.9)' : 'var(--muted)',
                                                fontStyle: theme === 'custom' ? 'italic' : 'normal'
                                            }}>
                                                {theme === 'light' ? 'Showcase your communication skills in this focused speaking session.' :
                                                    theme === 'custom' ? 'Elevate your speaking prowess in this premium JAM experience.' :
                                                        'Express your thoughts clearly and confidently.'}
                                            </p>

                                            <div className="chat-container" ref={chatContainerRef} style={{
                                                height: '500px',
                                                marginBottom: 20,
                                                background: theme === 'light' ? 'rgba(243,244,246,0.5)' :
                                                    theme === 'custom' ? 'rgba(255,255,255,0.1)' :
                                                        'rgba(255,255,255,0.02)',
                                                border: theme === 'light' ? '1px solid rgba(156,163,175,0.3)' :
                                                    theme === 'custom' ? '1px solid rgba(255,255,255,0.2)' :
                                                        '1px solid rgba(255,255,255,0.1)'
                                            }}>
                                                {chatMessages.map((msg, index) => {
                                        const { cleanText, buttons } = extractButtons(msg.content);
                                        return (
                                            <div key={index} className={`chat-message ${msg.type}`}>
                                                <div className={`message-bubble ${msg.type}`}>
                                                    {msg.type === 'ai' ? (
                                                        <div 
                                                            dangerouslySetInnerHTML={{ 
                                                                __html: formatAIMessage(cleanText) 
                                                            }}
                                                            style={{
                                                                lineHeight: '1.6',
                                                                fontSize: '14px'
                                                            }}
                                                        />
                                                    ) : (
                                                        <div style={{ whiteSpace: 'pre-wrap' }}>{cleanText}</div>
                                                    )}
                                                </div>
                                                {msg.type === 'ai' && buttons.length > 0 && !buttonClicked.has(index) && (
                                                    <div style={{ marginTop: '6px' }}>
                                                        {buttons.map((button, btnIndex) => (
                                                            <button
                                                                key={btnIndex}
                                                                onClick={() => handleButtonClick(button.toLowerCase(), index)}
                                                                disabled={isLoading}
                                                                style={{
                                                                    padding: '2px 6px',
                                                                    fontSize: '20px',
                                                                    fontWeight: '500',
                                                                    borderRadius: '8px',
                                                                    border: '1px solid var(--accent)',
                                                                    background: 'transparent',
                                                                    color: 'var(--accent)',
                                                                    cursor: 'pointer',
                                                                    marginRight: '4px',
                                                                    transition: 'all 150ms'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.target.style.background = 'var(--accent)';
                                                                    e.target.style.color = 'white';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.target.style.background = 'transparent';
                                                                    e.target.style.color = 'var(--accent)';
                                                                }}
                                                            >
                                                                {button}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    {isLoading && (
                                        <div className="chat-message ai">
                                            <div className="message-bubble ai">
                                                <span className="loading-dots">Thinking</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                
                            </div>

                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginBottom: 30 }}>
                                    {/* <TimerCircle time={timeLeft} maxTime={120} label="Test Time" /> */}
                                    {recording && <TimerCircle time={micTimeLeft} maxTime={50} label="Recording" />}
                                </div>
                                <h1 style={{ color: 'var(--text-color)', marginBottom: 20,fontSize: 28 }}>Click on the Mic to Start Recording</h1>
                                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                                    <button
                                        className={`mic-btn ${recording ? 'recording' : ''}`}
                                        onClick={toggleMic}
                                        disabled={recordingUsed && !recording}
                                        style={{ 
                                            width: '100px', 
                                            height: '100px', 
                                            fontSize: '28px',
                                            opacity: recordingUsed && !recording ? 0.3 : 1,
                                            cursor: recordingUsed && !recording ? 'not-allowed' : 'pointer'
                                        }}
                                        title={recordingUsed && !recording ? 'Recording already used - one chance only' : recording ? 'Stop recording' : 'Start recording'}
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

                                    {recording && (
                                        <div className="waveform">
                                            <span style={{ height: 10 }} />
                                            <span style={{ height: 18 }} />
                                            <span style={{ height: 14 }} />
                                            <span style={{ height: 22 }} />
                                            <span style={{ height: 12 }} />
                                        </div>
                                    )}

                                    {recordingDisabled && !recording && !recordingUsed && (
                                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>
                                            Processing audio...
                                        </div>
                                    )}

                                    {recordingUsed && !recording && (
                                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>
                                            Recording used - One chance only
                                        </div>
                                    )}

                                    <button className="end-btn" onClick={endTest}>
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
}
