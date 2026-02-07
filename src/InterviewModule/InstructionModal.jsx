import React from "react";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";

const InstructionModal = ({
    isOpen,
    instructions,
    currentIndex,
    onNext,
    onPrev,
    onSkip,
    onLaunch,
    onClose,
    variant = "practice",
}) => {
    const isLast = currentIndex >= instructions.length - 1;
    const isTest = variant === "test";

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-card rounded-2xl overflow-hidden shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="p-8">
                    <div className="flex gap-1.5 mb-6">
                        {instructions.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 rounded-full transition-all ${
                                    i === currentIndex
                                        ? `flex-[2] ${isTest ? "bg-accent" : "bg-primary"}`
                                        : i < currentIndex
                                        ? `flex-1 ${isTest ? "bg-accent/30" : "bg-primary/30"}`
                                        : "flex-1 bg-muted"
                                }`}
                            />
                        ))}
                    </div>

                    <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                        {instructions[currentIndex]?.title}
                    </h2>

                    <div className="text-sm text-muted-foreground leading-relaxed mb-8 min-h-[120px]">
                        {instructions[currentIndex]?.content}
                    </div>

                    <div className="flex items-center gap-3">
                        {currentIndex > 0 && (
                            <button
                                onClick={onPrev}
                                className="flex items-center gap-1 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground bg-muted transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </button>
                        )}

                        <div className="flex-1" />

                        {!isLast ? (
                            <>
                                <button
                                    onClick={onSkip}
                                    className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Skip
                                </button>
                                <button
                                    onClick={onNext}
                                    className={`flex items-center gap-1 px-5 py-2.5 rounded-lg text-sm font-semibold text-primary-foreground transition-colors ${
                                        isTest ? "bg-accent text-accent-foreground" : "bg-primary"
                                    }`}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onLaunch}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                                    isTest
                                        ? "bg-accent text-accent-foreground hover:opacity-90"
                                        : "bg-primary text-primary-foreground hover:opacity-90"
                                }`}
                            >
                                <Play className="w-4 h-4" />
                                {isTest ? "START TEST" : "START PRACTICE"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructionModal;
