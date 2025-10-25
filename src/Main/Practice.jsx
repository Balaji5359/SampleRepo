import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login_Navbar from "../RegisterFiles/Login_Navbar";
// import "./profile.css";
import '../LandingPageFiles/landing.css';
import "./Practice.css"


function Practice() {
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [instructionIndex, setInstructionIndex] = useState(0);
    const navigate = useNavigate();

    const practices = [
        { id: "jam", title: "JAM Practice", description: "Speak on a random topic for 60 seconds.", icon: "🎤" },
        { id: "image-speaking", title: "Image-Based Speaking", description: "Describe images.", icon: "🖼️" },
        { id: "situation-speak", title: "Situation-Based Speaking", description: "Practice translation.", icon: "🌐" },
        { id: "translate-speak", title: "Translate & Speak", description: "Practice translation.", icon: "📝" },
        { id: "story-building", title: "Image-Story Building", description: "Create stories.", icon: "📖" }
    ];

    const jamInstructions = [
        {
            title: "Instructions",
            content: "You've been given a random topic! You will have 1 minute to speak. Focus on fluency, clarity, and confidence. Don’t worry about perfection."
        },
        {
            title: "Fluency",
            content: "Maintain a smooth and uninterrupted flow of speech."
        },
        {
            title: "Grammar",
            content: "Use correct sentence structures and grammatical conventions."
        },
        {
            title: "Coherence & Structure",
            content: "Organize your thoughts in a clear and logical manner."
        },
        {
            title: "Confidence",
            content: "Speak with assurance and composure."
        },
        {
            title: "Vocabulary Usage",
            content: "Use a diverse and appropriate range of vocabulary."
        },
        {
            title: "How to Practice",
            content: (
                <iframe
                    width="100%"
                    height="250"
                    src="https://www.youtube.com/embed/ReZgqLI3Hq0"
                    title="How to Practice JAM Session"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            )
        }
    ];

    const pronunciationInstructions = [
        {
            title: "Instructions",
            content: "Improve your pronunciation by practicing words and sentences. Focus on clarity and accuracy."
        },
        {
            title: "Clarity",
            content: "Speak clearly, enunciating each sound."
        },
        {
            title: "Accuracy",
            content: "Pronounce words correctly."
        },
        {
            title: "Intonation",
            content: "Use appropriate intonation for questions and statements."
        },
        {
            title: "Fluency",
            content: "Practice speaking smoothly."
        },
        {
            title: "How to Practice",
            content: (
                <iframe
                    width="100%"
                    height="250"
                    src="https://www.youtube.com/embed/ReZgqLI3Hq0"
                    title="How to Practice Pronunciation"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            )
        }
    ];

    const imageSpeakingInstructions = [
        {
            title: "Instructions",
            content: "Describe the given image in detail. Speak for the allotted time."
        },
        {
            title: "Observation",
            content: "Note the key elements in the image."
        },
        {
            title: "Description",
            content: "Describe what you see."
        },
        {
            title: "Fluency",
            content: "Speak continuously."
        },
        {
            title: "Vocabulary",
            content: "Use descriptive words."
        },
        {
            title: "How to Practice",
            content: (
                <iframe
                    width="100%"
                    height="250"
                    src="https://www.youtube.com/embed/ReZgqLI3Hq0"
                    title="How to Practice Image Speaking"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            )
        }
    ];

    const translateSpeakInstructions = [
        {
            title: "Instructions",
            content: "Translate the given text and speak it aloud."
        },
        {
            title: "Translation",
            content: "Accurately translate the sentence."
        },
        {
            title: "Pronunciation",
            content: "Pronounce the translated text correctly."
        },
        {
            title: "Fluency",
            content: "Speak smoothly."
        },
        {
            title: "Confidence",
            content: "Speak with confidence."
        },
        {
            title: "How to Practice",
            content: (
                <iframe
                    width="100%"
                    height="250"
                    src="https://www.youtube.com/embed/ReZgqLI3Hq0"
                    title="How to Practice Translate & Speak"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            )
        }
    ];

    const situationSpeakInstructions = [
        {
            title: "Instructions",
            content: "Respond to real-life situations with appropriate communication. Practice workplace, social, and academic scenarios."
        },
        {
            title: "Context Understanding",
            content: "Analyze the given situation and understand the context before responding."
        },
        {
            title: "Appropriate Response",
            content: "Use suitable tone, vocabulary, and formality level for the situation."
        },
        {
            title: "Problem Solving",
            content: "Address the situation effectively with clear communication."
        },
        {
            title: "Confidence",
            content: "Speak with confidence and maintain composure in challenging situations."
        },
        {
            title: "How to Practice",
            content: (
                <iframe
                    width="100%"
                    height="250"
                    src="https://www.youtube.com/embed/ReZgqLI3Hq0"
                    title="How to Practice Situation-Based Speaking"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            )
        }
    ];

    const storyBuildingInstructions = [
        {
            title: "Instructions",
            content: "Build a story based on the given prompts."
        },
        {
            title: "Creativity",
            content: "Be creative in your storytelling."
        },
        {
            title: "Structure",
            content: "Organize your story with beginning, middle, end."
        },
        {
            title: "Fluency",
            content: "Speak fluently."
        },
        {
            title: "Vocabulary",
            content: "Use varied vocabulary."
        },
        {
            title: "How to Practice",
            content: (
                <iframe
                    width="100%"
                    height="250"
                    src="https://www.youtube.com/embed/ReZgqLI3Hq0"
                    title="How to Practice Story Building"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            )
        }
    ];

    const handleStartChallenge = (id) => {
        setActiveChallenge(id);
        setInstructionIndex(0);
    };

    const handleNext = () => {
        if (instructionIndex < jamInstructions.length - 1) {
            setInstructionIndex(instructionIndex + 1);
        }
    };

    const handlePrev = () => {
        if (instructionIndex > 0) {
            setInstructionIndex(instructionIndex - 1);
        }
    };

    const handleLaunchChallenge = () => {
        const routes = {
            jam: "/jam",
            pronunciation: "/pronunciation",
            "image-speaking": "/image-speak",
            "situation-speak": "/situation-speak",
            "translate-speak": "/translate-speak",
            "story-building": "/story-building"
        };
        navigate(routes[activeChallenge]);
    };

    return (
        <>
        //     <Login_Navbar />
            <div className="practice-container">
                <h1>Communication Practice Activities</h1>
                <div className={`practice-grid ${activeChallenge ? "blurred" : ""}`}>
                    {practices.map((practice) => (
                        <div
                            key={practice.id}
                            className="practice-card"
                            onClick={() => handleStartChallenge(practice.id)}
                        >
                            <div className="card-icon"><span>{practice.icon}</span></div>
                            <h3>{practice.title}</h3>
                            <p>{practice.description}</p>
                            <div className="card-footer">
                                <button className="start-btn">Start Challenge</button>
                                <span className="duration">01:00</span>
                            </div>
                        </div>
                    ))}
                </div>
                {activeChallenge === "pronunciation" && (
                <div className="overlay-card">
                    <div className="challenge-card">
                        <button className="close-btn" onClick={() => setActiveChallenge(null)}>✖</button>
                        <h2>{pronunciationInstructions[instructionIndex].title}</h2>
                        <div className="instruction-content">
                            {typeof pronunciationInstructions[instructionIndex].content === "string"
                                ? <p>{pronunciationInstructions[instructionIndex].content}</p>
                                : pronunciationInstructions[instructionIndex].content}
                        </div>
                        <div className="navigation-buttons">
                            {instructionIndex > 0 && <button onClick={handlePrev}>← Previous</button>}
                            
                            {instructionIndex < pronunciationInstructions.length - 1 ? (
                                <>
                                    <button onClick={handleNext}>Next →</button>
                                    <button onClick={() => setInstructionIndex(pronunciationInstructions.length - 1)}>Skip</button>
                                </>
                            ) : (
                                <button onClick={handleLaunchChallenge}>Start Challenge</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeChallenge === "image-speaking" && (
                <div className="overlay-card">
                    <div className="challenge-card">
                        <button className="close-btn" onClick={() => setActiveChallenge(null)}>✖</button>
                        <h2>{imageSpeakingInstructions[instructionIndex].title}</h2>
                        <div className="instruction-content">
                            {typeof imageSpeakingInstructions[instructionIndex].content === "string"
                                ? <p>{imageSpeakingInstructions[instructionIndex].content}</p>
                                : imageSpeakingInstructions[instructionIndex].content}
                        </div>
                        <div className="navigation-buttons">
                            {instructionIndex > 0 && <button onClick={handlePrev}>← Previous</button>}
                            
                            {instructionIndex < imageSpeakingInstructions.length - 1 ? (
                                <>
                                    <button onClick={handleNext}>Next →</button>
                                    <button onClick={() => setInstructionIndex(imageSpeakingInstructions.length - 1)}>Skip</button>
                                </>
                            ) : (
                                <button onClick={handleLaunchChallenge}>Start Challenge</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeChallenge === "translate-speak" && (
                <div className="overlay-card">
                    <div className="challenge-card">
                        <button className="close-btn" onClick={() => setActiveChallenge(null)}>✖</button>
                        <h2>{translateSpeakInstructions[instructionIndex].title}</h2>
                        <div className="instruction-content">
                            {typeof translateSpeakInstructions[instructionIndex].content === "string"
                                ? <p>{translateSpeakInstructions[instructionIndex].content}</p>
                                : translateSpeakInstructions[instructionIndex].content}
                        </div>
                        <div className="navigation-buttons">
                            {instructionIndex > 0 && <button onClick={handlePrev}>← Previous</button>}
                            
                            {instructionIndex < translateSpeakInstructions.length - 1 ? (
                                <>
                                    <button onClick={handleNext}>Next →</button>
                                    <button onClick={() => setInstructionIndex(translateSpeakInstructions.length - 1)}>Skip</button>
                                </>
                            ) : (
                                <button onClick={handleLaunchChallenge}>Start Challenge</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeChallenge === "situation-speak" && (
                <div className="overlay-card">
                    <div className="challenge-card">
                        <button className="close-btn" onClick={() => setActiveChallenge(null)}>✖</button>
                        <h2>{situationSpeakInstructions[instructionIndex].title}</h2>
                        <div className="instruction-content">
                            {typeof situationSpeakInstructions[instructionIndex].content === "string"
                                ? <p>{situationSpeakInstructions[instructionIndex].content}</p>
                                : situationSpeakInstructions[instructionIndex].content}
                        </div>
                        <div className="navigation-buttons">
                            {instructionIndex > 0 && <button onClick={handlePrev}>← Previous</button>}
                            
                            {instructionIndex < situationSpeakInstructions.length - 1 ? (
                                <>
                                    <button onClick={handleNext}>Next →</button>
                                    <button onClick={() => setInstructionIndex(situationSpeakInstructions.length - 1)}>Skip</button>
                                </>
                            ) : (
                                <button onClick={handleLaunchChallenge}>Start Challenge</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeChallenge === "story-building" && (
                <div className="overlay-card">
                    <div className="challenge-card">
                        <button className="close-btn" onClick={() => setActiveChallenge(null)}>✖</button>
                        <h2>{storyBuildingInstructions[instructionIndex].title}</h2>
                        <div className="instruction-content">
                            {typeof storyBuildingInstructions[instructionIndex].content === "string"
                                ? <p>{storyBuildingInstructions[instructionIndex].content}</p>
                                : storyBuildingInstructions[instructionIndex].content}
                        </div>
                        <div className="navigation-buttons">
                            {instructionIndex > 0 && <button onClick={handlePrev}>← Previous</button>}
                            
                            {instructionIndex < storyBuildingInstructions.length - 1 ? (
                                <>
                                    <button onClick={handleNext}>Next →</button>
                                    <button onClick={() => setInstructionIndex(storyBuildingInstructions.length - 1)}>Skip</button>
                                </>
                            ) : (
                                <button onClick={handleLaunchChallenge}>Start Challenge</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeChallenge === "jam" && (
                <div className="overlay-card">
                    <div className="challenge-card">
                        <button className="close-btn" onClick={() => setActiveChallenge(null)}>✖</button>
                        <h2>{jamInstructions[instructionIndex].title}</h2>
                        <div className="instruction-content">
                            {typeof jamInstructions[instructionIndex].content === "string"
                                ? <p>{jamInstructions[instructionIndex].content}</p>
                                : jamInstructions[instructionIndex].content}
                        </div>
                        <div className="navigation-buttons">
                            {instructionIndex > 0 && <button onClick={handlePrev}>← Previous</button>}

                            {instructionIndex < jamInstructions.length - 1 ? (
                                <>
                                    <button onClick={handleNext}>Next →</button>
                                    <button onClick={() => setInstructionIndex(jamInstructions.length - 1)}>Skip</button>
                                </>
                            ) : (
                                <button onClick={handleLaunchChallenge}>Start Challenge</button>
                            )}
                        </div>

                    </div>
                </div>
            )}
            </div>
        </>
    );
}

export default Practice;