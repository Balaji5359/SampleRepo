import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Target } from "lucide-react";
import InterviewCard from "./InterviewCard";
import InstructionModal from "./InstructionModal";
import "./interview-clone-theme.css";
import useInterviewUserInfo from "./useInterviewUserInfo";

const buildInstructions = () => ([
    {
        title: "Interview Test Rules",
        content: (
            <div className="space-y-3">
                <p>This is a <strong>formal interview test</strong> with <strong>Tara AI</strong>.</p>
                <p><strong>Professional evaluation</strong> with strict assessment criteria.</p>
                <p><strong>Timed responses</strong> - answer within given time limits.</p>
            </div>
        ),
    },
    {
        title: "Test Environment",
        content: (
            <div className="space-y-3">
                <p><strong>Fullscreen mode required</strong> during the test.</p>
                <p><strong>No tab switching</strong> allowed - test will terminate.</p>
                <p><strong>Professional setting</strong> required at all times.</p>
            </div>
        ),
    },
    {
        title: "Evaluation Criteria",
        content: (
            <div className="space-y-3">
                <p><strong>Content quality</strong> and relevance are evaluated.</p>
                <p><strong>Communication skills</strong> and clarity are scored.</p>
                <p><strong>Tara AI</strong> provides detailed scoring and certificates.</p>
            </div>
        ),
    },
]);

function InterviewTest() {
    const [interviews, setInterviews] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [instructionIndex, setInstructionIndex] = useState(0);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [premiumModalMessage, setPremiumModalMessage] = useState("");
    const navigate = useNavigate();
    const { userType, streakData, email, isPremium } = useInterviewUserInfo();

    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        if (!storedEmail) {
            setLoading(false);
            return;
        }

        fetch(import.meta.env.VITE_STUDENT_PROFILE_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ college_email: storedEmail }),
        })
            .then(async (profileResponse) => {
                const profileData = await profileResponse.json();

                if (profileData?.body) {
                    const parsedProfileData = typeof profileData.body === "string" ? JSON.parse(profileData.body) : profileData.body;
                    setInterviews(parsedProfileData.interviews || {});
                }

                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const basicInterviews = [
        { id: 1, title: "Self Introduction", count: interviews.self_intro || 3 },
        { id: 2, title: "Programming Knowledge", count: interviews.programming || 3 },
        { id: 3, title: "Worked Domain", count: interviews.domain || 3 },
        { id: 4, title: "Project Discussion", count: interviews.project || 3 },
        { id: 5, title: "Future Career Planning", count: interviews.career || 3 },
        { id: 6, title: "Hobbies & Interests", count: interviews.hobbies || 3 },
        { id: 7, title: "Certifications Exploration", count: interviews.certifications || 3 },
        { id: 8, title: "Project Reviews", count: interviews.project_reviews || 3}
    ];

    const advancedInterviews = [
        { id: 8, title: "Role-Based Interview", count: interviews.role_based || 3 },
        { id: 9, title: "Resume-Based Interview", count: interviews.resume_based || 3 },
        { id: 10, title: "Technical Interview", count: interviews.technical || 3 },
        { id: 11, title: "Follow-Up Questioning", count: interviews.follow_up || 3 },
        { id: 12, title: "Stress/Pressure Questions", count: interviews.stress || 3 },
        { id: 13, title: "Logical Puzzles", count: interviews.puzzles || 3 },
    ];

    const instructions = buildInstructions();

    const handleLaunch = () => {
        const all = [...basicInterviews, ...advancedInterviews];
        const item = all.find((i) => i.id === activeChallenge);
        navigate("/interview/session", {
            state: {
                interviewId: activeChallenge,
                interviewTitle: item?.title,
                remainingTests: item?.count || 0,
                mode: "test",
                interviewType: "basic-interview",
            },
        });
    };

    const openPremiumModal = (message) => {
        setPremiumModalMessage(message);
        setShowPremiumModal(true);
    };

    if (loading) {
        return (
            <div className="app-loading-container app-bg-free">
                <div className="app-loading-spinner"></div>
                <p>Loading interview tests...</p>
            </div>
        );
    }

    return (
        <div className="interview-theme min-h-screen bg-background">
            <div className="sticky top-0 z-40 glass border-b border-border">
                <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center gap-4 flex-wrap">
                    <button
                        onClick={() => navigate("/interview")}
                        className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                            <Target className="w-4 h-4 text-accent" />
                        </div>
                        <h1 className="font-heading text-lg font-bold text-foreground">Interview Test</h1>
                    </div>
                    <div className="ml-auto flex items-center gap-2 flex-wrap">
                        <span className="interview-badge accent">Test</span>
                        <span className="interview-badge">Streak: {streakData.current_streak || 0}</span>
                        <span className={`interview-badge ${isPremium ? "accent" : ""}`}>
                            {userType === "premium" ? "Premium" : "Free"}
                        </span>
                        {email && <span className="interview-badge">{email}</span>}
                    </div>
                </div>
            </div>

            <div className="container max-w-6xl mx-auto px-4 py-8">
                <div className="text-center mb-10">
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
                        Test with TaraAI
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Professional interview evaluation with strict assessment criteria, <br></br>detailed scoring and reports viewed by real mentors.
                    </p>
                </div>

                <div className="mb-12">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent" />
                        Basic Interview Tests
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {basicInterviews.map((item, i) => (
                            <InterviewCard
                                key={item.id}
                                {...item}
                                index={i}
                                variant="test"
                                locked={!isPremium && item.count === 0}
                                lockedLabel="BUY PREMIUM"
                                onStart={() => {
                                    if (!isPremium && item.count === 0) {
                                        openPremiumModal("No remaining test sessions. Upgrade to Premium to get more interview tests.");
                                        return;
                                    }
                                    if (item.count === 0) return;
                                    setActiveChallenge(item.id);
                                    setInstructionIndex(0);
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="mb-12">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent" />
                        Advanced Interview Tests
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {advancedInterviews.map((item, i) => (
                            <InterviewCard
                                key={item.id}
                                {...item}
                                index={i}
                                variant="test"
                                comingSoon={true}
                                onStart={() => {}}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <InstructionModal
                isOpen={activeChallenge !== null}
                instructions={instructions}
                currentIndex={instructionIndex}
                onNext={() => setInstructionIndex((i) => Math.min(i + 1, instructions.length - 1))}
                onPrev={() => setInstructionIndex((i) => Math.max(i - 1, 0))}
                onSkip={() => setInstructionIndex(instructions.length - 1)}
                onLaunch={handleLaunch}
                onClose={() => setActiveChallenge(null)}
                variant="test"
            />

            {showPremiumModal && (
                <div className="interview-modal-overlay" onClick={() => setShowPremiumModal(false)}>
                    <div className="interview-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="interview-modal-header">
                            <span>Premium Access</span>
                            <button
                                onClick={() => setShowPremiumModal(false)}
                                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            >
                                X
                            </button>
                        </div>
                        <div className="interview-modal-body">
                            <p className="text-sm text-muted-foreground">{premiumModalMessage}</p>
                        </div>
                        <div className="interview-modal-actions">
                            <button
                                onClick={() => setShowPremiumModal(false)}
                                className="px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => navigate("/profiledata")}
                                className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                            >
                                Buy Premium
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InterviewTest;
