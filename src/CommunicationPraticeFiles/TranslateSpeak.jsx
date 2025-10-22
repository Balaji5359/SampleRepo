// TranslateSpeak.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';

/**
 * TranslateSpeak.jsx - Adapted from JAM.jsx
 *
 * Features:
 * - Dashboard layout with summary stats for translation practice.
 * - Performance chart over time.
 * - AI ChatBot changed to translation-speaking bot: displays a sentence to translate, allows speaking/typing the translation, scores accuracy.
 *
 * Changes from JAM:
 * - Stats themed around translation (points, average score, total translations, words translated).
 * - AI bot prompts for translation, scores based on expected translation.
 * - Data placeholders updated for translation context.
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

/* ---------- Inline CSS (same as JAM) ---------- */
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
.jam-left { flex: 1 1 50%; display:flex; flex-direction:column; gap:18px; }
.jam-right { flex: 1 1 50%; display:flex; flex-direction:column; gap:18px; min-width:300px; }

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

.mic-area { display:flex; flex-direction:column; align-items:center; justify-content:flex-start; gap:12px; text-align:center; min-height:500px; }
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

/* ---------- Component ---------- */
export default function TranslateSpeak({
initialData = null,
onUtterance = () => {},
onThemeChange = () => {},
}) {
// default placeholder data for translation
const placeholder = {
translationPoints: 1280,
averageScore: 72.4,
totalTranslations: 18,
wordsTranslated: 56300,
trends: Array.from({ length: 12 }).map((_, i) => {
const date = new Date();
date.setDate(date.getDate() - (11 - i));
return {
date: date.toISOString().slice(0, 10),
score: Math.round(60 + Math.random() * 30),
words: Math.round(1000 + Math.random() * 2000),
};
}),
recentTranslations: [
{ id: 't1', original: 'Hello world', translation: 'Hola mundo', score: 72, datetime: new Date().toISOString() },
],
sentencesToTranslate: [
{ original: 'The quick brown fox jumps over the lazy dog.', expected: 'El rápido zorro marrón salta sobre el perro perezoso.' },
{ original: 'I love programming.', expected: 'Me encanta programar.' },
{ original: 'How are you?', expected: '¿Cómo estás?' },
],
};

const data = useMemo(() => ({ ...placeholder, ...(initialData || {}) }), [initialData]);

// UI state
const [activeTab, setActiveTab] = useState('Translate Speak Dashboard');
const [theme, setTheme] = useState('dark');
const [bgIndex, setBgIndex] = useState(0);
const [recording, setRecording] = useState(false);
const [interim, setInterim] = useState('');
const [translations, setTranslations] = useState(data.recentTranslations || []);
const [currentSentence, setCurrentSentence] = useState(data.sentencesToTranslate[0]);
const [displayCounts, setDisplayCounts] = useState({
translationPoints: 0,
totalTranslations: 0,
wordsTranslated: 0,
});
const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
const [bgDropdownOpen, setBgDropdownOpen] = useState(false);

// references
const recognitionRef = useRef(null);
const mountedRef = useRef(true);

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

const backgroundOptions = [
{ id: 0, label: 'Aurora', css: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
{ id: 1, label: 'Sunset', css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
{ id: 2, label: 'Ocean', css: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
{ id: 3, label: 'Forest', css: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
{ id: 4, label: 'Purple', css: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
];

// animate counts
useEffect(() => {
const start = performance.now();
const duration = 900;
const initial = { ...displayCounts };
const target = { translationPoints: data.translationPoints, totalTranslations: data.totalTranslations, wordsTranslated: data.wordsTranslated };

let raf = null;
const step = (t) => {
const p = clamp((t - start) / duration, 0, 1);
if (!mountedRef.current) return;
setDisplayCounts({
translationPoints: Math.round(initial.translationPoints + (target.translationPoints - initial.translationPoints) * p),
totalTranslations: Math.round(initial.totalTranslations + (target.totalTranslations - initial.totalTranslations) * p),
wordsTranslated: Math.round(initial.wordsTranslated + (target.wordsTranslated - initial.wordsTranslated) * p),
});
if (p < 1) raf = requestAnimationFrame(step);
};
raf = requestAnimationFrame(step);
return () => raf && cancelAnimationFrame(raf);
}, [data.translationPoints, data.totalTranslations, data.wordsTranslated]);

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
root.style.setProperty('--bg', backgroundOptions[bgIndex].css);
root.style.setProperty('--card-bg', 'rgba(255,255,255,0.04)');
root.style.setProperty('--accent', '#06b6d4');
root.style.setProperty('--muted', 'rgba(255,255,255,0.85)');
root.style.setProperty('--text-color', '#ffffff');
} else {
root.style.setProperty('--bg', 'linear-gradient(180deg,#0f172a 0%,#071129 100%)');
root.style.setProperty('--card-bg', 'rgba(255,255,255,0.04)');
root.style.setProperty('--accent', '#4f46e5');
root.style.setProperty('--muted', 'rgba(255,255,255,0.85)');
root.style.setProperty('--text-color', '#e6eef8');
}
root.style.setProperty('--theme-update', Date.now().toString());
onThemeChange({ theme, bgIndex });
}, [theme, bgIndex, onThemeChange]);

/* ---------- Speech recognition ---------- */
const startRecognition = () => {
const win = window;
const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
if (!SpeechRecognition) {
alert('Speech Recognition is not supported in this browser.');
return;
}
try {
const rec = new SpeechRecognition();
rec.continuous = false;
rec.interimResults = true;
rec.lang = 'en-US'; // Assuming translating to English
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
pushTranslation(finalText);
}
};
rec.onend = () => {
setRecording(false);
setInterim('');
};
rec.start();
recognitionRef.current = rec;
} catch (err) {
console.warn('speech init failed', err);
alert('Failed to initialize speech recognition.');
}
};

const stopRecognition = () => {
const rec = recognitionRef.current;
if (rec) {
try { rec.stop(); } catch (e) {}
recognitionRef.current = null;
}
setRecording(false);
setInterim('');
};

const pushTranslation = (spokenTranslation) => {
const score = calculateScore(spokenTranslation, currentSentence.expected);
const newTrans = { id: `t${Date.now()}`, original: currentSentence.original, translation: spokenTranslation, score, datetime: new Date().toISOString() };
setTranslations((s) => [newTrans, ...(s || [])].slice(0, 6));
setCurrentSentence(data.sentencesToTranslate[Math.floor(Math.random() * data.sentencesToTranslate.length)]);
try { onUtterance(spokenTranslation); } catch (e) { /* ignore */ }
};

const calculateScore = (spoken, expected) => {
// Simple similarity score (in real app, use better algorithm)
const spokenWords = spoken.toLowerCase().split(' ');
const expectedWords = expected.toLowerCase().split(' ');
const match = spokenWords.filter(word => expectedWords.includes(word)).length;
return Math.round((match / expectedWords.length) * 100);
};

/* ---------- UI helpers ---------- */
const toggleMic = () => {
if (recording) stopRecognition();
else startRecognition();
};

const handleManualSubmit = (e) => {
e.preventDefault();
const t = e.target.elements['manual'].value.trim();
if (t) {
pushTranslation(t);
e.target.reset();
}
};

/* ---------- Chart rendering ---------- */
const ChartArea = () => {
if (Recharts) {
const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Area, CartesianGrid, Legend } = Recharts;
return (
<div style={{ width: '100%', height: '100%' }}>
<ResponsiveContainer>
<LineChart data={data.trends}>
<defs>
<linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
<stop offset="5%" stopColor="#60a5fa" stopOpacity={0.6}/>
<stop offset="95%" stopColor="#60a5fa" stopOpacity={0.05}/>
</linearGradient>
</defs>
<CartesianGrid stroke="rgba(255,255,255,0.03)" />
<XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize:12 }} />
<YAxis yAxisId="left" orientation="left" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize:12 }} />
<YAxis yAxisId="right" orientation="right" tick={false} />
<Tooltip wrapperStyle={{ background: 'rgba(11,18,32,0.9)', borderRadius:8, border:'none' }} contentStyle={{ color:'#fff' }} />
<Legend wrapperStyle={{ color: 'rgba(255,255,255,0.8)' }} />
<Area yAxisId="left" type="monotone" dataKey="words" stroke="#06b6d4" fill="url(#g1)" />
<Line yAxisId="left" type="monotone" dataKey="score" stroke="#60a5fa" strokeWidth={3} dot={{ r: 2 }} />
</LineChart>
</ResponsiveContainer>
</div>
);
}
// fallback
const pointsScore = data.trends.map((d, i) => `${(i/(data.trends.length-1))*100},${100 - (d.score/100)*80}`).join(' ');
const pointsWords = data.trends.map((d, i) => `${(i/(data.trends.length-1))*100},${100 - (Math.min(d.words, 3000)/3000)*80}`).join(' ');
return (
<svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width:'100%', height:'100%' }}>
<polyline points={pointsWords} fill="none" stroke="#06b6d4" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
<polyline points={pointsScore} fill="none" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
</svg>
);
};

/* Donut */
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
<div className="card">
<div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
<div>
<div style={{ fontSize:12, color:'var(--muted)', fontWeight:700 }}>Overview</div>
<div style={{ fontSize:18, fontWeight:800 }}>Your Translation Summary</div>
</div>
<div style={{ textAlign:'right', color:'var(--muted)', fontSize:12 }}>
<div>Last updated: {new Date().toLocaleString()}</div>
</div>
</div>

<div className="stats-grid" style={{ marginTop:6 }}>
<div className="stat card" style={{ padding:12 }}>
<div className="label">Translation Points Earned</div>
<div className="value">{formatNumber(displayCounts.translationPoints)}</div>
<div className="small">Points collected across sessions</div>
</div>

<div className="stat card" style={{ padding:12, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
<div className="label">Average Score</div>
<div style={{ marginTop:6 }}><Donut percent={data.averageScore} /></div>
<div className="small" style={{ marginTop:8 }}>Goal: 85%</div>
</div>

<div className="stat card" style={{ padding:12 }}>
<div className="label">Total Translations Done</div>
<div className="value">{formatNumber(displayCounts.totalTranslations)}</div>
<div className="small">Trend: {Math.random() > 0.5 ? '▲' : '▼'} {Math.round(1 + Math.random()*8)}% vs last month</div>
</div>

<div className="stat card" style={{ padding:12 }}>
<div className="label">Number of Words Translated</div>
<div className="value">{formatNumber(displayCounts.wordsTranslated)}</div>
<div className="small">Words across all sessions</div>
</div>
</div>
</div>

<div className="card mic-area" role="region" aria-label="Translation chatbot" style={{ minHeight:'600px' }}>
<div style={{ fontWeight:700, fontSize:20, marginBottom:10 }}>Translation Bot</div>
<div style={{ fontSize:15, color:'var(--muted)', marginBottom:20 }}>Translate the sentence and speak clearly</div>

<div style={{ marginBottom:20, padding:16, background:'rgba(255,255,255,0.02)', borderRadius:8 }}>
<div style={{ fontSize:16, fontWeight:600, marginBottom:8 }}>Translate to Spanish:</div>
<div style={{ fontSize:18, color:'var(--text-color)' }}>{currentSentence.original}</div>
</div>

<div style={{ marginTop:20, display:'flex', flexDirection:'column', alignItems:'center', gap:20 }}>
<div style={{ minHeight:50, fontSize:16, textAlign:'center', padding:'10px' }}>
{recording ?
<div style={{ color:'#4ade80', fontWeight:600 }}>🎙️ Listening... Speak your translation!</div> :
interim ?
<div style={{ color:'var(--muted)', fontStyle:'italic' }}>Processing: "{interim}"</div> :
<div style={{ color:'var(--muted)' }}>Ready to translate - Click the mic!</div>
}
</div>

<button
className={`mic-btn ${recording ? 'recording' : ''}`}
aria-label={recording ? 'Stop recording' : 'Start recording'}
aria-pressed={recording}
onClick={toggleMic}
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
<div className="waveform" aria-hidden style={{ marginTop:10 }}>
<span style={{ height:12 }} />
<span style={{ height:24 }} />
<span style={{ height:18 }} />
<span style={{ height:30 }} />
<span style={{ height:16 }} />
</div>
)}

<form onSubmit={handleManualSubmit} style={{ marginTop:20, display: 'flex', gap:10, width:'100%' }}>
<input
aria-label="Type translation if speech not available"
name="manual"
placeholder="Or type your translation here..."
style={{
flex:1,
borderRadius:12,
padding:'12px 16px',
border:'none',
background:'rgba(255,255,255,0.08)',
color:'inherit',
fontSize:14
}}
/>
<button type="submit" className="small-btn" style={{ minWidth:80, padding:'12px 16px', borderRadius:12, background:'var(--accent)', color:'white' }}>Submit</button>
</form>

<div style={{ width:'100%', marginTop:20 }}>
<div style={{ fontSize:14, color:'var(--muted)', marginBottom:10, fontWeight:600 }}>Recent Translations</div>
<div className="utter-list" role="list" style={{ maxHeight:'200px', overflowY:'auto' }}>
{translations.length ? translations.map((t) => (
<div key={t.id} className="utter-item" role="listitem" style={{ padding:'12px', borderRadius:10, marginBottom:8 }}>
<div style={{ textAlign:'left', maxWidth:'75%' }}>
<div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>{t.original}</div>
<div style={{ fontSize:12, color:'var(--muted)', marginBottom:4 }}>→ {t.translation}</div>
<div style={{ fontSize:12, color:'var(--muted)' }}>{new Date(t.datetime).toLocaleString()}</div>
</div>
<div style={{ textAlign:'right' }}>
<div style={{ fontWeight:800, fontSize:16, color:'#4ade80' }}>{t.score ?? '-'}</div>
<div style={{ fontSize:11, color:'var(--muted)' }}>score</div>
</div>
</div>
)) : <div style={{ color:'var(--muted)', textAlign:'center', padding:20 }}>No translations yet - Start translating!</div>}
</div>
</div>
</div>
</div>
</div>

<div className="jam-right">
<div className="card" style={{ minHeight:320 }}>
<div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
<div>
<div style={{ fontWeight:700 }}>Performance Over Time</div>
<div style={{ fontSize:13, color:'var(--muted)' }}>Score & Words — last {data.trends.length} days</div>
</div>
<div style={{ fontSize:13, color:'var(--muted)' }}>
<small>Interactive</small>
</div>
</div>

<div className="chart-area card" style={{ padding:8 }}>
<ChartArea />
</div>
</div>
</div>
</div>
</div>
</div>
);
}
