import React, { useState } from 'react';
import './ProfileCreation.css';

const ProfileCreation = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    dateOfBirth: '',
    gender: '',
    collegeEmail: '',
    personalEmail: '',
    mobileNumber: '',
    profilePicture: null,
    collegeName: '',
    rollNumber: '',
    branch: '',
    year: '',
    englishLevel: '',
    timeAvailable: '',
    communicationGoals: '',
    otherGoals: '',
    speakingLevel: '',
    speakingFrequency: '',
    notSpeakingReasons: '',
    otherReasons: ''
  });

  const [currentSection, setCurrentSection] = useState(0);
  const [currentSurveyCard, setCurrentSurveyCard] = useState(0);
  const [profilePreview, setProfilePreview] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-advance survey cards when answered
    if (currentSection === 2) {
      const surveyFields = ['englishLevel', 'timeAvailable', 'communicationGoals', 'speakingFrequency'];
      const currentField = surveyFields[currentSurveyCard];
      if (name === currentField && currentSurveyCard < surveyFields.length - 1) {
        setTimeout(() => setCurrentSurveyCard(prev => prev + 1), 500);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }));
      const reader = new FileReader();
      reader.onload = (e) => setProfilePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const sections = ['Personal Information', 'Academic Information', 'Communication Survey'];

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      if (currentSection + 1 === 2) setCurrentSurveyCard(0);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if all survey questions are answered
    const surveyFields = ['englishLevel', 'timeAvailable', 'communicationGoals', 'speakingFrequency'];
    const allAnswered = surveyFields.every(field => formData[field]);
    
    if (allAnswered) {
      setIsCompleted(true);
      setTimeout(() => {
        window.location.href = '/signup';
      }, 3000);
    }
  };

  const surveyQuestions = [
    {
      id: 'englishLevel',
      title: 'What\'s your English proficiency level?',
      options: ['Beginner', 'Intermediate', 'Advanced']
    },
    {
      id: 'timeAvailable',
      title: 'How much time can you dedicate daily?',
      options: [
        { value: 'less-30', label: 'Less than 30 mins' },
        { value: '30-60', label: '30 mins – 1 hr' },
        { value: 'more-60', label: 'More than 1 hr' }
      ]
    },
    {
      id: 'communicationGoals',
      title: 'What are your communication goals?',
      options: ['Public Speaker', 'Interview Prep', 'Confidence Boost', 'Good English Speaker']
    },
    {
      id: 'speakingFrequency',
      title: 'How often do you practice speaking?',
      options: ['Daily', '2–3 Days Once', 'No']
    }
  ];

  return (
    <div className="profile-creation-container">
      {/* <div className="skill-route-header">
        <div className="logo-container">
          <div className="logo">
            <span className="logo-text">Skill Route</span>
            <div className="logo-icon">🚀</div>
          </div>
        </div>
      </div> */}
      
      <div className="profile-layout">
        <div className="form-main">
          <div className="progress-header">
            <h1>Complete Your Profile</h1>
            <p className="subtitle">Help us personalize your learning journey</p>
            <div className="progress-bar">
              {sections.map((section, index) => (
                <div key={index} className={`progress-step ${index <= currentSection ? 'active' : ''}`}>
                  <span className="step-number">{index + 1}</span>
                  <span className="step-label">{section}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            {currentSection === 0 && (
              <div className="form-section">
                <div className="section-card">
                  <h2>Personal Information</h2>
                  <div className="form-grid">
                    <div className="input-group">
                      <label>Full Name *</label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Enter your full name" required />
                    </div>
                    <div className="input-group">
                      <label>Username *</label>
                      <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Choose a unique username" required />
                    </div>
                    <div className="input-group">
                      <label>Date of Birth *</label>
                      <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                      <label>Gender *</label>
                      <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>College Email ID *</label>
                      <input type="email" name="collegeEmail" value={formData.collegeEmail} onChange={handleInputChange} placeholder="your.email@college.edu" required />
                    </div>
                    <div className="input-group">
                      <label>Personal Email ID</label>
                      <input type="email" name="personalEmail" value={formData.personalEmail} onChange={handleInputChange} placeholder="your.personal@email.com" />
                    </div>
                    <div className="input-group">
                      <label>Mobile Number *</label>
                      <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} placeholder="+91 9876543210" required />
                    </div>
                    <div className="input-group profile-upload">
                      <label>Profile Picture</label>
                      <div className="upload-area">
                        {profilePreview ? (
                          <img src={profilePreview} alt="Profile Preview" className="profile-preview" />
                        ) : (
                          <div className="upload-placeholder">
                            <span>📷</span>
                            <p>Upload Photo</p>
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentSection === 1 && (
              <div className="form-section">
                <div className="section-card">
                  <h2>Academic Information</h2>
                  <div className="form-grid">
                    <div className="input-group">
                      <label>College Name *</label>
                      <select name="collegeName" value={formData.collegeName} onChange={handleInputChange} required>
                        <option value="">Select Your College</option>
                        <option value="iit-delhi">IIT Delhi</option>
                        <option value="iit-bombay">IIT Bombay</option>
                        <option value="nit-trichy">NIT Trichy</option>
                        <option value="bits-pilani">BITS Pilani</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>College Roll Number *</label>
                      <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleInputChange} placeholder="Enter your roll number" required />
                    </div>
                    <div className="input-group">
                      <label>Branch *</label>
                      <select name="branch" value={formData.branch} onChange={handleInputChange} required>
                        <option value="">Select Branch</option>
                        <option value="cse">Computer Science Engineering</option>
                        <option value="it">Information Technology</option>
                        <option value="ece">Electronics & Communication</option>
                        <option value="eee">Electrical & Electronics</option>
                        <option value="mech">Mechanical Engineering</option>
                        <option value="civil">Civil Engineering</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Year *</label>
                      <select name="year" value={formData.year} onChange={handleInputChange} required>
                        <option value="">Select Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentSection === 2 && (
              <div className="form-section">
                <div className="survey-container">
                  <div className="survey-progress">
                    <span className="survey-counter">{currentSurveyCard + 1} of {surveyQuestions.length}</span>
                    <div className="survey-progress-bar">
                      <div 
                        className="survey-progress-fill" 
                        style={{ width: `${((currentSurveyCard + 1) / surveyQuestions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="survey-cards-container">
                    {surveyQuestions.map((question, index) => (
                      <div 
                        key={question.id}
                        className={`survey-card-modern ${
                          index === currentSurveyCard ? 'active' : 
                          index < currentSurveyCard ? 'completed' : 'upcoming'
                        }`}
                      >
                        <div className="card-header">
                          <div className="question-number">{index + 1}</div>
                          <h3>{question.title}</h3>
                        </div>
                        
                        <div className="options-container">
                          {question.options.map((option) => {
                            const value = typeof option === 'string' ? option.toLowerCase() : option.value;
                            const label = typeof option === 'string' ? option : option.label;
                            const isChecked = formData[question.id] === value;
                            
                            return (
                              <label key={value} className={`modern-option ${isChecked ? 'selected' : ''}`}>
                                <input 
                                  type="radio" 
                                  name={question.id} 
                                  value={value} 
                                  checked={isChecked}
                                  onChange={handleInputChange} 
                                />
                                <div className="option-content">
                                  <div className="radio-indicator"></div>
                                  <span>{label}</span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                        
                        {question.id === 'communicationGoals' && (
                          <input 
                            type="text" 
                            name="otherGoals" 
                            value={formData.otherGoals} 
                            onChange={handleInputChange} 
                            placeholder="Tell us about other goals..." 
                            className="other-goals-input" 
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="form-navigation">
              {currentSection > 0 && (
                <button type="button" onClick={prevSection} className="btn-secondary">
                  <span>←</span> Previous
                </button>
              )}
              {currentSection < sections.length - 1 ? (
                <button type="button" onClick={nextSection} className="btn-primary">
                  Next <span>→</span>
                </button>
              ) : (
                <button type="submit" className={`btn-complete ${isCompleted ? 'completed' : ''}`}>
                  {isCompleted ? (
                    <>
                      <span className="checkmark">✓</span>
                      Profile Created!
                    </>
                  ) : (
                    <>
                      <span className="sparkle">✨</span>
                      Complete Profile
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="info-sidebar">
          <div className="info-card">
            <div className="card-glow"></div>
            <h3>🌟 Why complete this?</h3>
            <div className="benefits">
              <div className="benefit-item">
                <div className="benefit-icon">🎯</div>
                <div className="benefit-content">
                  <h4>Personalized Learning</h4>
                  <p>AI-powered recommendations tailored just for you</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🔒</div>
                <div className="benefit-content">
                  <h4>Secure & Private</h4>
                  <p>Your data is encrypted and never shared</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">📈</div>
                <div className="benefit-content">
                  <h4>Track Progress</h4>
                  <p>Visual insights into your skill development</p>
                </div>
              </div>
            </div>
            
            <div className="trust-indicators">
              <div className="trust-item">
                <span>🏆</span>
                <small>Trusted by 10K+ students</small>
              </div>
              <div className="trust-item">
                <span>⚡</span>
                <small>Takes only 2 minutes</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isCompleted && (
        <div className="success-overlay">
          <div className="success-animation">
            <div className="success-circle">
              <div className="checkmark-animation">✓</div>
            </div>
            <h2>Welcome to Skill Route! 🎉</h2>
            <p>Your profile has been created successfully</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCreation;