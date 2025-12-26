import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "./test.css";

/* ---------- Inline CSS ---------- */
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
    .pronunciation-root {
        min-height:100vh;
        display:flex;
        flex-direction:column;
        background: var(--bg);
        transition: background 400ms ease, color 300ms ease;
        color: var(--text-color);
        font-family: Inter, "Segoe UI", system-ui, Roboto, Arial;
    }

    /* layout */
    .pronunciation-container { width:100%; max-width:1200px; margin:32px auto; display:flex; gap:20px; padding:24px; box-sizing:border-box; }
    .pronunciation-topnav { position:sticky; top:0; z-index:60; display:flex; align-items:center; justify-content:space-between; padding:12px 24px; backdrop-filter: blur(6px); background: linear-gradient(90deg, rgba(0,0,0,0.15), rgba(255,255,255,0.02)); border-bottom:1px solid rgba(255,255,255,0.04); }
    .pronunciation-topnav .left { display:flex; gap:16px; align-items:center; }
    .pronunciation-title { font-weight:700; font-size:18px; letter-spacing:0.2px; display:flex; gap:10px; align-items:center; color: var(--text-color); }
    .pronunciation-nav { display:flex; gap:10px; align-items:center; }
    .pronunciation-nav button { background:transparent; border:none; color:var(--muted); padding:8px 12px; border-radius:8px; cursor:pointer; font-weight:600; transition: all 180ms; }
    .pronunciation-nav button:focus { outline:3px solid var(--focus); }
    .pronunciation-nav button.active { color: var(--text-color); background: linear-gradient(90deg, rgba(79,70,229,0.18), rgba(34,211,238,0.06)); box-shadow: 0 6px 20px rgba(79,70,229,0.08); transform: translateY(-1px); }
    .pronunciation-layout { display:flex; gap:20px; width:100%; }
    .pronunciation-left { flex: 2.5; display:flex; flex-direction:column; gap:18px; }
    .pronunciation-right { flex: 1; display:flex; flex-direction:column; gap:18px; min-width:300px; }

    /* cards read --card-bg so theme change applies */
    .card { background: var(--card-bg); border-radius:14px; padding:18px; box-shadow: 0 8px 24px rgba(2,6,23,0.35); backdrop-filter: blur(6px); border: 1px solid rgba(255,255,255,0.04); color: var(--text-color); }
    .stats-grid { display:grid; grid-template-columns: repeat(2, 1fr); gap:14px; }
    .stat { display:flex; flex-direction:column; gap:6px; }
    .stat .label { color:var(--muted); font-size:13px; }
    .stat .value { font-weight:700; font-size:22px; color: var(--text-color); }
    .stat .small { font-size:12px; color:var(--muted); }

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
    
    .start-btn { padding:16px 32px; font-size:18px; font-weight:700; border:none; border-radius:12px; background:linear-gradient(135deg,#10b981,#059669); color:white; cursor:pointer; transition:all 200ms; }
    .start-btn:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(16,185,129,0.3); }
    .end-btn { padding:12px 24px; font-size:16px; font-weight:600; border:none; border-radius:8px; background:#ef4444; color:white; cursor:pointer; transition:all 200ms; }
    .end-btn:hover { background:#dc2626; }
    .mic-btn { width:120px; height:120px; border-radius:999px; display:flex; align-items:center; justify-content:center; background: linear-gradient(135deg, var(--accent) 0%, #764ba2 100%); border:none; color:white; font-size:36px; cursor:pointer; box-shadow: 0 15px 35px rgba(0,0,0,0.25); transition: all 300ms ease; position:relative; }
    .mic-btn:hover { transform: translateY(-2px); box-shadow: 0 20px 40px rgba(0,0,0,0.32); }
    .mic-btn.recording { animation: pulse 1.25s infinite; transform: scale(1.04); }
    @keyframes pulse { 0% { box-shadow: 0 8px 22px rgba(79,70,229,0.12); } 50% { box-shadow: 0 18px 40px rgba(79,70,229,0.22); } 100% { box-shadow: 0 8px 22px rgba(79,70,229,0.12); } }

    /* microphone */
    .mic-area { display:flex; flex-direction:column; align-items:center; justify-content:flex-start; gap:12px; text-align:center; min-height:700px; }

    /* theme controls */
    .pronunciation-topnav select, .pronunciation-topnav label { color: var(--muted); font-size:13px; }
    .pronunciation-topnav select { background: rgba(255,255,255,0.03); border: none; padding:6px 8px; border-radius:8px; color: inherit; }

    /* responsive */
    @media (max-width: 940px) {
        .pronunciation-container { flex-direction:column; padding:16px; margin:16px; }
        .pronunciation-layout { flex-direction:column; }
        .stats-grid { grid-template-columns: repeat(2,1fr); }
    }

    /* reduced motion */
    @media (prefers-reduced-motion: reduce) {
        .mic-btn.recording { animation: none; transform:none; }
    }

    /* JAM-like header variants to match JAM1 styling */
    .jam-topnav { position: sticky; top: 0; z-index: 60; display:flex; align-items:center; justify-content:space-between; padding:12px 24px; backdrop-filter: blur(6px); background: linear-gradient(90deg, rgba(0,0,0,0.12), rgba(255,255,255,0.02)); border-bottom:1px solid rgba(255,255,255,0.04); }
    .jam-title { font-weight:700; font-size:18px; letter-spacing:0.2px; display:flex; gap:10px; align-items:center; color: var(--text-color); }
    .jam-nav { display:flex; gap:10px; align-items:center; }
    .jam-nav button { background:transparent; border:none; color:var(--muted); padding:8px 12px; border-radius:8px; cursor:pointer; font-weight:600; transition: all 180ms; }
    .jam-nav button.active { color: var(--text-color); background: linear-gradient(90deg, rgba(79,70,229,0.18), rgba(34,211,238,0.06)); box-shadow: 0 6px 20px rgba(79,70,229,0.08); transform: translateY(-1px); }
`;

/* ---------- Helpers ---------- */
const generateSessionId = () => `pronu-test-${Math.floor(1000000 + Math.random() * 9000000)}`;

const decodeHtmlEntities = (text) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
};

export default function Pronunciation1() {
    const location = useLocation();
    const { remainingTests: initialRemainingTests = 0 } = location.state || {};

    /* ---------- State ---------- */
    const [activeTab, setActiveTab] = useState('Pronunciation Dashboard');
    const [remainingTests, setRemainingTests] = useState(initialRemainingTests);
    const [sessionId] = useState(generateSessionId());
    const [userEmail] = useState(localStorage.getItem("email"));
    const [chatMessages, setChatMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [recording, setRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);
    const [showTestPopup, setShowTestPopup] = useState(false);
    const [testActive, setTestActive] = useState(false);
    const [theme, setTheme] = useState('light');
    const [bgIndex, setBgIndex] = useState(0);
    
    const chatRef = useRef(null);
    const recognitionRef = useRef(null);
    const timerRef = useRef(null);

    /* ---------- Inject styles ---------- */
    useEffect(() => {
        const id = 'pronunciation1-styles';
        if (!document.getElementById(id)) {
            const s = document.createElement('style');
            s.id = id;
            s.innerHTML = styles;
            document.head.appendChild(s);
        }
    }, []);

    /* ---------- Auto scroll chat ---------- */
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chatMessages]);

    /* ---------- Fetch remaining tests ---------- */
    useEffect(() => {
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
                    setRemainingTests(parsedData.tests?.pronu_test || 0);
                } catch (error) {
                    console.error('Error fetching test counts:', error);
                }
            }
        };
        fetchTestCounts();
    }, []);

    /* ---------- Theme handling ---------- */
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'light') {
            root.style.setProperty('--bg', 'linear-gradient(180deg,#f8fafc 0%,#eef2ff 100%)');
            root.style.setProperty('--card-bg', 'rgba(19,21,27,0.04)');
            root.style.setProperty('--accent', '#0ea5a4');
            root.style.setProperty('--muted', '#272f3dff');
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
    }, [theme, bgIndex]);

    /* ---------- API Functions ---------- */
    const updateFeedbackScore = async (aiResponse) => {
        try {
            // Check if this is a final assessment report
            if (aiResponse.includes('FINAL SPEAKING ASSESSMENT REPORT') || aiResponse.includes('Final Speaking Score:')) {
                // Extract score from AI response
                const scoreMatch = aiResponse.match(/Final Speaking Score:\s*([\d.]+)\s*\/\s*([\d.]+)/i);
                if (scoreMatch) {
                    const score = parseFloat(scoreMatch[1]);
                    const maxScore = parseFloat(scoreMatch[2]);
                    const normalizedScore = (score / maxScore) * 10; // Normalize to 10
                    
                    const feedbackData = {
                        college_email: userEmail,
                        test_type: 'pronu_test',
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

    const sendMessageToPronunciation = async (message) => {
        setIsLoading(true);
        
        try {
            const requestBody = {
                body: {
                    message: message,
                    sessionId: sessionId,
                    email: userEmail
                }
            };

            const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/prounagent-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            let aiResponse = JSON.parse(data.body).response;
            aiResponse = decodeHtmlEntities(aiResponse);

            // Check if this is a final feedback and update score
            await updateFeedbackScore(aiResponse);

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

    const decrementTestCount = async () => {
        try {
            const email = localStorage.getItem('email');
            const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/comm-test-decrement', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    college_email: email,
                    test_key: 'pronu_test'
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

    /* ---------- Speech Recognition ---------- */
    const startRecognition = () => {
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
                            stopRecognition();
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                sendMessageToPronunciation(transcript);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setRecording(false);
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
            };

            recognition.onend = () => {
                setRecording(false);
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
            };

            recognition.start();
            recognitionRef.current = recognition;

        } catch (error) {
            console.error('Failed to start speech recognition:', error);
            alert('Failed to start speech recognition.');
        }
    };

    const stopRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setRecording(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };

    /* ---------- Test Controls ---------- */
    const startTest = async () => {
        if (remainingTests <= 0) {
            alert('No tests remaining!');
            return;
        }
        
        await decrementTestCount();
        setShowTestPopup(true);
        setTestActive(true);
        await sendMessageToPronunciation('hi');
    };

    const endTest = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        alert('Test completed!');
        window.location.reload();
    };

    /* ---------- Button Extraction ---------- */
    const extractButtons = (text) => {
        const buttons = [];
        
        if (text.includes("'start'") || text.includes('"start"')) buttons.push('START');
        if (text.includes("'next'") || text.includes('"next"')) buttons.push('NEXT');
        if (text.includes("'done'") || text.includes('"done"')) buttons.push('DONE');
        if ((text.includes("'yes'") || text.includes('"yes"')) && (text.includes("'no'") || text.includes('"no"'))) {
            buttons.push('YES', 'NO');
        }
        
        return { cleanText: text, buttons };
    };

    const [buttonClicked, setButtonClicked] = useState(new Set());

    const handleButtonClick = (buttonText, messageIndex) => {
        setButtonClicked(prev => new Set([...prev, messageIndex]));
        sendMessageToPronunciation(buttonText);
    };

    /* ---------- Enhanced Message Formatting ---------- */
    const formatAIMessage = (content) => {

        // sanitize: remove stray quoted CSS blocks or inline style strings that may appear in responses
        let cleanContent = content
            // remove large quoted CSS blocks between backticks
            .replace(/`[^`]*`/gs, '')
            // remove any quoted string that contains a colon or semicolon (likely CSS or style fragment)
            .replace(/"(?=[^\"]*[:;])[^\"]*"/g, '')
            .replace(/'(?=[^']*[:;])[^']*'/g, '')
            // remove explicit color(...) or var(...) fragments quoted or not
            .replace(/var\([^)]*\)/g, '')
            // remove common style attribute fragments like style="..." or style='...'
            .replace(/style=\"[^\"]*\"/g, '')
            .replace(/style='[^']*'/g, '')
            // strip standalone CSS token fragments (color:, font-size:, margin:, padding:, border:, --vars)
            .replace(/(?:\b(?:color|font-size|margin|padding|border|background)\b)\s*:[^;\n]+;?/gi, '')
            .replace(/--[a-z0-9-]+\s*:\s*[^;\n]+;?/gi, '')
            // basic HTML entity decode
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<')
            .replace(/&amp;/g, '&');

        // normalize common run-on report phrases into separate lines so replacements below can style them
        cleanContent = cleanContent
            // break combined report headers that sometimes appear concatenated
            .replace(/PRONUNCIATION ANALYSIS REPORT\s*YOUR SPEECH:/gi, 'PRONUNCIATION ANALYSIS REPORT\nYOUR SPEECH:')
            .replace(/PRONUNCIATION ANALYSIS REPORT/gi, 'PRONUNCIATION ANALYSIS REPORT\n')
            .replace(/YOUR SPEECH:/gi, '\nYOUR SPEECH:')
            .replace(/ACCURACY ANALYSIS:/gi, '\nACCURACY ANALYSIS:\n')
            .replace(/PERFORMANCE METRICS:/gi, '\nPERFORMANCE METRICS:\n')
            .replace(/IMPROVEMENT FOCUS:/gi, '\nIMPROVEMENT FOCUS:\n')
            .replace(/FINAL SPEAKING ASSESSMENT REPORT/gi, '\nFINAL SPEAKING ASSESSMENT REPORT\n')
            .replace(/OVERALL PERFORMANCE SUMMARY:/gi, '\nOVERALL PERFORMANCE SUMMARY:\n')
            .replace(/SENTENCE SCORE:/gi, '\nSENTENCE SCORE:\n')
            // ensure 'Type' instruction sits on its own line
            .replace(/Type\s+'?\w+'?/gi, (m) => `\n${m}\n`);

        return cleanContent
            // Welcome message
            .replace(/(Welcome to the Speaking Assessment Center)/g, 
                '<div style="color: var(--accent); font-size: 18px; font-weight: 700; margin: 16px 0 12px 0; text-align: center; border-bottom: 2px solid var(--accent); padding-bottom: 8px;">🎯 $1</div>')
            
            // Main headings
            .replace(/(PRONUNCIATION ANALYSIS REPORT|SPEAKING ASSESSMENT|FINAL SPEAKING ASSESSMENT REPORT)/g, 
                '<div style="color: var(--accent); font-size: 18px; font-weight: 700; margin: 16px 0 12px 0; text-align: center; border-bottom: 2px solid var(--accent); padding-bottom: 8px;">🎯 $1</div>')
            
            // Section headers
            .replace(/(ACCURACY ANALYSIS|PERFORMANCE METRICS|IMPROVEMENT FOCUS|COMPREHENSIVE SCORES|DETAILED ANALYSIS|STRENGTHS IDENTIFIED|PROFESSIONAL RECOMMENDATIONS|OVERALL PERFORMANCE SUMMARY|YOUR SPEECH):/g, 
                '<div style="color: var(--text-color); font-size: 15px; font-weight: 600; margin: 16px 0 8px 0; padding: 8px 12px; background: rgba(79,70,229,0.1); border-radius: 8px; border-left: 4px solid var(--accent);">📊 $1:</div>')
            
            // Sentence instructions with proper formatting
            .replace(/(SPEAKING ASSESSMENT - SENTENCE \([^)]+\)):/g, 
                '<div style="color: var(--accent); font-size: 16px; font-weight: 600; margin: 16px 0 8px 0; text-align: center;">📝 $1</div>')
            
            // Quoted sentences to read - clean format
            .replace(/"([^"]+)"/g, 
                '<div style="background: rgba(79,70,229,0.08); padding: 12px 16px; border-radius: 8px; margin: 8px 0; border-left: 4px solid var(--accent); font-style: italic; font-weight: 500; text-align: center; font-size: 16px;">"$1"</div>')
            
            // Sentence scores
            .replace(/(SENTENCE SCORE: [\d.]+\s*\/\s*[\d.]+|Final Speaking Score: [\d.]+\s*\/\s*[\d.]+)/g, 
                '<span style="background: linear-gradient(135deg, var(--accent), #764ba2); color: white; padding: 6px 12px; border-radius: 8px; font-weight: 700; margin: 0 4px; box-shadow: 0 3px 6px rgba(0,0,0,0.2); font-size: 16px;">🏆 $1</span>')
            
            // Quality ratings
            .replace(/(Excellent|Clear|Smooth|Professional|Natural)/g, 
                '<span style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; margin: 2px;">✨ $1</span>')
            .replace(/(Good|Average)/g, 
                '<span style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; margin: 2px;">👍 $1</span>')
            
            // Percentage scores
            .replace(/(Word Accuracy: \d+%|Average Word Accuracy: \d+%)/g, 
                '<span style="background: linear-gradient(135deg, #059669, #047857); color: white; padding: 4px 8px; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 2px;">📈 $1</span>')
            
            // Analysis items with dashes
            .replace(/^-\s+(.+)$/gm, 
                '<div style="margin: 6px 0; padding: 6px 12px; background: rgba(255,255,255,0.02); border-left: 3px solid var(--accent); border-radius: 0 6px 6px 0;">• $1</div>')
            
            // Instructions with 'Type'
            .replace(/(Type '[^']+' [^.\n]+|Type "[^"]+" [^.\n]+)/g, 
                '<div style="background: linear-gradient(135deg, rgba(79,70,229,0.1), rgba(34,211,238,0.05)); padding: 12px 16px; border-radius: 8px; margin: 10px 0; border: 1px solid rgba(79,70,229,0.2); text-align: center; font-weight: 500;">💬 $1</div>')
            
            // Numbered recommendations
            .replace(/(\d+\. [^\n]+)/g, 
                '<div style="background: rgba(79,70,229,0.05); padding: 8px 12px; border-radius: 6px; margin: 4px 0; border-left: 3px solid var(--accent); font-weight: 500;">$1</div>')
            
            // Clean up any remaining formatting issues
            .replace(/\n/g, '<br/>');
    };

    // Plain-text formatter (no HTML) - fallback to ensure UI shows no HTML/CSS fragments
    const formatAIMessagePlain = (raw) => {
        if (!raw) return '';
        // reuse initial sanitization from formatAIMessage but produce plain text
        let text = raw
            .replace(/`[^`]*`/gs, '')
            .replace(/"(?=[^\"]*[:;])[^\"]*"/g, '')
            .replace(/'(?=[^']*[:;])[^']*'/g, '')
            .replace(/var\([^)]*\)/g, '')
            .replace(/style=\"[^\"]*\"/g, '')
            .replace(/style='[^']*'/g, '')
            .replace(/(?:\b(?:color|font-size|margin|padding|border|background)\b)\s*:[^;\n]+;?/gi, '')
            .replace(/--[a-z0-9-]+\s*:\s*[^;\n]+;?/gi, '')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<')
            .replace(/&amp;/g, '&');

        // normalize headers and insert line breaks
        text = text
            .replace(/PRONUNCIATION ANALYSIS REPORT\s*YOUR SPEECH:/gi, 'PRONUNCIATION ANALYSIS REPORT\nYOUR SPEECH:')
            .replace(/PRONUNCIATION ANALYSIS REPORT/gi, '\nPRONUNCIATION ANALYSIS REPORT\n')
            .replace(/YOUR SPEECH:/gi, '\nYOUR SPEECH:')
            .replace(/ACCURACY ANALYSIS:/gi, '\nACCURACY ANALYSIS:\n')
            .replace(/PERFORMANCE METRICS:/gi, '\nPERFORMANCE METRICS:\n')
            .replace(/IMPROVEMENT FOCUS:/gi, '\nIMPROVEMENT FOCUS:\n')
            .replace(/FINAL SPEAKING ASSESSMENT REPORT/gi, '\nFINAL SPEAKING ASSESSMENT REPORT\n')
            .replace(/OVERALL PERFORMANCE SUMMARY:/gi, '\nOVERALL PERFORMANCE SUMMARY:\n')
            .replace(/SENTENCE SCORE:/gi, '\nSENTENCE SCORE:\n')
            .replace(/Type\s+'?\w+'?/gi, (m) => `\n${m}\n`);

        // remove any remaining HTML tags just in case
        text = text.replace(/<[^>]*>/g, '');

        // clean multiple blank lines and trim
        text = text.replace(/\n\s*\n+/g, '\n\n').trim();
        return text;
    };

    return (
        <div className="pronunciation-root">
            <div className="pronunciation-topnav">
                <div className="left">
                    <div className="jam-title" aria-hidden>
                        Pronunciation Test
                    </div>
                    <div className="jam-nav" role="tablist" aria-label="Main tabs">
                        {['Back', 'Practice', 'Pronunciation Dashboard', 'Pronunciation Leaderboard'].map((t) => (
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
                        <option value="custom">Custom</option>
                    </select>
                </div>
            </div>

            <div className="pronunciation-container">
                <div className="pronunciation-layout">
                    <div className="pronunciation-left">
                        {!showTestPopup && (
                            <div className="card" style={{ textAlign: 'center', padding: 60 }}>
                                <div style={{ fontWeight: 700, fontSize: 32, marginBottom: 20, color: 'var(--accent)' }}>
                                    Pronunciation Assessment
                                </div>
                                <div style={{ fontSize: 18, color: 'var(--muted)', marginBottom: 20 }}>
                                    Test your pronunciation accuracy with 5 sentences
                                </div>
                                <div style={{ fontSize: 16, color: 'var(--accent)', marginBottom: 40, fontWeight: 600 }}>
                                    Remaining Tests: {remainingTests}
                                </div>
                                <button 
                                    className="start-btn" 
                                    onClick={startTest} 
                                    disabled={remainingTests <= 0}
                                >
                                    {remainingTests <= 0 ? 'No Tests Remaining' : 'Start Pronunciation Test'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showTestPopup && (
                <div className="popup-overlay">
                    <div className="popup-content" style={{ maxWidth: '1300px', width: '80%', height: '90%', background: theme === 'light' ? '#ffffff' : undefined, color: theme === 'light' ? '#0b1220' : undefined }}>
                        <div style={{ display: 'flex', gap: 20 }}>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ color: 'var(--accent)' }}>
                                    Pronunciation Assessment
                                </h2>
                                <p style={{ fontSize: 14, marginBottom: 20, color: 'var(--muted)' }}>
                                    Read each sentence clearly and accurately. Your pronunciation will be analyzed.
                                </p>

                                <div className="chat-container" ref={chatRef} style={{ height: '550px', width: "800px" }}>
                                    {chatMessages.map((msg, index) => {
                                        const { cleanText, buttons } = extractButtons(msg.content);
                                        return (
                                            <div key={index} className={`chat-message ${msg.type}`}>
                                                <div className={`message-bubble ${msg.type}`}>
                                                    {msg.type === 'ai' ? (
                                                        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '14px' }}>
                                                            {formatAIMessagePlain(msg.content)}
                                                        </div>
                                                    ) : (
                                                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                                                    )}
                                                </div>
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
                                    
                                    {/* Buttons at bottom of chat */}
                                    {chatMessages.length > 0 && (() => {
                                        const lastMsg = chatMessages[chatMessages.length - 1];
                                        if (lastMsg.type === 'ai') {
                                            const { buttons } = extractButtons(lastMsg.content);
                                            const lastIndex = chatMessages.length - 1;
                                            if (buttons.length > 0 && !buttonClicked.has(lastIndex)) {
                                                return (
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        gap: '8px', 
                                                        justifyContent: 'center', 
                                                        marginTop: '16px',
                                                        padding: '12px',
                                                        borderTop: '1px solid rgba(255,255,255,0.1)'
                                                    }}>
                                                        {buttons.map((button, btnIndex) => (
                                                            <button
                                                                key={btnIndex}
                                                                onClick={() => handleButtonClick(button.toLowerCase(), lastIndex)}
                                                                disabled={isLoading}
                                                                style={{
                                                                    padding: '8px 16px',
                                                                    fontSize: '14px',
                                                                    fontWeight: '600',
                                                                    borderRadius: '12px',
                                                                    border: '2px solid var(--accent)',
                                                                    background: 'var(--accent)',
                                                                    color: 'white',
                                                                    cursor: 'pointer',
                                                                    transition: 'all 200ms',
                                                                    boxShadow: '0 4px 12px rgba(79,70,229,0.3)'
                                                                }}
                                                            >
                                                                {button}
                                                            </button>
                                                        ))}
                                                    </div>
                                                );
                                            }
                                        }
                                        return null;
                                    })()}
                                </div>
                            </div>

                            <div style={{ flex: 1 }}>
                                <div className="mic-area">
                                    {/* bring this to 50px bottom */}
                                    <h3 style={{ color: 'var(--text-color)', marginBottom: 20}}>
                                        Voice Recording
                                    </h3>
                                    

                                    {recording && (
                                        <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--accent)', marginBottom: 16 }}>
                                            Recording: {timeLeft}s
                                        </div>
                                    )}

                                    <button
                                        className={`mic-btn ${recording ? 'recording' : ''}`}
                                        onClick={recording ? stopRecognition : startRecognition}
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

                                    <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', maxWidth: 200 }}>
                                        {recording ? 'Recording... Speak clearly' : 'Click to start recording'}
                                    </p>
                                    {/* bring the button to 50px down */}
                                    <button className="end-btn" onClick={endTest} style={{ padding: '15px 30px', fontSize: 16, marginTop: 250 }}>
                                        End Test
                                    </button>
                                    {/* End Test button relocated to popup footer */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}