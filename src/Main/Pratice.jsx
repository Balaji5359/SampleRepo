import React from "react";
import { useNavigate } from "react-router-dom";
import "./Practice.css";

function Practice() {
    const navigate = useNavigate();

    const practices = [
        {
            id: "jam",
            title: "JAM Session",
            description: "Speak on a random topic for 60 seconds.",
            icon: "🎤",
            color: "primary"
        },
        {
            id: "pronunciation",
            title: "Pronunciation Test",
            description: "Improve your pronunciation with targeted exercises.",
            icon: "👂",
            color: "primary"
        },
        {
            id: "image-speaking",
            title: "Image-Based Speaking",
            description: "Describe images and enhance your descriptive skills.",
            icon: "🖼️",
            color: "primary"
        },
        {
            id: "translate-speak",
            title: "Translate & Speak",
            description: "Practice translation and speaking simultaneously.",
            icon: "🌐",
            color: "primary"
        },
        {
            id: "story-building",
            title: "Story Building",
            description: "Create engaging stories and expand your vocabulary.",
            icon: "📖",
            color: "primary"
        },
        {
            id: "vocabulary",
            title: "Vocabulary Builder",
            description: "Expand your word knowledge with interactive exercises.",
            icon: "📝",
            color: "primary"
        }
    ];

    return (
        <div className="practice-container">
            <br></br><br></br>
            <main className="main-content">
                <div className="content-header">
                    <h1>Practice Modules</h1>
                    <p>Choose a module to enhance your communication skills</p>
                </div>

                <div className="practice-grid">
                    {practices.map((practice) => (
                        <div
                            key={practice.id}
                            className="practice-card"
                            onClick={() => navigate(`/practice/${practice.id}`)}
                        >
                            <div className="card-icon">
                                <span>{practice.icon}</span>
                            </div>
                            <h3>{practice.title}</h3>
                            <p>{practice.description}</p>
                            <div className="card-footer">
                                <button className="start-btn">Start Challenge</button>
                                <span className="duration">01:00</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Practice;