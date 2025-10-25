import React, { useState, useEffect } from 'react';

function SituationSpeak() {
  const [recording, setRecording] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('SituationSpeak Dashboard');
  const [timer, setTimer] = useState({ minutes: 2, seconds: 0 });
  const [interim, setInterim] = useState('');
  const [utterances, setUtterances] = useState([]);
  
  // Mock data for SituationSpeak stats
  const situationSpeakData = {
    points: 850,
    averageScore: 78,
    totalTests: 12,
    wordsSpoken: 3420
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

    .situationspeak-root {
      min-height: 100vh;
      background: var(--bg);
      color: var(--text-color);
      font-family: Inter, "Segoe UI", system-ui, Roboto, Arial;
    }

    .situationspeak-topnav {
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

    .situationspeak-title {
      font-weight: 700;
      font-size: 18px;
      letter-spacing: 0.2px;
      display: flex;
      gap: 10px;
      align-items: center;
      color: var(--text-color);
    }

    .situationspeak-nav {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .situationspeak-nav button {
      background: transparent;
      border: none;
      color: var(--muted);
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 180ms;
    }

    .situationspeak-nav button.active {
      color: var(--text-color);
      background: linear-gradient(90deg, rgba(79,70,229,0.18), rgba(34,211,238,0.06));
      box-shadow: 0 6px 20px rgba(79,70,229,0.08);
      transform: translateY(-1px);
    }

    .situationspeak-container {
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

    .situation-card {
      background: linear-gradient(135deg, rgba(79,70,229,0.1) 0%, rgba(34,211,238,0.05) 100%);
      border: 1px solid rgba(79,70,229,0.2);
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 16px;
    }

    .situation-title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 8px;
      color: var(--text-color);
    }

    .situation-description {
      color: var(--muted);
      line-height: 1.5;
      margin-bottom: 12px;
    }

    .situation-prompt {
      background: rgba(255,255,255,0.05);
      padding: 12px;
      border-radius: 8px;
      font-style: italic;
      color: var(--text-color);
    }

    .mic-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      gap: 12px;
      text-align: center;
      min-height: 500px;
    }

    .mic-btn {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, var(--accent) 0%, #764ba2 100%);
      color: white;
      font-size: 36px;
      cursor: pointer;
      box-shadow: 0 15px 35px rgba(0,0,0,0.25);
      transition: all 300ms ease;
      margin-bottom: 16px;
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

    .waveform {
      height: 34px;
      width: 100%;
      max-width: 240px;
      display: flex;
      gap: 4px;
      align-items: end;
      justify-content: center;
    }

    .waveform span {
      display: block;
      width: 6px;
      background: linear-gradient(180deg,#fff,#cde9ff);
      border-radius: 3px;
      opacity: 0.9;
      animation: wave 800ms infinite ease;
    }

    .waveform span:nth-child(2) { animation-delay: 120ms; }
    .waveform span:nth-child(3) { animation-delay: 280ms; }
    .waveform span:nth-child(4) { animation-delay: 430ms; }

    @keyframes wave {
      0% { height: 6px; }
      50% { height: 26px; }
      100% { height: 6px; }
    }

    .utter-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 6px;
    }

    .utter-item {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      padding: 12px;
      border-radius: 10px;
      background: rgba(255,255,255,0.02);
      font-size: 13px;
      align-items: center;
      margin-bottom: 8px;
    }

    .timer-display {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-bottom: 20px;
    }

    .timer-box {
      background: var(--card-bg);
      padding: 12px 16px;
      border-radius: 8px;
      text-align: center;
      min-width: 60px;
    }

    .timer-number {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-color);
    }

    .timer-label {
      font-size: 10px;
      color: var(--muted);
      margin-top: 2px;
    }

    @media (max-width: 768px) {
      .main-layout {
        grid-template-columns: 1fr;
      }
    }
  `;

  useEffect(() => {
    const id = 'situationspeak-styles';
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

  const pushUtterance = (text) => {
    const newUt = { 
      id: `u${Date.now()}`, 
      text, 
      score: Math.round(50 + Math.random() * 50), 
      datetime: new Date().toISOString() 
    };
    setUtterances((s) => [newUt, ...(s || [])].slice(0, 6));
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const t = e.target.elements['manual'].value.trim();
    if (t) {
      pushUtterance(t);
      e.target.reset();
    }
  };

  return (
    <div className="situationspeak-root">
      {/* JAM-style Header */}
      <div className="situationspeak-topnav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="situationspeak-title">
            Situational Speaking Test
          </div>
          <div className="situationspeak-nav">
            <button onClick={() => window.history.back()}>Back</button>
            <button>Practice</button>
            <button 
              className={activeTab === 'SituationSpeak Dashboard' ? 'active' : ''}
              onClick={() => setActiveTab('SituationSpeak Dashboard')}
            >
              SituationSpeak Dashboard
            </button>
            <button 
              className={activeTab === 'SituationSpeak Leaderboard' ? 'active' : ''}
              onClick={() => setActiveTab('SituationSpeak Leaderboard')}
            >
              SituationSpeak Leaderboard
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

      <div className="situationspeak-container">
        {/* SituationSpeak Summary Section */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '700' }}>Overview</div>
              <div style={{ fontSize: '18px', fontWeight: '800' }}>Your SituationSpeak Summary</div>
            </div>
            <div style={{ textAlign: 'right', color: 'var(--muted)', fontSize: '12px' }}>
              <div>Last updated: {new Date().toLocaleString()}</div>
            </div>
          </div>

          <div className="stats-grid" style={{ marginTop: '6px' }}>
            <div className="stat card" style={{ padding: '12px' }}>
              <div className="label">SituationSpeak Points Earned</div>
              <div className="value">{situationSpeakData.points}</div>
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
                      style={{ strokeDashoffset: 2 * Math.PI * 24 - (situationSpeakData.averageScore / 100) * 2 * Math.PI * 24, transition: 'stroke-dashoffset 700ms ease' }}
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
                    <div className="num">{situationSpeakData.averageScore}%</div>
                    <div className="lbl">Avg</div>
                  </div>
                </div>
              </div>
              <div className="small" style={{ marginTop: '8px' }}>Goal: 85%</div>
            </div>

            <div className="stat card" style={{ padding: '12px' }}>
              <div className="label">Total Tests Taken</div>
              <div className="value">{situationSpeakData.totalTests}</div>
              <div className="small">Trend: ▲ 4% vs last month</div>
            </div>

            <div className="stat card" style={{ padding: '12px' }}>
              <div className="label">Number of Words Spoken</div>
              <div className="value">{situationSpeakData.wordsSpoken}</div>
              <div className="small">Words across all sessions</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="main-layout">
          {/* Situation Scenario Section */}
          <div className="card">
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '700' }}>Current Situation</h3>
            
            <div className="situation-card">
              <div className="situation-title">🏢 Job Interview Scenario</div>
              <div className="situation-description">
                You are in a job interview for a marketing position at a tech startup. The interviewer has just asked you about your experience with digital marketing campaigns.
              </div>
              <div className="situation-prompt">
                "Tell me about a successful digital marketing campaign you've worked on. What was your role and what made it successful?"
              </div>
            </div>

            <div className="timer-display">
              <div className="timer-box">
                <div className="timer-number">{String(timer.minutes).padStart(2, '0')}</div>
                <div className="timer-label">MIN</div>
              </div>
              <div className="timer-box">
                <div className="timer-number">{String(timer.seconds).padStart(2, '0')}</div>
                <div className="timer-label">SEC</div>
              </div>
            </div>
          </div>

          {/* AI ChatBot Section */}
          <div className="card mic-area">
            <div style={{ fontWeight: '700', fontSize: '20px', marginBottom: '10px' }}>AI ChatBot</div>
            <div style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '20px' }}>Press the microphone and respond to the situation</div>

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ minHeight: '50px', fontSize: '16px', textAlign: 'center', padding: '10px' }}>
                {recording ?
                  <div style={{ color: '#4ade80', fontWeight: '600' }}>🎙️ Listening... Speak now!</div> :
                  interim ?
                  <div style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Processing: "{interim}"</div> :
                  <div style={{ color: 'var(--muted)' }}>Ready to listen - Click the mic!</div>
                }
              </div>

              <button
                className={`mic-btn ${recording ? 'recording' : ''}`}
                onClick={handleRecording}
                title={recording ? 'Stop Recording' : 'Start Recording'}
              >
                {recording ? (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="6" width="12" height="12" rx="2"/>
                  </svg>
                ) : (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/>
                    <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                )}
              </button>

              {recording && (
                <div className="waveform" style={{ marginTop: 10 }}>
                  <span style={{ height: 12 }} />
                  <span style={{ height: 24 }} />
                  <span style={{ height: 18 }} />
                  <span style={{ height: 30 }} />
                  <span style={{ height: 16 }} />
                </div>
              )}

              <form onSubmit={handleManualSubmit} style={{ marginTop: '20px', display: 'flex', gap: '10px', width: '100%' }}>
                <input
                  name="manual"
                  placeholder="Or type your response here..."
                  style={{
                    flex: 1,
                    borderRadius: '12px',
                    padding: '12px 16px',
                    border: 'none',
                    background: 'rgba(255,255,255,0.08)',
                    color: 'inherit',
                    fontSize: '14px'
                  }}
                />
                <button type="submit" style={{ minWidth: '80px', padding: '12px 16px', borderRadius: '12px', background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer' }}>Send</button>
              </form>

              <div style={{ width: '100%', marginTop: '20px' }}>
                <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '10px', fontWeight: '600' }}>Recent Responses</div>
                <div className="utter-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {utterances.length ? utterances.map((u) => (
                    <div key={u.id} className="utter-item">
                      <div style={{ textAlign: 'left', maxWidth: '75%' }}>
                        <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{u.text}</div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{new Date(u.datetime).toLocaleString()}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '800', fontSize: '16px', color: '#4ade80' }}>{u.score ?? '-'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)' }}>score</div>
                      </div>
                    </div>
                  )) : <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '20px' }}>No responses yet - Start speaking!</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SituationSpeak;
