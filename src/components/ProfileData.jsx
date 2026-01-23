import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';

function ProfileData() {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [streakData, setStreakData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [greeting, setGreeting] = useState("");
    const [motivationalQuote, setMotivationalQuote] = useState("");
    const [showPricingModal, setShowPricingModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const quotes = [
        "The limits of my language mean the limits of my world. - Ludwig Wittgenstein",
        "To have another language is to possess a second soul. - Charlemagne",
        "Language is the road map of a culture. - Rita Mae Brown",
        "Communication is the most important skill you can develop. - Warren Buffett",
        "The art of communication is the language of leadership. - James Humes"
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedEmail = localStorage.getItem("email");
                
                // Update daily test count
                await fetch('https://ntjkr8rnd6.execute-api.ap-south-1.amazonaws.com/dev/daily-testcount-update-api', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        body: {
                            college_email: storedEmail
                        }
                    })
                });
                
                const [profileResponse, streakResponse] = await Promise.all([
                    fetch(import.meta.env.VITE_STUDENT_PROFILE_API, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ college_email: storedEmail })
                    }),
                    fetch(import.meta.env.VITE_UPDATE_USER_STREAK_API, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            body: JSON.stringify({
                                college_email: storedEmail,
                                get_streak_data: true
                            })
                        })
                    })
                ]);

                // Check if responses are OK and contain JSON
                if (!profileResponse.ok) {
                    throw new Error(`Profile API failed: ${profileResponse.status}`);
                }
                if (!streakResponse.ok) {
                    throw new Error(`Streak API failed: ${streakResponse.status}`);
                }

                const profileText = await profileResponse.text();
                const streakText = await streakResponse.text();
                
                let profile, streak;
                try {
                    profile = JSON.parse(profileText);
                    streak = JSON.parse(streakText);
                } catch (parseError) {
                    console.error('JSON Parse Error:', parseError);
                    console.error('Profile Response:', profileText.substring(0, 200));
                    console.error('Streak Response:', streakText.substring(0, 200));
                    throw new Error('Invalid JSON response from API');
                }
                
                setProfileData(JSON.parse(profile.body));
                setStreakData(JSON.parse(streak.body));

                const hour = new Date().getHours();
                if (hour < 12) setGreeting("Good Morning");
                else if (hour < 17) setGreeting("Good Afternoon");
                else setGreeting("Good Evening");
                
                setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Set default data when API fails
                setProfileData({
                    full_name: "Student",
                    user_type: "free",
                    premium_status: "inactive"
                });
                setStreakData({
                    current_streak: 0,
                    longest_streak: 0,
                    active_dates: []
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const isPremium = profileData?.user_type === 'premium' && profileData?.premium_status === 'active';

    if (loading) {
        return (
            <div className="app-loading-container app-bg-free">
                <div className="app-loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="profile-container app-bg-free">
            <div className="profile-content">
                <GreetingCard 
                    greeting={greeting} 
                    name={profileData?.full_name} 
                    quote={motivationalQuote} 
                />
                
                <div className="profile-dashboard-grid">
                    {isPremium ? (
                        <>
                            <PremiumInfoCard 
                                plan={profileData.premium_plan} 
                                startDate={profileData.premium_start_date} 
                            />
                            <DaysLeftCard 
                                daysLeft={profileData.premium_days_left}
                                expiryDate={profileData.premium_expiry_date}
                            />
                        </>
                    ) : (
                        <FreeVsPremiumCard onUpgrade={() => setShowPricingModal(true)} />
                    )}
                    
                    <StreakCard 
                        currentStreak={streakData?.current_streak}
                        longestStreak={streakData?.longest_streak}
                    />
                </div>

                <div className="profile-dashboard-bottom">
                    <ActivityCalendar activeDates={streakData?.active_dates} />
                    <QuickActions navigate={navigate} />
                </div>
            </div>
            
            {showPricingModal && (
                <PricingModal 
                    onClose={() => setShowPricingModal(false)}
                    onSelectPlan={(plan) => {
                        setSelectedPlan(plan);
                        setShowPricingModal(false);
                        setShowPaymentModal(true);
                    }}
                />
            )}
            
            {showPaymentModal && selectedPlan && (
                <PaymentModal 
                    plan={selectedPlan}
                    onClose={() => {
                        setShowPaymentModal(false);
                        setSelectedPlan(null);
                    }}
                    profileData={profileData}
                />
            )}
        </div>
    );
}



const GreetingCard = ({ greeting, name, quote }) => (
    <div className="profile-greeting-card">
        <h1 className="profile-greeting-title">
            {greeting}, {name || "Student"}! <span>👋</span>
        </h1>
        <p className="profile-motivational-quote">"{quote}"</p>
    </div>
);

const PremiumInfoCard = ({ plan, startDate }) => (
    <div className="profile-premium-info-card">
        <div className="profile-premium-header">
            <div className="profile-premium-icon">👑</div>
            <h3>Premium Member</h3>
        </div>
        <p className="profile-premium-plan">Plan: {plan?.charAt(0).toUpperCase() + plan?.slice(1)}</p>
        <p className="profile-premium-date">Started: {new Date(startDate).toLocaleDateString()}</p>
    </div>
);

const DaysLeftCard = ({ daysLeft, expiryDate }) => (
    <div className="profile-days-left-card">
        <h3>Days Left</h3>
        <div className="profile-days-number">{daysLeft}</div>
        <p className="profile-expiry-date">Expires: {new Date(expiryDate).toLocaleDateString()}</p>
    </div>
);

const FreeVsPremiumCard = ({ onUpgrade }) => (
    <div className="profile-free-vs-premium-card">
        <h3>Free vs Premium</h3>
        <div className="profile-comparison-grid">
            <div className="profile-free-features">
                <h4>Free Plan</h4>
                <ul>
                    <li>• 2 tests - for trial</li>
                    <li>• Basic tests only</li>
                    <li>• Simple AI feedback</li>
                    <li>• Basic streak tracking</li>
                    <li>• No advanced analytics</li>
                </ul>
            </div>
            <div className="profile-premium-features">
                <h4>🌟 Premium Plan</h4>
                <ul>
                    <li>• Daily 2 tests of all Levels</li>
                    <li>• Advanced test types</li>
                    <li>• Detailed AI analysis, and audio feedback</li>
                    <li>• Advanced analytics & Badges</li>
                    <li>• All Levels Access</li>
                </ul>
            </div>
        </div>
        <button className="profile-upgrade-btn" onClick={onUpgrade}>Upgrade to Premium</button>
    </div>
);

const StreakCard = ({ currentStreak, longestStreak }) => (
    <div className="profile-streak-card">
        <h3>Daily Streak</h3>
        <div className="profile-streak-stats">
            <div className="profile-streak-item">
                <div className="profile-streak-number current">{currentStreak || 0}</div>
                <p>Current</p>
            </div>
            <div className="profile-streak-item">
                <div className="profile-streak-number longest">{longestStreak || 0}</div>
                <p>Longest</p>
            </div>
        </div>
    </div>
);

const ActivityCalendar = ({ activeDates }) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const activeDaysCount = activeDates?.filter(dateStr => {
        const date = new Date(dateStr);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length || 0;
    
    const calendarDays = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="profile-calendar-day empty"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isActive = activeDates?.includes(dateStr);
        const isToday = day === currentDate.getDate();
        
        calendarDays.push(
            <div
                key={day}
                className={`profile-calendar-day ${isActive ? 'active' : ''} ${isToday ? 'today' : ''}`}
                title={`${monthName} ${day}${isActive ? ' - Active' : ''}`}
            >
                {day}
            </div>
        );
    }
    
    return (
        <div className="profile-activity-calendar">
            <div className="profile-calendar-header">
                <h3>Activity Calendar</h3>
                <div className="profile-calendar-stats">
                    <span className="profile-month-name">{monthName}</span>
                    <span className="profile-active-count">{activeDaysCount} active days</span>
                </div>
            </div>
            
            <div className="profile-calendar-weekdays">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="profile-weekday-label">{day}</div>
                ))}
            </div>
            
            <div className="profile-calendar-grid-month">
                {calendarDays}
            </div>
        </div>
    );
};

const QuickActions = ({ navigate }) => (
    <div className="profile-quick-actions">
        <h3>Quick Actions</h3>
        <div className="profile-actions-grid">
            <button className="profile-action-btn" onClick={() => navigate('/test')}>
                <div className="profile-action-icon">🎤</div>
                <div className="profile-action-text">
                    <div className="profile-action-title">Start JAM Session</div>
                    <div className="profile-action-desc">Practice speaking skills</div>
                </div>
            </button>
            <button className="profile-action-btn" onClick={() => navigate('/test')}>
                <div className="profile-action-icon">🗣️</div>
                <div className="profile-action-text">
                    <div className="profile-action-title">Pronunciation Test</div>
                    <div className="profile-action-desc">Improve pronunciation</div>
                </div>
            </button>
            <button className="profile-action-btn" onClick={() => navigate('/student-dashboard')}>
                <div className="profile-action-icon">📊</div>
                <div className="profile-action-text">
                    <div className="profile-action-title">View Progress</div>
                    <div className="profile-action-desc">Check analytics</div>
                </div>
            </button>
        </div>
    </div>
);

const PricingModal = ({ onClose, onSelectPlan }) => {
    const plans = [
        {
            price: "₹99",
            title: "1 Month Premium",
            type: "monthly",
            features: [
                "2 Communication Tests (Daily) - All Level",
                "1 Image-Based Speaking (Daily) - All Level",
                "TaraAI-guided 2 practice modules daily",
                "2-free trails for Image-Based Speaking",
                "Interview Modules Basic, Advance and communication all Levels - Unlock",
                "AI Feedback on Every Attempt",
                "Advanced analytics, Confident scores",
                "Audio replay & AI pronunciation insights",
                "Advanced analytics dashboard",
                "Leaderboards & streak rewards"
            ]
        },
        {
            price: "₹249",
            title: "3 Month Premium",
            type: "quarterly",
            features: [
                "2 Communication Tests (Daily) - All Level",
                "1 Image-Based Speaking (Daily) - All Level",
                "TaraAI-guided 2 practice modules daily",
                "2-free trails for Image-Based Speaking",
                "Interview Modules Basic, Advance and communication all Levels - Unlock",
                "AI Feedback on Every Attempt",
                "Advanced analytics, Confident scores",
                "Audio replay & AI pronunciation insights",
                "Advanced analytics dashboard",
                "Leaderboards & streak rewards"
            ]
        },
        {
            price: "₹799",
            title: "12 Month Premium 🌟",
            type: "yearly",
            badge: "Best Value",
            features: [
                "2 Communication Tests (Daily) - All Level",
                "1 Image-Based Speaking (Daily) - All Level",
                "TaraAI-guided 2 practice modules daily",
                "2-free trails for Image-Based Speaking",
                "Interview Modules Basic, Advance and communication all Levels - Unlock",
                "AI Feedback on Every Attempt",
                "Advanced analytics, Confident scores",
                "Audio replay & AI pronunciation insights",
                "Advanced analytics dashboard",
                "Leaderboards & streak rewards"
            ]
        }
    ];

    return (
        <div className="app-modal-overlay" onClick={onClose}>
            <div className="profile-pricing-modal" onClick={(e) => e.stopPropagation()}>
                <button className="app-modal-close" onClick={onClose}>×</button>
                <h2>Choose Your Premium Plan</h2>
                <div className="profile-pricing-plans">
                    {plans.map((plan, idx) => (
                        <div key={idx} className={`profile-pricing-plan ${plan.badge ? 'best-value' : ''}`}>
                            {plan.badge && <div className="profile-plan-badge">{plan.badge}</div>}
                            <div className="profile-plan-price">{plan.price}</div>
                            <div className="profile-plan-title">{plan.title}</div>
                            <ul className="profile-plan-features">
                                {plan.features.map((feature, i) => (
                                    <li key={i}>✓ {feature}</li>
                                ))}
                            </ul>
                            <button 
                                className="profile-select-plan-btn"
                                onClick={() => onSelectPlan(plan)}
                            >
                                Select Plan
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const PaymentModal = ({ plan, onClose, profileData }) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        if (!window.Razorpay) {
            alert('Payment gateway not loaded. Please refresh the page and try again.');
            return;
        }

        setLoading(true);
        try {
            const email = profileData?.college_email || localStorage.getItem("email");
            
            const response = await fetch(import.meta.env.VITE_PAYMENT_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    body: JSON.stringify({
                        action: "create_order",
                        college_email: email,
                        plan_type: plan.type
                    })
                })
            });

            if (!response.ok) {
                throw new Error(`Payment API failed: ${response.status}`);
            }

            const responseText = await response.text();
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Payment JSON Parse Error:', parseError);
                console.error('Payment Response:', responseText.substring(0, 200));
                throw new Error('Invalid JSON response from payment API');
            }
            const orderData = JSON.parse(result.body);

            const options = {
                key: orderData.razorpay_key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Skill Route",
                description: plan.title,
                order_id: orderData.order_id,
                handler: async (response) => {
                    await verifyPayment(response, email, plan.type);
                },
                prefill: { email: email },
                theme: { color: "#3B9797" },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment initialization failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const verifyPayment = async (paymentResponse, email, planType) => {
        try {
            const response = await fetch(import.meta.env.VITE_PAYMENT_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    body: JSON.stringify({
                        action: "verify_payment",
                        college_email: email,
                        razorpay_payment_id: paymentResponse.razorpay_payment_id,
                        razorpay_order_id: paymentResponse.razorpay_order_id,
                        razorpay_signature: paymentResponse.razorpay_signature,
                        plan_type: planType
                    })
                })
            });
            
            if (!response.ok) {
                throw new Error(`Payment verification failed: ${response.status}`);
            }

            const responseText = await response.text();
            try {
                const result = JSON.parse(responseText);
                alert('Payment successful! Premium activated.');
                window.location.reload();
            } catch (parseError) {
                console.error('Verification JSON Parse Error:', parseError);
                console.error('Verification Response:', responseText.substring(0, 200));
                alert('Payment verification failed. Please contact support.');
            }
        } catch (error) {
            console.error('Verification error:', error);
            alert('Payment verification failed. Please contact support.');
        }
    };

    return (
        <div className="app-modal-overlay" onClick={onClose}>
            <div className="profile-payment-modal" onClick={(e) => e.stopPropagation()}>
                <button className="app-modal-close" onClick={onClose}>×</button>
                <h2>Complete Your Purchase</h2>
                <div className="profile-payment-details">
                    <h3>{plan.title}</h3>
                    <div className="profile-payment-price">{plan.price}</div>
                    <p>You will be redirected to our secure payment gateway to complete your purchase.</p>
                </div>
                <div className="profile-payment-actions">
                    <button className="profile-cancel-btn" onClick={onClose}>Cancel</button>
                    <button 
                        className="profile-proceed-btn" 
                        onClick={handlePayment}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileData;