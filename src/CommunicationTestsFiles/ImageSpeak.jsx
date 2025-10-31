import React, { useState, useEffect } from 'react';

function ImageSpeak() {
  const [recording, setRecording] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [vocabInput, setVocabInput] = useState('');
  const [vocabTags, setVocabTags] = useState(['Cityscape', 'Buildings', 'Cars', 'Street', 'Urban']);
  const [timer, setTimer] = useState({ minutes: 1, seconds: 0 });
  const [activeTab, setActiveTab] = useState('ImageSpeak Dashboard');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [sessionId] = useState(`image-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`);
  const [userEmail] = useState(localStorage.getItem('email') || '22691a2828@mits.ac.in');

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
      img.crossOrigin = 'anonymous';
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

      const prompt = JSON.parse(promptData.body).response;
      console.log('✅ Generated Prompt:', prompt);

      // Step 2: Generate image with sessionId
      console.log('🎨 Step 2: Generating image with prompt...');
      const imageRequestBody = {
        prompt: prompt,
        sessionId: sessionId, // Send sessionId to Lambda for consistent storage
        quality: 'premium',
        width: 1024,
        height: 1024,
        cfg_scale: 8.0,
        number_of_images: 1,
        negative_prompts: ['blurry', 'low quality', 'distorted', 'text', 'watermark'],
        action: 'generate' // Specify action
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

      if (result.success && result.image_urls?.length > 0) {
        const imageUrl = result.image_urls[0];
        console.log('✅ Image Generated Successfully:', imageUrl);

        // Test if the image URL is accessible
        console.log('🔍 Testing image accessibility...');
        const isAccessible = await testImageUrl(imageUrl);

        if (isAccessible) {
          console.log('✅ Image is accessible, setting as generated image');
          setImageLoadError(false);
          setImageLoading(true);
          setGeneratedImage(imageUrl);
        } else {
          console.log('⚠️ Image URL not immediately accessible, but setting anyway');
          setImageLoadError(false);
          setImageLoading(true);
          setGeneratedImage(imageUrl);

          // Show a warning to user
          setTimeout(() => {
            if (imageLoading) {
              console.log('⚠️ Image taking longer than expected to load');
            }
          }, 5000);
        }
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
        {/* ImageSpeak Summary Section */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '700' }}>Overview</div>
              <div style={{ fontSize: '18px', fontWeight: '800' }}>Your ImageSpeak Summary</div>
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
            {generatedImage ? (
              <>
                {imageLoading && (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)' }}>
                    <span className="loading">⟳</span> Loading image...
                  </div>
                )}

                {imageLoadError ? (
                  <div style={{
                    color: '#ef4444',
                    textAlign: 'center',
                    padding: '40px 20px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}>
                    <p style={{ marginBottom: '16px', fontSize: '16px' }}>⚠️ Image failed to load</p>
                    <p style={{ marginBottom: '20px', fontSize: '14px', color: 'var(--muted)' }}>
                      This might be due to network issues, CORS restrictions, or AWS S3 access policies.
                    </p>
                    <details style={{ marginBottom: '16px', fontSize: '12px', color: 'var(--muted)' }}>
                      <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>🔍 Debug Info</summary>
                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '4px', wordBreak: 'break-all' }}>
                        <strong>Image URL:</strong><br />
                        {generatedImage}
                      </div>
                    </details>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => {
                          setImageLoadError(false);
                          setImageLoading(true);
                          // Force reload with timestamp
                          const img = new Image();
                          img.onload = () => {
                            setImageLoading(false);
                            setGeneratedImage(generatedImage + '&reload=' + Date.now());
                          };
                          img.onerror = () => {
                            setImageLoading(false);
                            setImageLoadError(true);
                          };
                          img.src = generatedImage + '&retry=' + Date.now();
                        }}
                        style={{
                          padding: '10px 20px',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      >
                        🔄 Retry Loading
                      </button>
                      <button
                        onClick={() => {
                          setGeneratedImage(null);
                          setImageLoadError(false);
                          setImageLoading(false);
                          generateImage();
                        }}
                        style={{
                          padding: '10px 20px',
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      >
                        🎨 Generate New Image
                      </button>
                      <button
                        onClick={() => {
                          // Use a fallback placeholder image
                          setGeneratedImage('https://via.placeholder.com/1024x1024/4f46e5/ffffff?text=Practice+Image');
                          setImageLoadError(false);
                          setImageLoading(false);
                        }}
                        style={{
                          padding: '10px 20px',
                          background: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      >
                        📷 Use Placeholder
                      </button>
                    </div>
                  </div>
                ) : (
                  <img
                    src={generatedImage}
                    alt="Generated image for speaking practice"
                    className="practice-image"
                    style={{ display: imageLoading ? 'none' : 'block' }}
                    onLoad={() => {
                      console.log('🖼️ Image loaded successfully:', generatedImage);
                      setImageLoading(false);
                      setImageLoadError(false);
                    }}
                    onError={(e) => {
                      console.log('❌ Image failed to load:', e.target.src);
                      setImageLoading(false);
                      setImageLoadError(true);
                    }}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                  />
                )}

                {!imageLoading && !imageLoadError && (
                  <p className="instruction">
                    Describe the image in as much detail as possible. You have 60 seconds.
                  </p>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button 
                    className="generate-btn" 
                    onClick={async () => {
                      // First try to retrieve existing image
                      const existingImageFound = await retrieveExistingImage();
                      if (!existingImageFound) {
                        // If no existing image, generate new one
                        generateImage();
                      }
                    }} 
                    disabled={isGenerating}
                    style={{ fontSize: '18px', padding: '16px 32px' }}
                  >
                    {isGenerating ? (
                      <><span className="loading">⟳</span> Loading Image...</>
                    ) : (
                      '🖼️ Get Practice Image'
                    )}
                  </button>
                  
                  <button 
                    className="generate-btn" 
                    onClick={generateImage} 
                    disabled={isGenerating}
                    style={{ 
                      fontSize: '16px', 
                      padding: '12px 24px', 
                      background: 'linear-gradient(135deg, #6366f1, #4f46e5)' 
                    }}
                  >
                    {isGenerating ? (
                      <><span className="loading">⟳</span> Generating...</>
                    ) : (
                      '🎨 Generate New'
                    )}
                  </button>
                </div>
                <p className="instruction" style={{ marginTop: '20px' }}>
                  Click "Get Practice Image" to load your session image, or "Generate New" for a fresh image.
                </p>
              </div>
            )}
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

export default ImageSpeak;
