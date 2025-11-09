import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

function ImageSpeak() {
  const location = useLocation();
  const { remainingTests: initialRemainingTests = 0, testKey = 'image_speak' } = location.state || {};
  const [remainingTests, setRemainingTests] = useState(initialRemainingTests);
  const [recording, setRecording] = useState(false);
  const [theme, setTheme] = useState('custom');
  const [vocabInput, setVocabInput] = useState('');
  const [vocabTags, setVocabTags] = useState(['Cityscape', 'Buildings', 'Cars', 'Street', 'Urban']);
  const [timer, setTimer] = useState({ minutes: 1, seconds: 0 });
  const [activeTab, setActiveTab] = useState('ImageSpeak Dashboard');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [sessionId] = useState(`imagespeak-test-${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`);
  const [userEmail] = useState(localStorage.getItem('email'));
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [recordingUsed, setRecordingUsed] = useState(false);
  const [recordingDisabled, setRecordingDisabled] = useState(true); // Disabled until image loads
  const [micTimeLeft, setMicTimeLeft] = useState(50);
  const [showTestPopup, setShowTestPopup] = useState(false);
  const [testActive, setTestActive] = useState(false);
  
  // Recording refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const micTimerRef = useRef(null);

  // Mock data for ImageSpeak stats
  const imageSpeakData = {
    points: 0,
    averageScore: 72,
    totalTests: 0,
    wordsSpoken: 0
  };

  // JAM-style CSS injection
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

    .imagespeak-root {
      min-height: 100vh;
      background: var(--bg);
      color: var(--text-color);
      font-family: Inter, "Segoe UI", system-ui, Roboto, Arial;
    }

    .imagespeak-topnav {
      position: sticky;
      top: 0;
      z-index: 60;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 24px;
      backdrop-filter: blur(6px);
      background: linear-gradient(90deg, rgba(0,0,0,0.15), rgba(255,255,255,0.02));
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }

    .imagespeak-title {
      font-weight: 700;
      font-size: 18px;
      letter-spacing: 0.2px;
      display: flex;
      gap: 10px;
      align-items: center;
      color: var(--text-color);
    }

    .imagespeak-nav {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .imagespeak-nav button {
      background: transparent;
      border: none;
      color: var(--muted);
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 180ms;
    }

    .imagespeak-nav button.active {
      color: var(--text-color);
      background: linear-gradient(90deg, rgba(79,70,229,0.18), rgba(34,211,238,0.06));
      box-shadow: 0 6px 20px rgba(79,70,229,0.08);
      transform: translateY(-1px);
    }

    .imagespeak-container {
      width: 100%;
      max-width: 1200px;
      margin: 32px auto;
      padding: 24px;
      box-sizing: border-box;
    }

    .card {
      background: var(--card-bg);
      border-radius: 14px;
      padding: 18px;
      box-shadow: 0 8px 24px rgba(2,6,23,0.35);
      backdrop-filter: blur(6px);
      border: 1px solid rgba(255,255,255,0.04);
      color: var(--text-color);
      margin-bottom: 20px;
    }

    .main-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .practice-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 12px;
      margin-bottom: 12px;
    }

    .instruction {
      color: var(--muted);
      font-size: 14px;
      line-height: 1.5;
    }

    .vocab-input {
      width: 100%;
      padding: 12px 16px;
      border: none;
      border-radius: 12px;
      background: rgba(255,255,255,0.08);
      color: var(--text-color);
      font-size: 14px;
      margin-bottom: 16px;
    }

    .vocab-input:focus {
      outline: 2px solid var(--accent);
      background: rgba(255,255,255,0.12);
    }

    .vocab-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tag {
      background: linear-gradient(90deg, rgba(79,70,229,0.18), rgba(34,211,238,0.06));
      color: var(--text-color);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .timer-section {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      margin-bottom: 20px;
    }

    .timer-box {
      text-align: center;
      background: var(--card-bg);
      padding: 20px;
      border-radius: 12px;
      min-width: 100px;
    }

    .time {
      font-size: 32px;
      font-weight: 700;
      color: var(--text-color);
    }

    .timer-label {
      font-size: 12px;
      color: var(--muted);
      margin-top: 4px;
    }

    .record-section {
      text-align: center;
      padding: 30px;
    }

    .record-btn {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, var(--accent) 0%, #764ba2 100%);
      color: white;
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 15px 35px rgba(0,0,0,0.25);
      transition: all 300ms ease;
      margin-bottom: 16px;
    }

    .record-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.32);
    }

    .record-btn.recording {
      animation: pulse 1.25s infinite;
      transform: scale(1.04);
    }

    @keyframes pulse {
      0% { box-shadow: 0 8px 22px rgba(79,70,229,0.12); }
      50% { box-shadow: 0 18px 40px rgba(79,70,229,0.22); }
      100% { box-shadow: 0 8px 22px rgba(79,70,229,0.12); }
    }

    .status {
      color: var(--muted);
      font-size: 14px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
    }

    .stat {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .stat .label {
      color: var(--muted);
      font-size: 13px;
    }

    .stat .value {
      font-weight: 700;
      font-size: 22px;
      color: var(--text-color);
    }

    .stat .small {
      font-size: 12px;
      color: var(--muted);
    }

    .donut {
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: auto;
      position: relative;
    }

    .donut svg {
      transform: rotate(-90deg);
    }

    .donut .center {
      position: absolute;
      text-align: center;
      color: var(--text-color);
    }

    .center .num {
      font-weight: 700;
      font-size: 16px;
    }

    .center .lbl {
      font-size: 10px;
      color: var(--muted);
    }

    .feedback-list {
      list-style: none;
      padding: 0;
    }

    .feedback-list li {
      padding: 8px 0;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      color: var(--muted);
    }

    .feedback-list li:last-child {
      border-bottom: none;
    }

    .feedback-list strong {
      color: var(--text-color);
    }

    .generate-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 200ms;
      margin-bottom: 16px;
    }

    .generate-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16,185,129,0.3);
    }

    .generate-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .loading {
      display: inline-block;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .feedback-section {
      margin-top: 20px;
      padding: 20px;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(79,70,229,0.08), rgba(34,211,238,0.04));
      border: 1px solid rgba(79,70,229,0.2);
      backdrop-filter: blur(10px);
    }

    .feedback-content {
      line-height: 1.6;
      font-size: 14px;
    }

    .feedback-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .feedback-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-color);
    }

    .feedback-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }

    .feedback-stat {
      background: rgba(255,255,255,0.05);
      padding: 12px;
      border-radius: 8px;
      text-align: center;
    }

    .feedback-stat-label {
      font-size: 12px;
      color: var(--muted);
      margin-bottom: 4px;
    }

    .feedback-stat-value {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-color);
    }

    .feedback-section-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-color);
      margin: 16px 0 8px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .feedback-text {
      background: rgba(255,255,255,0.03);
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 12px;
      border-left: 3px solid var(--accent);
    }

    .feedback-reasons {
      background: rgba(255,255,255,0.03);
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 12px;
    }

    .feedback-reason {
      margin-bottom: 8px;
      font-size: 13px;
      line-height: 1.4;
    }

    .feedback-reason strong {
      color: #60a5fa;
    }

    .feedback-general {
      background: rgba(16,185,129,0.1);
      padding: 12px;
      border-radius: 8px;
      border-left: 3px solid #10b981;
    }

    .timer-container { position:relative; display:inline-block; }
    .timer-circle { width:140px; height:140px; }
    .timer-bg { fill:none; stroke:rgba(255,255,255,0.1); stroke-width:8; }
    .timer-progress { fill:none; stroke:var(--accent); stroke-width:8; stroke-linecap:round; transform:rotate(-90deg); transform-origin:50% 50%; transition:stroke-dashoffset 1s linear; }
    .timer-text { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-size:24px; font-weight:700; color:var(--text-color); }
    
    .waveform { height:34px; width:100%; max-width:240px; display:flex; gap:4px; align-items:end; justify-content:center; }
    .waveform span { display:block; width:6px; background:linear-gradient(180deg,#fff,#cde9ff); border-radius:3px; opacity:0.9; animation: wave 800ms infinite ease; }
    .waveform span:nth-child(2) { animation-delay:120ms; }
    .waveform span:nth-child(3) { animation-delay:280ms; }
    .waveform span:nth-child(4) { animation-delay:430ms; }
    @keyframes wave { 0% { height:6px; } 50% { height:26px; } 100% { height:6px; } }
    
    .start-btn { padding:16px 32px; font-size:18px; font-weight:700; border:none; border-radius:12px; background:linear-gradient(135deg,#10b981,#059669); color:white; cursor:pointer; transition:all 200ms; }
    .start-btn:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(16,185,129,0.3); }
    .end-btn { padding:12px 24px; font-size:16px; font-weight:600; border:none; border-radius:8px; background:#ef4444; color:white; cursor:pointer; transition:all 200ms; }
    .end-btn:hover { background:#dc2626; }

    .test-container {
      max-height: 80vh;
      overflow-y: auto;
      padding-right: 10px;
    }

    .test-container::-webkit-scrollbar {
      width: 8px;
    }

    .test-container::-webkit-scrollbar-track {
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
    }

    .test-container::-webkit-scrollbar-thumb {
      background: var(--accent);
      border-radius: 4px;
    }

    .test-container::-webkit-scrollbar-thumb:hover {
      background: rgba(79,70,229,0.8);
    }

    @media (max-width: 768px) {
      .main-layout {
        grid-template-columns: 1fr;
      }
      .timer-section {
        flex-direction: column;
        gap: 10px;
      }
    }
  `;

  useEffect(() => {
    const id = 'imagespeak-styles';
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
          setRemainingTests(parsedData.tests?.image_speak || 0);
        } catch (error) {
          console.error('Error fetching test counts:', error);
        }
      }
    };
    
    fetchTestCounts();
    
    // Cleanup on unmount
    return () => {
      if (micTimerRef.current) {
        clearInterval(micTimerRef.current);
      }
    };
  }, []);

  // Theme handling
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.style.setProperty('--bg', 'linear-gradient(180deg,#f8fafc 0%,#eef2ff 100%)');
      root.style.setProperty('--card-bg', 'rgba(19,21,27,0.04)');
      root.style.setProperty('--accent', '#0ea5a4');
      root.style.setProperty('--muted', '#374151');
      root.style.setProperty('--text-color', '#0b1220');
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
    }
  }, [theme]);

  // Audio Recording Functions
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

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setRecording(true);
      // Don't disable recording here - allow user to stop manually

      // Start 50-second timer
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

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setRecording(false);
    setRecordingUsed(true);
    setRecordingDisabled(true); // Disable after one use
    setMicTimeLeft(50);

    if (micTimerRef.current) {
      clearInterval(micTimerRef.current);
      micTimerRef.current = null;
    }
  };

  const sendAudioToLambda = async (audioBlob) => {
    try {
      setIsLoading(true);

      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);

      reader.onloadend = async () => {
        const base64Audio = reader.result.split(',')[1];

        console.log('Sending audio for transcription...');
        
        // Send to recording API
        const requestBody = {
          body: JSON.stringify({
            data: base64Audio,
            sessionId: sessionId
          })
        };

        const response1 = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_retrivalapi/studentcommunicationtests_recordingapi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        console.log('Recording response status:', response1.status);

        // Poll for transcription
        let attempts = 0;
        const maxAttempts = 12;
        let pollInterval = 2000;

        const pollTranscript = async () => {
          try {
            const response2 = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_retrivalapi/studentcommunicationtests_transcribeapi', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ body: { sessionId: sessionId } })
            });

            const data2 = await response2.json();
            console.log('Transcription poll response:', data2);

            let responseData;
            if (data2.body && typeof data2.body === 'string') {
              try {
                responseData = JSON.parse(data2.body);
              } catch (e) {
                responseData = data2;
              }
            } else {
              responseData = data2.body || data2;
            }

            if (responseData.status === 'completed' && responseData.transcript) {
              const transcript = responseData.transcript.trim();
              if (transcript) {
                console.log('Found transcript:', transcript);
                await sendTranscriptToAI(transcript);
                return;
              }
            }

            if (responseData.error === 'Transcript JSON not found' || responseData.status === 'processing' || data2.statusCode === 404) {
              if (attempts < maxAttempts) {
                attempts++;
                console.log(`Polling attempt ${attempts}/${maxAttempts}`);
                if (attempts > 5) pollInterval = 3000;
                if (attempts > 10) pollInterval = 4000;
                setTimeout(pollTranscript, pollInterval);
                return;
              }
            }

            if (responseData.status === 'error' || responseData.status === 'failed') {
              console.error('Transcription error:', responseData);
              setFeedback('Audio transcription failed. Please try again.');
              setIsLoading(false);
              return;
            }

            console.log('Transcription timeout');
            setFeedback('Audio processing is taking longer than expected. Please try again.');
            setIsLoading(false);
          } catch (pollError) {
            console.error('Polling error:', pollError);
            if (attempts < maxAttempts) {
              attempts++;
              setTimeout(pollTranscript, pollInterval);
            } else {
              setFeedback('Error processing audio. Please try again.');
              setIsLoading(false);
            }
          }
        };

        setTimeout(pollTranscript, 3000);
      };

    } catch (error) {
      console.error('Error:', error);
      setFeedback(`Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  const sendTranscriptToAI = async (transcript) => {
    try {
      console.log('Sending transcript to AI:', transcript);
      
      const requestBody = {
        body: {
          message: transcript,
          sessionId: sessionId,
          email: userEmail
        }
      };

      const response = await fetch('https://au03f6dark.execute-api.ap-south-1.amazonaws.com/dev/eng-corr-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      const aiResponse = JSON.parse(data.body).response;
      
      console.log('AI Feedback:', aiResponse);
      setFeedback(aiResponse);
      
    } catch (error) {
      console.error('Error getting AI feedback:', error);
      setFeedback('Error getting feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseFeedback = (feedbackText) => {
    if (!feedbackText || typeof feedbackText !== 'string') return null;
    
    const lines = feedbackText.split('\n').filter(line => line.trim());
    const parsed = {
      wordCount: '',
      score: '',
      correctedParagraph: '',
      reasons: [],
      feedback: ''
    };
    
    let currentSection = '';
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('**Word Count**:')) {
        parsed.wordCount = trimmed.replace('**Word Count**:', '').trim();
      } else if (trimmed.startsWith('**Score**:')) {
        parsed.score = trimmed.replace('**Score**:', '').trim();
      } else if (trimmed.startsWith('**Corrected Paragraph**:')) {
        currentSection = 'corrected';
      } else if (trimmed.startsWith('**Reasons**:')) {
        currentSection = 'reasons';
      } else if (trimmed.startsWith('**Feedback**:')) {
        currentSection = 'feedback';
      } else if (trimmed && !trimmed.startsWith('**')) {
        if (currentSection === 'corrected') {
          parsed.correctedParagraph += (parsed.correctedParagraph ? ' ' : '') + trimmed;
        } else if (currentSection === 'reasons') {
          parsed.reasons.push(trimmed);
        } else if (currentSection === 'feedback') {
          parsed.feedback += (parsed.feedback ? ' ' : '') + trimmed;
        }
      }
    });
    
    return parsed;
  };

  const handleRecording = () => {
    if (recording) {
      stopAudioRecording();
    } else if (!recordingUsed && !recordingDisabled) {
      startAudioRecording();
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
          test_key: testKey
        })
      });
      
      const data = await response.json();
      if (data.statusCode === 200) {
        console.log('Test count decremented successfully');
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
    // Reset states for new test
    setGeneratedImage(null);
    setFeedback(null);
    setRecordingUsed(false);
    setRecordingDisabled(true);
    setMicTimeLeft(50);
    // Auto-generate image for test
    await generateImageForTest();
  };

  const endTest = () => {
    if (micTimerRef.current) {
      clearInterval(micTimerRef.current);
      micTimerRef.current = null;
    }
    alert('Test completed!');
    window.location.reload();
  };

  const generateImageForTest = async () => {
    setIsGenerating(true);
    setImageLoadError(false);

    try {
      const existingImageFound = await retrieveExistingImage();
      if (!existingImageFound) {
        await generateImage();
      }
    } catch (error) {
      console.error('Error in test image generation:', error);
    }
  };

  // Function to retrieve existing images by sessionId
  const retrieveExistingImage = async () => {
    console.log('🔍 Checking for existing images for sessionId:', sessionId);
    setIsGenerating(true);
    
    try {
      const retrieveRequestBody = {
        sessionId: sessionId,
        action: 'retrieve'
      };

      const response = await fetch('https://au03f6dark.execute-api.ap-south-1.amazonaws.com/dev/image-gen-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(retrieveRequestBody)
      });

      const data = await response.json();
      const result = typeof data.body === 'string' ? JSON.parse(data.body) : data;

      if (result.success && result.image_urls && result.image_urls.length > 0) {
        console.log('✅ Found existing image:', result.image_urls[0]);
        setImageLoadError(false);
        setImageLoading(true);
        setGeneratedImage(result.image_urls[0]);
        return true; // Image found
      } else {
        console.log('ℹ️ No existing images found for this session');
        return false; // No image found
      }
    } catch (error) {
      console.error('❌ Error retrieving existing image:', error);
      return false; // Error occurred
    } finally {
      setIsGenerating(false);
    }
  };

  const addVocabTag = () => {
    if (vocabInput.trim() && !vocabTags.includes(vocabInput.trim())) {
      setVocabTags([...vocabTags, vocabInput.trim()]);
      setVocabInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addVocabTag();
    }
  };

  // Helper function to test if image URL is accessible
  const testImageUrl = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;

      // Timeout after 10 seconds
      setTimeout(() => resolve(false), 10000);
    });
  };

  const generateImage = async () => {
    console.log('🚀 Starting image generation...');
    setIsGenerating(true);
    setImageLoadError(false);

    try {
      // Step 1: Generate prompt
      console.log('� Step 1:A Generating prompt...');
      const promptRequestBody = {
        body: {
          message: 'Generate an image description for speaking practice',
          sessionId: sessionId,
          email: userEmail
        }
      };
      console.log('📤 Prompt API Request:', promptRequestBody);

      const promptResponse = await fetch('https://au03f6dark.execute-api.ap-south-1.amazonaws.com/dev/prompt-gen-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promptRequestBody)
      });

      console.log('📥 Prompt API Response Status:', promptResponse.status);
      const promptData = await promptResponse.json();
      console.log('📥 Prompt API Response Data:', promptData);

      let prompt = JSON.parse(promptData.body).response;
      // Clean the prompt: trim whitespace, remove newlines, and limit length to 512 characters
      prompt = prompt.trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');
      if (prompt.length > 512) {
        prompt = prompt.substring(0, 512);
      }
      console.log('✅ Generated Prompt (cleaned):', prompt);

      // Step 2: Generate image with sessionId
      console.log('🎨 Step 2: Generating image with prompt...');
      const imageRequestBody = {
        body: {
          sessionId: sessionId,
          prompt: prompt
        }
      };
      console.log('📤 Image API Request:', imageRequestBody);

      const imageResponse = await fetch('https://au03f6dark.execute-api.ap-south-1.amazonaws.com/dev/image-gen-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imageRequestBody)
      });

      console.log('📥 Image API Response Status:', imageResponse.status);
      const imageData = await imageResponse.json();
      console.log('📥 Image API Response Data:', imageData);

      const result = JSON.parse(imageData.body);
      console.log('🔍 Parsed Image Result:', result);

      if (result.success && result.s3_url) {
        const imageUrl = result.s3_url;
        console.log('✅ Image Generated Successfully:', imageUrl);
        setImageLoadError(false);
        setImageLoading(true);
        setGeneratedImage(imageUrl);
        // Enable recording after image is set
        setTimeout(() => {
          setRecordingDisabled(false);
        }, 1000); // Small delay to ensure image loads
      } else {
        console.log('❌ Image generation failed or no URLs returned');
        alert('Failed to generate image. Please try again.');
      }
    } catch (error) {
      console.error('💥 Error generating image:', error);
      alert('Error generating image: ' + error.message);
    } finally {
      console.log('🏁 Image generation process completed');
      setIsGenerating(false);
    }
  };

  return (
    <div className="imagespeak-root">
      
      {/* JAM-style Header */}
      <div className="imagespeak-topnav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="imagespeak-title">
            Image-Based Speaking Test
          </div>
          <div className="imagespeak-nav">
            <button onClick={() => window.history.back()}>Back</button>
            <button>Practice</button>
            <button
              className={activeTab === 'ImageSpeak Dashboard' ? 'active' : ''}
              onClick={() => setActiveTab('ImageSpeak Dashboard')}
            >
              ImageSpeak Dashboard
            </button>
            <button
              className={activeTab === 'ImageSpeak Leaderboard' ? 'active' : ''}
              onClick={() => setActiveTab('ImageSpeak Leaderboard')}
            >
              ImageSpeak Leaderboard
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ color: 'var(--muted)', fontSize: 13, marginRight: 6 }}>Theme</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: 'none',
                padding: '6px 8px',
                borderRadius: '8px',
                color: 'var(--muted)',
                fontSize: '13px'
              }}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>
      </div>

      <div className="imagespeak-container">
        {!showTestPopup && (
          <div className="card" style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontWeight: 700, fontSize: 32, marginBottom: 20, color: 'var(--accent)' }}>ImageSpeak Practice Test</div>
            <div style={{ fontSize: 18, color: 'var(--muted)', marginBottom: 20 }}>Test your image description speaking skills</div>
            <div style={{ fontSize: 16, color: 'var(--accent)', marginBottom: 40, fontWeight: 600 }}>
              Remaining Tests: {remainingTests}
            </div>

            <button className="start-btn" onClick={startTest} disabled={remainingTests <= 0}>
              {remainingTests <= 0 ? 'No Tests Remaining' : 'Start ImageSpeak Test'}
            </button>

            <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 600, margin: '40px auto 0' }}>
              <div className="stat card" style={{ padding: 20 }}>
                <div className="label">Average Score</div>
                <div className="value">{imageSpeakData.averageScore}%</div>
              </div>
              <div className="stat card" style={{ padding: 20 }}>
                <div className="label">Tests Taken</div>
                <div className="value">{imageSpeakData.totalTests}</div>
              </div>
              <div className="stat card" style={{ padding: 20 }}>
                <div className="label">Words Spoken</div>
                <div className="value">{imageSpeakData.wordsSpoken}</div>
              </div>
            </div>
          </div>
        )}
        {showTestPopup && (
          <div className="test-container">
            <div className="card" style={{
              background: theme === 'light' ? 'linear-gradient(135deg, #ffffff, #f0f9ff)' :
                theme === 'custom' ? 'linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))' :
                  'var(--card-bg)',
              border: theme === 'light' ? '1px solid rgba(14,165,164,0.2)' :
                theme === 'custom' ? '1px solid rgba(255,255,255,0.2)' :
                  '1px solid rgba(255,255,255,0.04)'
            }}>
              <div style={{ display: 'flex', gap: 30 }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ color: 'var(--accent)', marginBottom: 16 }}>🚀 ImageSpeak Test in Progress</h2>
                  <p style={{ fontSize: 14, marginBottom: 20, color: 'var(--muted)' }}>
                    Describe the image in detail and get AI feedback on your speaking.
                  </p>

                  {generatedImage ? (
                    <>
                      {imageLoading && (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)' }}>
                          <span className="loading">⟳</span> Loading image...
                        </div>
                      )}
                      
                      <img
                        src={generatedImage}
                        alt="Test image for speaking practice"
                        style={{
                          width: '100%',
                          height: '300px',
                          objectFit: 'cover',
                          borderRadius: '12px',
                          marginBottom: '12px',
                          display: imageLoading ? 'none' : 'block'
                        }}
                        onLoad={() => {
                          setImageLoading(false);
                          setImageLoadError(false);
                          // Enable recording when image loads successfully
                          setRecordingDisabled(false);
                        }}
                        onError={() => {
                          setImageLoading(false);
                          setImageLoadError(true);
                        }}
                      />
                      
                      {!imageLoading && !imageLoadError && (
                        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
                          Describe this image in detail. Click the microphone to start recording.
                        </p>
                      )}
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--card-bg)', borderRadius: '12px' }}>
                      {isGenerating ? (
                        <><span className="loading">⟳</span> Generating test image...</>
                      ) : (
                        'Preparing test image...'
                      )}
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, textAlign: 'center' }}>
                  <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '700' }}>Record Your Description</h3>
                  
                  {recording && (
                    <div style={{ marginBottom: '20px' }}>
                      <div className="timer-container">
                        <svg className="timer-circle" viewBox="0 0 140 140">
                          <circle className="timer-bg" cx="70" cy="70" r="62" />
                          <circle
                            className="timer-progress"
                            cx="70"
                            cy="70"
                            r="62"
                            strokeDasharray={2 * Math.PI * 62}
                            strokeDashoffset={2 * Math.PI * 62 - ((50 - micTimeLeft) / 50) * 2 * Math.PI * 62}
                          />
                        </svg>
                        <div className="timer-text">{Math.floor(micTimeLeft / 60)}:{(micTimeLeft % 60).toString().padStart(2, '0')}</div>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '10px' }}>Recording Time</div>
                    </div>
                  )}

                  <div style={{ marginBottom: '20px' }}>
                    <button
                      className={`record-btn ${recording ? 'recording' : ''}`}
                      onClick={handleRecording}
                      disabled={recordingDisabled || (recordingUsed && !recording)}
                      style={{ 
                        width: '100px', 
                        height: '100px', 
                        fontSize: '28px',
                        opacity: (recordingDisabled || (recordingUsed && !recording)) ? 0.3 : 1,
                        cursor: (recordingDisabled || (recordingUsed && !recording)) ? 'not-allowed' : 'pointer'
                      }}
                      title={
                        recordingDisabled && !generatedImage ? 'Wait for image to load' :
                        recordingUsed && !recording ? 'Recording already used - one chance only' : 
                        recording ? 'Stop recording (click to stop)' : 
                        'Start recording (50 seconds max)'
                      }
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
                  </div>

                  {recording && (
                    <div className="waveform" style={{ marginBottom: '20px' }}>
                      <span style={{ height: 10 }} />
                      <span style={{ height: 18 }} />
                      <span style={{ height: 14 }} />
                      <span style={{ height: 22 }} />
                      <span style={{ height: 12 }} />
                    </div>
                  )}

                  <p style={{
                    color: theme === 'light' ? '#6b7280' : theme === 'custom' ? 'rgba(255,255,255,0.9)' : 'var(--muted)',
                    fontSize: '14px',
                    marginBottom: '20px'
                  }}>
                    {isLoading ? 'Processing audio...' : 
                    recording ? 'Recording in progress... Click mic to stop anytime' : 
                    recordingUsed ? 'Recording completed - one chance only' : 
                    recordingDisabled ? 'Wait for image to load' :
                    'Click microphone to start recording (50 seconds max)'}
                  </p>
                  
                  {!recording && (
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '20px' }}>
                      {recordingUsed ? 'One recording per session completed' : '50 seconds maximum - one chance only'}
                    </div>
                  )}
                  
                  <button className="end-btn" onClick={endTest}>
                    End Test
                  </button>
                  
                  {feedback && (() => {
                    const parsed = parseFeedback(feedback);
                    
                    if (!parsed) {
                      return (
                        <div className="feedback-section" style={{ marginTop: '20px', textAlign: 'left' }}>
                          <div className="feedback-header">
                            <span style={{ fontSize: '20px' }}>🤖</span>
                            <div className="feedback-title">AI Feedback</div>
                          </div>
                          <div className="feedback-content">{feedback}</div>
                        </div>
                      );
                    }
                    
                    return (
                      <div className="feedback-section" style={{ marginTop: '20px', textAlign: 'left' }}>
                        <div className="feedback-header">
                          <span style={{ fontSize: '20px' }}>🎯</span>
                          <div className="feedback-title">Speaking Analysis Results</div>
                        </div>
                        
                        <div className="feedback-stats">
                          <div className="feedback-stat">
                            <div className="feedback-stat-label">Word Count</div>
                            <div className="feedback-stat-value">{parsed.wordCount || 'N/A'}</div>
                          </div>
                          <div className="feedback-stat">
                            <div className="feedback-stat-label">Score</div>
                            <div className="feedback-stat-value" style={{ color: '#04422dff' }}>{parsed.score || 'N/A'}</div>
                          </div>
                        </div>
                        
                        {parsed.correctedParagraph && (
                          <>
                            <div className="feedback-section-title">
                              <span>✨</span> Corrected Version
                            </div>
                            <div className="feedback-text">
                              {parsed.correctedParagraph}
                            </div>
                          </>
                        )}
                        
                        {parsed.reasons.length > 0 && (
                          <>
                            <div className="feedback-section-title">
                              <span>🔍</span> Grammar Corrections
                            </div>
                            <div className="feedback-reasons">
                              {parsed.reasons.map((reason, index) => (
                                <div key={index} className="feedback-reason">
                                  {reason.includes('→') ? (
                                    <span>
                                      <strong style={{ color: '#000000' }}>{reason.split('→')[0].trim()}</strong>
                                      <span style={{ margin: '0 8px', color: 'var(--muted)' }}>→</span>
                                      <span>{reason.split('→')[1].split(':')[0].trim()}</span>
                                      {reason.includes(':') && (
                                        <span style={{ color: '#571919', marginLeft: '8px' }}>
                                          ({reason.split(':')[1].trim()})
                                        </span>
                                      )}
                                    </span>
                                  ) : (
                                    reason
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                        
                        {parsed.feedback && (
                          <>
                            <div className="feedback-section-title">
                              <span>💡</span> Overall Feedback
                            </div>
                            <div className="feedback-general">
                              {parsed.feedback}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageSpeak;
