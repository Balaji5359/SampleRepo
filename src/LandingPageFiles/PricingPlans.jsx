import React, { useState, useEffect } from 'react';

export default function PricingPlans() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    if (showPremiumModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPremiumModal]);

  const handleButtonClick = (planTag) => {
    if (planTag === "Free") {
      window.location.href = '/signup';
    } else {
      setShowPremiumModal(true);
    }
  };
  const plans = [
    {
      tag: "Free",
      price: "₹0",
      duration: "/Free Trail",
      button: "Try Free",
      highlight: false,
      features: [
        "2-Free Communication Tests - Basic Level",
        "1-Free trial for Image-Based Speaking",
        "1-Free trial for 3 Interview Modules - Basic",
        "Limited AI feedback and Speech Analytics",
        "Advanced interview & communication modules locked",
        "AI Feedback on Every Attempt",
        "Advanced analytics, Confident scores (Locked)",
        "Audio replay & AI pronunciation insights (Locked)",
        "Advanced analytics dashboard (Locked)",
        "Leaderboards & streak rewards (Locked)",
      ],
    },
    {
      tag: "1 Month",
      price: "₹99",
      duration: "/1 month",
      button: "Start 1-Month Plan",
      highlight: false,
      features: [
        "2 Communication Tests (Daily) - All Level",
        "1 Image-Based Speaking (Daily) - All Level",
        "TaraAI-guided 2 practice modules daily",
        "2-free trials for Image-Based Speaking",
        "Interview Modules Basic, Advance and communication all Levels - Unlock",
        "AI Feedback on Every Attempt",
        "Advanced analytics, Confident scores",
        "Audio replay & AI pronunciation insights",
        "Advanced analytics dashboard",
        "Leaderboards & streak rewards",
      ],
    },
    {
      tag: "Most Popular",
      price: "₹249",
      duration: "/3 months",
      button: "Upgrade Now",
      highlight: true,
      features: [
        "2 Communication Tests (Daily) - All Level",
        "1 Image-Based Speaking (Daily) - All Level",
        "TaraAI-guided 2 practice modules daily",
        "2-free trials for Image-Based Speaking",
        "Interview Modules Basic, Advance and communication all Levels - Unlock",
        "AI Feedback on Every Attempt",
        "Advanced analytics, Confident scores",
        "Audio replay & AI pronunciation insights",
        "Advanced analytics dashboard",
        "Leaderboards & streak rewards",
      ],
    },
    {
      tag: "Best Value",
      price: "₹699",
      duration: "/Year ✨",
      button: "Go Premium",
      highlight: false,
      features: [
        "2 Communication Tests (Daily) - All Level",
        "1 Image-Based Speaking (Daily) - All Level",
        "TaraAI-guided 2 practice modules daily",
        "2-free trials for Image-Based Speaking",
        "Interview Modules Basic, Advance and communication all Levels - Unlock",
        "AI Feedback on Every Attempt",
        "Advanced analytics, Confident scores",
        "Audio replay & AI pronunciation insights",
        "Advanced analytics dashboard",
        "Leaderboards & streak rewards",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20" style={{ backgroundColor: '#f1f6f6ff' }}>
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Learning Path
        </h2>
        <p className="text-lg text-gray-600 mb-16">
          Flexible plans designed for every learner's needs
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-2xl shadow-lg p-8 flex flex-col h-full ${
              plan.highlight
                ? "border-2 border-teal-500 scale-105 relative"
                : ""
            }`}
          >
            <div className="text-center mb-6">
              <span className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                {plan.tag}
              </span>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-base text-gray-500 ml-1">{plan.duration}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleButtonClick(plan.tag)}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-black transition-colors ${
                plan.highlight
                  ? "bg-teal-600 hover:bg-teal-700"
                  : "bg-teal-500 hover:bg-teal-600"
              }`}
            >
              {plan.button}
            </button>
          </div>
        ))}
      </div>

      {/* Premium Access Modal */}
      {showPremiumModal && (
        <div className="modal-overlay" onClick={() => setShowPremiumModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPremiumModal(false)}>×</button>
            <div className="modal-body">
              <h3>Premium Access Required</h3>
              <p>To access premium features and unlock your full learning potential, please follow our simple payment flow:</p>
              
              <div className="premium-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>New User?</h4>
                    <p>Sign up → Create Profile → Login → Access Profile & Buy Premium</p>
                  </div>
                </div>
                
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Existing User?</h4>
                    <p>Login → Access Profile Page → Buy Premium</p>
                  </div>
                </div>
              </div>
              
              <div className="premium-benefits">
                <h4>Premium Benefits:</h4>
                <ul>
                  <li>✓ Unlimited AI-powered practice sessions</li>
                  <li>✓ Advanced analytics & progress tracking</li>
                  <li>✓ All interview modules unlocked</li>
                  <li>✓ Premium feedback & pronunciation insights</li>
                </ul>
              </div>
              
              <button className="modal-btn" onClick={() => window.location.href = '/signup'}>
                Proceed to Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}