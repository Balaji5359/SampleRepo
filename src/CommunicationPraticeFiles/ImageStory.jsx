import React, { useState, useEffect } from 'react';

function ImageStory() {
  const [recording, setRecording] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [vocabInput, setVocabInput] = useState('');
  const [vocabTags, setVocabTags] = useState(['Cityscape', 'Buildings', 'Cars', 'Street', 'Urban']);
  const [timer, setTimer] = useState({ minutes: 1, seconds: 0 });
  const [activeTab, setActiveTab] = useState('ImageSpeak Dashboard');
  
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
      root.style.setProperty('--bg', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
      root.style.setProperty('--card-bg', 'rgba(255,255,255,0.04)');
      root.style.setProperty('--accent', '#06b6d4');
      root.style.setProperty('--muted', 'rgba(255,255,255,0.85)');
      root.style.setProperty('--text-color', '#ffffff');
    } else {
      // dark default
      root.style.setProperty('--bg', 'linear-gradient(180deg,#0f172a 0%,#071129 100%)');
      root.style.setProperty('--card-bg', 'rgba(255,255,255,0.04)');
      root.style.setProperty('--accent', '#4f46e5');
      root.style.setProperty('--muted', 'rgba(255,255,255,0.85)');
      root.style.setProperty('--text-color', '#e6eef8');
    }
  }, [theme]);

  const handleRecording = () => {
    setRecording(!recording);
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

  return (
    <div className="imagespeak-root">
      {/* JAM-style Header */}
      <div className="imagespeak-topnav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="imagespeak-title">
            Image-Based Story Telling
          </div>
          <div className="imagespeak-nav">
            <button onClick={() => window.history.back()}>Back</button>
            <button>Practice</button>
            <button 
              className={activeTab === 'ImageSpeak Dashboard' ? 'active' : ''}
              onClick={() => setActiveTab('ImageSpeak Dashboard')}
            >
              ImageStory Dashboard
            </button>
            <button 
              className={activeTab === 'ImageSpeak Leaderboard' ? 'active' : ''}
              onClick={() => setActiveTab('ImageSpeak Leaderboard')}
            >
              ImageStory Leaderboard
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
        {/* ImageSpeak Summary Section */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '700' }}>Overview</div>
              <div style={{ fontSize: '18px', fontWeight: '800' }}>Your ImageStory Summary</div>
            </div>
            <div style={{ textAlign: 'right', color: 'var(--muted)', fontSize: '12px' }}>
              <div>Last updated: {new Date().toLocaleString()}</div>
            </div>
          </div>

          <div className="stats-grid" style={{ marginTop: '6px' }}>
            <div className="stat card" style={{ padding: '12px' }}>
              <div className="label">ImageSpeak Points Earned</div>
              <div className="value">{imageSpeakData.points}</div>
              <div className="small">Points collected across sessions</div>
            </div>

            <div className="stat card" style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <div className="label">Average Score</div>
              <div style={{ marginTop: '6px' }}>
                <div className="donut">
                  <svg height="64" width="64">
                    <circle stroke="rgba(255,255,255,0.08)" fill="transparent" strokeWidth="8" r="24" cx="32" cy="32" />
                    <circle 
                      stroke="url(#grad1)" 
                      fill="transparent" 
                      strokeWidth="8" 
                      strokeDasharray={`${2 * Math.PI * 24} ${2 * Math.PI * 24}`}
                      style={{ strokeDashoffset: 2 * Math.PI * 24 - (imageSpeakData.averageScore / 100) * 2 * Math.PI * 24, transition: 'stroke-dashoffset 700ms ease' }}
                      r="24" 
                      cx="32" 
                      cy="32" 
                      strokeLinecap="round" 
                    />
                    <defs>
                      <linearGradient id="grad1" x1="0" x2="1">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="center">
                    <div className="num">{imageSpeakData.averageScore}%</div>
                    <div className="lbl">Avg</div>
                  </div>
                </div>
              </div>
              <div className="small" style={{ marginTop: '8px' }}>Goal: 85%</div>
            </div>

            <div className="stat card" style={{ padding: '12px' }}>
              <div className="label">Total Tests Taken</div>
              <div className="value">{imageSpeakData.totalTests}</div>
              <div className="small">Trend: ▼ 6% vs last month</div>
            </div>

            <div className="stat card" style={{ padding: '12px' }}>
              <div className="label">Number of Words Spoken</div>
              <div className="value">{imageSpeakData.wordsSpoken}</div>
              <div className="small">Words across all sessions</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="main-layout">
          {/* Image Section */}
          <div className="card">
            <img
              src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop"
              alt="City street scene"
              className="practice-image"
            />
            <p className="instruction">
              Watch the image carefully in as much detail as possible, frame a story and speak. You have 60 seconds.
            </p>
          </div>

          {/* Vocabulary Section */}
          <div className="card">
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '700' }}>Vocabulary Brainstorm</h3>
            {/* <input
              type="text"
              placeholder="🎤 Type or speak words related to the image..."
              className="vocab-input"
              value={vocabInput}
              onChange={(e) => setVocabInput(e.target.value)}
              onKeyPress={handleKeyPress}
            /> */}

            <div className="card">
          <div className="timer-section">
            <div className="timer-box">
              <div className="time">{String(timer.minutes).padStart(2, '0')}</div>
              <div className="timer-label">Minutes</div>
            </div>
            <div className="timer-box">
              <div className="time">{String(timer.seconds).padStart(2, '0')}</div>
              <div className="timer-label">Seconds</div>
            </div>
          </div>

          <div className="record-section">
            <button 
              className={`record-btn ${recording ? 'recording' : ''}`} 
              onClick={handleRecording}
            >
              {recording ? '⏹️' : '🎤'}
            </button>
            <p className="status">
              Recording Status: {recording ? 'In Progress...' : 'Not Started'}
            </p>
          </div>
        </div>
            {/* <div className="vocab-tags">
              {vocabTags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div> */}
          </div>
        </div>

        {/* Timer and Recording Section */}
        

        {/* Feedback Section */}
        {/* <div className="card">
          <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '700' }}>Feedback</h3>
          <ul className="feedback-list">
            <li><strong>Vocabulary:</strong> Good use of descriptive words.</li>
            <li><strong>Structure:</strong> Sentences are well-formed.</li>
            <li><strong>Fluency:</strong> Speech is clear and natural.</li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}

export default ImageStory;
