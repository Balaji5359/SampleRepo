import React, { useEffect, useMemo, useRef, useState } from 'react';

let Recharts;
try {
  Recharts = require('recharts');
} catch (e) {
  Recharts = null;
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const formatNumber = (n) => n?.toLocaleString?.() ?? String(n ?? 0);

const styles = `
  :root {
    --bg: linear-gradient(180deg,#0f172a 0%,#071129 100%);
    --card-bg: rgba(255,255,255,0.04);
    --glass: rgba(255,255,255,0.06);
    --accent: #4f46e5;
    --muted: rgba(255,255,255,0.75);
    --text-color: #e6eef8;
    --focus: rgba(79,70,229,0.18);
    --theme-update: 0;
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

  .card { background: var(--card-bg); border-radius:14px; padding:18px; box-shadow: 0 8px 24px rgba(2,6,23,0.35); backdrop-filter: blur(6px); border: 1px solid rgba(255,255,255,0.04); color: var(--text-color); }
  .stats-grid { display:grid; grid-template-columns: repeat(2, 1fr); gap:14px; }
  .stat { display:flex; flex-direction:column; gap:6px; }
  .stat .label { color:var(--muted); font-size:13px; }
  .stat .value { font-weight:700; font-size:22px; color: var(--text-color); }
  .stat .small { font-size:12px; color:var(--muted); }

  .chart-area { height:320px; display:flex; align-items:center; justify-content:center; }

  .donut { width:120px; height:120px; display:flex; align-items:center; justify-content:center; margin:auto; position:relative; }
  .donut svg { transform: rotate(-90deg); }
  .donut .center { position:absolute; text-align:center; color:var(--text-color); }
  .center .num { font-weight:700; font-size:18px; }
  .center .lbl { font-size:12px; color:var(--muted); }

  .mic-area { display:flex; flex-direction:column; align-items:center; justify-content:flex-start; gap:12px; text-align:center; min-height:700px; }
  
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
  
  .popup-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:1000; }
  .popup-content { background:var(--card-bg); border-radius:16px; padding:32px; max-width:600px; width:90%; backdrop-filter:blur(10px); border:1px solid var(--border-color, rgba(255,255,255,0.1)); }
  .performance-card { background: var(--performance-bg, var(--card-bg)); border: 1px solid var(--border-color, rgba(255,255,255,0.04)); }
  .chart-tooltip { background: var(--tooltip-bg, rgba(11,18,32,0.9)) !important; color: var(--text-color) !important; border: 1px solid var(--border-color, rgba(255,255,255,0.1)) !important; }
  .chart-axis { fill: var(--axis-color, rgba(255,255,255,0.7)) !important; }
  .chart-grid { stroke: var(--grid-color, rgba(255,255,255,0.03)) !important; }
  
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

  .utter-list { width:100%; display:flex; flex-direction:column; gap:8px; margin-top:6px; }
  .utter-item { display:flex; justify-content:space-between; gap:10px; padding:8px 10px; border-radius:8px; background: rgba(255,255,255,0.02); font-size:13px; align-items:center; }

  .theme-row { display:flex; gap:8px; align-items:center; justify-content:center; flex-wrap:wrap; }
  .small-btn { padding:8px 10px; border-radius:8px; border:none; cursor:pointer; background: rgba(255,255,255,0.03); color:var(--muted); }
  .small-btn.selected { background: linear-gradient(90deg, rgba(79,70,229,0.14), rgba(34,211,238,0.04)); color: var(--text-color); box-shadow: 0 8px 20px rgba(79,70,229,0.06); }

  .jam-topnav select, .jam-topnav label { color: var(--muted); font-size:13px; }
  .jam-topnav select { background: rgba(255,255,255,0.03); border: none; padding:6px 8px; border-radius:8px; color: inherit; }

  .footer-note { color:var(--muted); font-size:12px; text-align:center; margin-top:6px; }

  @media (max-width: 940px) {
    .jam-container { flex-direction:column; padding:16px; margin:16px; }
    .jam-layout { flex-direction:column; }
    .stats-grid { grid-template-columns: repeat(2,1fr); }
  }

  @media (prefers-reduced-motion: reduce) {
    .mic-btn.recording { animation: none; transform:none; }
    .waveform span { animation: none; height:14px; }
  }
`;

export default function TranslateSpeak({
  initialData = null,
  onUtterance = () => {},
  onThemeChange = () => {},
}) {
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

  const [activeTab, setActiveTab] = useState('TranslateSpeak Dashboard');
  const [theme, setTheme] = useState('custom');
  const [bgIndex, setBgIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [interim, setInterim] = useState('');
  const [utterances, setUtterances] = useState([]);
  const [displayCounts, setDisplayCounts] = useState({
    jamPoints: 0,
    totalTests: 0,
    wordsSpoken: 0,
  });
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [bgDropdownOpen, setBgDropdownOpen] = useState(false);

  const recognitionRef = useRef(null);
  const mountedRef = useRef(true);
  
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(`story-test-${Math.floor(Math.random() * 10000000)}`);
  const [userEmail] = useState(localStorage.getItem('email') || '22691a2828@mits.ac.in');
  const [jamData, setJamData] = useState(null);
  
  const [showTestPopup, setShowTestPopup] = useState(false);
  const [testActive, setTestActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [micTimeLeft, setMicTimeLeft] = useState(60);
  const [currentRecording, setCurrentRecording] = useState('');
  const timerRef = useRef(null);
  const micTimerRef = useRef(null);
  const testTimerRef = useRef(null);
  
  const [data, setData] = useState(placeholder);
  
  useEffect(() => {
    setUtterances(data.recentUtterances || []);
  }, [data.recentUtterances]);

  useEffect(() => {
    const id = 'translate-styles';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id;
      s.innerHTML = styles;
      document.head.appendChild(s);
    }
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    fetchTranslateData();
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const backgroundOptions = [
    { id: 0, label: 'Aurora', css: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 1, label: 'Sunset', css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { id: 2, label: 'Ocean', css: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { id: 3, label: 'Forest', css: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { id: 4, label: 'Purple', css: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  ];

  const sendMessageToStory = async (message) => {
    setIsLoading(true);
    try {
      const requestBody = {
        body: {
          message: message,
          sessionId: sessionId,
          email: userEmail
        }
      };
      
      const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/storyretellingagent-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      const aiResponse = JSON.parse(data.body).response;
      
      setChatMessages(prev => [...prev, { type: 'user', content: message, timestamp: Date.now() }]);
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

  const extractButtons = (text) => {
    const buttons = [];
    if (text.includes('1. Telugu') || text.includes('2. Hindi') || text.includes('3. Kannada') || text.includes('4. Tamil') || text.includes('5. Malayalam')) {
      buttons.push('1', '2', '3', '4', '5');
    }
    return { cleanText: text, buttons };
  };

  const handleButtonClick = (buttonText) => {
    sendMessageToStory(buttonText);
  };

  const fetchTranslateData = async () => {
    try {
      const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_retrivalapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          college_email: userEmail,
          test_type: 'STORYRETELLING'
        })
      });
      const data = await response.json();
      const parsedData = JSON.parse(data.body);
      setJamData(parsedData);
      
      const sessions = parsedData.sessions || [];
      const totalSessions = sessions.length;
      let totalWords = 0;
      let totalScore = 0;
      let scoreCount = 0;
      
      sessions.forEach(session => {
        session.conversationHistory?.forEach(conv => {
          if (conv.agent) {
            const scoreMatch = conv.agent.match(/Accuracy Score: ([\d.]+)%/i);
            const wordMatch = conv.agent.match(/WORD COUNT: (\d+) words/i);
            
            if (scoreMatch) {
              totalScore += parseFloat(scoreMatch[1]);
              scoreCount++;
            }
            
            if (wordMatch) {
              totalWords += parseInt(wordMatch[1]);
            }
          }
        });
      });
      
      const avgScore = scoreCount > 0 ? totalScore / scoreCount : 0;
      
      setDisplayCounts({
        jamPoints: Math.round(avgScore * 10),
        totalTests: totalSessions,
        wordsSpoken: totalWords
      });
      
    } catch (error) {
      console.error('Error fetching translate data:', error);
    }
  };

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
  }, [data.jamPoints, data.totalTests, data.wordsSpoken]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.style.setProperty('--bg', 'linear-gradient(180deg,#f8fafc 0%,#eef2ff 100%)');
      root.style.setProperty('--card-bg', 'rgba(19,21,27,0.04)');
      root.style.setProperty('--accent', '#0ea5a4');
      root.style.setProperty('--muted', '#374151');
      root.style.setProperty('--text-color', '#0b1220');
      root.style.setProperty('--border-color', 'rgba(19,21,27,0.1)');
      root.style.setProperty('--performance-bg', 'rgba(19,21,27,0.06)');
      root.style.setProperty('--tooltip-bg', 'rgba(255,255,255,0.95)');
      root.style.setProperty('--axis-color', '#374151');
      root.style.setProperty('--grid-color', 'rgba(19,21,27,0.08)');
      root.style.setProperty('color-scheme', 'light');
    } else if (theme === 'custom') {
      root.style.setProperty('--bg', 'linear-gradient(135deg, #3b9797, #5bb5b5)');
      root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.9)');
      root.style.setProperty('--accent', '#043e4aff');
      root.style.setProperty('--muted', 'rgba(17, 18, 18, 0.85)');
      root.style.setProperty('--text-color', '#01100eff');
      root.style.setProperty('--border-color', 'rgba(17, 18, 18, 0.3)');
      root.style.setProperty('--performance-bg', 'rgba(255, 255, 255, 0.85)');
      root.style.setProperty('--tooltip-bg', 'rgba(255, 255, 255, 0.95)');
      root.style.setProperty('--axis-color', 'rgba(17, 18, 18, 0.8)');
      root.style.setProperty('--grid-color', 'rgba(17, 18, 18, 0.1)');
    } else {
      root.style.setProperty('--bg', 'linear-gradient(180deg,#0f172a 0%,#071129 100%)');
      root.style.setProperty('--card-bg', 'rgba(255,255,255,0.04)');
      root.style.setProperty('--accent', '#4f46e5');
      root.style.setProperty('--muted', 'rgba(255,255,255,0.85)');
      root.style.setProperty('--text-color', '#e6eef8');
      root.style.setProperty('--border-color', 'rgba(255,255,255,0.1)');
      root.style.setProperty('--performance-bg', 'rgba(255,255,255,0.04)');
      root.style.setProperty('--tooltip-bg', 'rgba(11,18,32,0.9)');
      root.style.setProperty('--axis-color', 'rgba(255,255,255,0.7)');
      root.style.setProperty('--grid-color', 'rgba(255,255,255,0.03)');
      root.style.setProperty('color-scheme', 'dark');
    }
    root.style.setProperty('--theme-update', Date.now().toString());
    onThemeChange({ theme, bgIndex });
  }, [theme, bgIndex, onThemeChange]);

  const startMicRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported');
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    setRecording(true);
    setMicTimeLeft(60);
    
    micTimerRef.current = setInterval(() => {
      setMicTimeLeft(prev => {
        if (prev <= 1) {
          stopMicRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (event.results[event.results.length - 1].isFinal) {
        sendMessageToStory(transcript);
        stopMicRecording();
      }
    };
    
    recognition.onerror = () => stopMicRecording();
    recognition.onend = () => stopMicRecording();
    
    recognition.start();
    recognitionRef.current = recognition;
  };
  
  const stopMicRecording = () => {
    setRecording(false);
    setMicTimeLeft(60);
    if (micTimerRef.current) {
      clearInterval(micTimerRef.current);
      micTimerRef.current = null;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  const toggleMic = () => {
    if (recording) {
      stopMicRecording();
    } else {
      startMicRecording();
    }
  };

  const startTest = async () => {
    setSessionId(`story-test-${Math.floor(Math.random() * 10000000)}`);
    setChatMessages([]);
    
    setShowTestPopup(true);
    setTestActive(true);
    setTimeLeft(120);
    setCurrentRecording('');
    await sendMessageToStory('hi');
    
    testTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const endTest = async () => {
    // Clear timers
    if (testTimerRef.current) {
      clearInterval(testTimerRef.current);
      testTimerRef.current = null;
    }
    if (micTimerRef.current) {
      clearInterval(micTimerRef.current);
      micTimerRef.current = null;
    }
    
    // Show alert and hide popup
    alert('Test completed! Starting new test...');
    setShowTestPopup(false);
    setTestActive(false);
    
    // Reset for new test
    setChatMessages([]);
    setCurrentRecording('');
    setTimeLeft(120);
    setMicTimeLeft(60);
    
    fetchTranslateData();
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
        <div className="timer-text">{Math.floor(time/60)}:{(time%60).toString().padStart(2,'0')}</div>
        <div style={{ position:'absolute', bottom:'-30px', left:'50%', transform:'translateX(-50%)', fontSize:'12px', color:'var(--muted)' }}>{label}</div>
      </div>
    );
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const t = e.target.elements['manual'].value.trim();
    if (t && !isLoading) {
      sendMessageToStory(t);
      e.target.reset();
    }
  };

  const Donut = ({ percent = 0 }) => {
    const radius = 48;
    const stroke = 10;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percent / 100) * circumference;
    return (
      <div className="donut" role="img" aria-label={`Average score ${percent}%`}>
        <svg height={radius*2} width={radius*2}>
          <circle stroke="rgba(255,255,255,0.08)" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
          <circle stroke="url(#grad1)" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} style={{ strokeDashoffset, transition:'stroke-dashoffset 700ms ease' }} r={normalizedRadius} cx={radius} cy={radius} strokeLinecap="round" />
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
    <div className="jam-root" role="application" aria-label="Translate Speak Dashboard">
      <div className="jam-topnav" role="navigation" aria-label="Top navigation">
        <div className="left">
          <div className="jam-title" aria-hidden>
            Translate Speak Practice
          </div>
          <div className="jam-nav" role="tablist" aria-label="Main tabs">
            {['Back', 'Practice', 'Translate Speak Dashboard', 'Translate Speak Leaderboard'].map((t) => (
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

        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ color:'var(--muted)', fontSize:13, marginRight:6 }}>Theme</div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} aria-label="Select theme">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>
      </div>

      <div className="jam-container">
        <div className="jam-layout" style={{ width:'100%' }}>
          <div className="jam-left">
            {!showTestPopup && (
              <div className="card" style={{ textAlign:'center', padding:60 }}>
                <div style={{ fontWeight:700, fontSize:32, marginBottom:20, color:'var(--accent)' }}>TranslateSpeak Practice Test</div>
                <div style={{ fontSize:18, color:'var(--muted)', marginBottom:40 }}>Test your translation speaking skills</div>
                
                <button className="start-btn" onClick={startTest}>
                  Start TranslateSpeak Test
                </button>
                
                {jamData && (
                  <div style={{ marginTop:40, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, maxWidth:600, margin:'40px auto 0' }}>
                    <div className="stat card" style={{ padding:20 }}>
                      <div className="label">Average Score</div>
                      <div className="value">{(displayCounts.jamPoints/100).toFixed(1)}/10</div>
                    </div>
                    <div className="stat card" style={{ padding:20 }}>
                      <div className="label">Tests Taken</div>
                      <div className="value">{displayCounts.totalTests}</div>
                    </div>
                    <div className="stat card" style={{ padding:20 }}>
                      <div className="label">Words Spoken</div>
                      <div className="value">{formatNumber(displayCounts.wordsSpoken)}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="jam-right">
            <div className="card performance-card" style={{ minHeight:320 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                <div>
                  <div style={{ fontWeight:700, color:'var(--text-color)' }}>
                    {theme === 'custom' ? 'Translation Analytics' : theme === 'light' ? 'Learning Progress' : 'Performance Over Time'}
                  </div>
                  <div style={{ fontSize:13, color:'var(--muted)' }}>
                    {theme === 'custom' ? 'Language skills metrics — recent activity' : theme === 'light' ? 'Your translation journey' : 'Score & Words — last 12 sessions'}
                  </div>
                </div>
                <div style={{ fontSize:13, color:'var(--muted)' }}>
                  <small>{theme === 'custom' ? 'Real-time' : theme === 'light' ? 'Current' : 'Interactive'}</small>
                </div>
              </div>

              <div className="chart-area performance-card" style={{ padding:8 }}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
                  {theme === 'custom' ? 'Translation metrics loading...' : theme === 'light' ? 'Progress visualization will appear after tests' : 'Chart will appear after taking tests'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {showTestPopup && (
          <div className="popup-overlay">
            <div className="popup-content" style={{ maxWidth:'800px', width:'95%' }}>
              <div style={{ display:'flex', gap:30 }}>
                <div style={{ flex:1 }}>
                  <h2 style={{ color:'var(--accent)', marginBottom:16 }}>
                    {theme === 'custom' ? 'Live Translation Assessment' : theme === 'light' ? 'Language Skills Evaluation' : 'TranslateSpeak Test in Progress'}
                  </h2>
                  
                  <div className="chat-container" style={{ height:'300px', marginBottom:20 }}>
                    {chatMessages.map((msg, index) => {
                      const { cleanText, buttons } = extractButtons(msg.content);
                      return (
                        <div key={index} className={`chat-message ${msg.type}`}>
                          <div className={`message-bubble ${msg.type}`}>
                            {cleanText.split('\n').map((line, i) => (
                              <div key={i}>{line}</div>
                            ))}
                          </div>
                          {msg.type === 'ai' && buttons.length > 0 && (
                            <div className="chat-buttons">
                              {buttons.map((button, btnIndex) => (
                                <button 
                                  key={btnIndex} 
                                  className="chat-btn"
                                  onClick={() => handleButtonClick(button)}
                                  disabled={isLoading}
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
                  
                  <form onSubmit={handleManualSubmit} style={{ display:'flex', gap:8, marginBottom:16 }}>
                    <input 
                      name="manual" 
                      type="text" 
                      placeholder="Type your response..."
                      style={{
                        flex:1, 
                        padding:'12px', 
                        borderRadius:'8px', 
                        border:'1px solid rgba(255,255,255,0.1)', 
                        background:'rgba(255,255,255,0.05)', 
                        color:'var(--text-color)',
                        fontSize:'14px'
                      }}
                      disabled={isLoading}
                    />
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      style={{
                        padding:'12px 20px',
                        borderRadius:'8px',
                        border:'none',
                        background:'var(--accent)',
                        color:'white',
                        cursor:'pointer',
                        fontSize:'14px',
                        fontWeight:'600'
                      }}
                    >
                      Send
                    </button>
                  </form>
                </div>
                
                <div style={{ flex:1, textAlign:'center' }}>
                  <div style={{ display:'flex', gap:20, justifyContent:'center', marginBottom:30 }}>
                    <TimerCircle time={timeLeft} maxTime={120} label="Test Time" />
                    <TimerCircle time={micTimeLeft} maxTime={60} label="Mic Time" />
                  </div>
                  
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16, marginBottom:20 }}>
                     <button
                                    className={`mic-btn ${recording ? 'recording' : ''}`}
                                    onClick={toggleMic}
                                    style={{ width:'100px', height:'100px', fontSize:'28px' }}
                                >
                                    {recording ? (
                                        <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                                            <rect x="6" y="6" width="12" height="12" rx="2"/>
                                        </svg>
                                    ) : (
                                        <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/>
                                            <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
                                            <line x1="12" y1="19" x2="12" y2="23"/>
                                            <line x1="8" y1="23" x2="16" y2="23"/>
                                        </svg>
                                    )}
                                </button>
                                
                                {recording && (
                                    <div className="waveform">
                                        <span style={{ height:10 }} />
                                        <span style={{ height:18 }} />
                                        <span style={{ height:14 }} />
                                        <span style={{ height:22 }} />
                                        <span style={{ height:12 }} />
                                    </div>
                                )}
                                
                    <div style={{ fontSize:'14px', color:'var(--muted)' }}>
                      {recording ? 'Recording...' : 'Click to speak'}
                    </div>
                  </div>
                  
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
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
    </div>
  );
}