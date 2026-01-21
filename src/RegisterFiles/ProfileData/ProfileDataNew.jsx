import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../LandingPageFiles/landing.css';
import './ProfileDataNew.css';

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
                const storedEmail = localStorage.getItem("email") || "22691A2828@mits.ac.in";
                
                const [profileResponse, streakResponse] = await Promise.all([
                    fetch('https://ntjkr8rnd6.execute-api.ap-south-1.amazonaws.com/dev/student_profilecreate/student_profile_senddata', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ college_email: storedEmail })
                    }),
                    fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/update-user-streak', {
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

                const profile = await profileResponse.json();
                const streak = await streakResponse.json();
                
                setProfileData(JSON.parse(profile.body));
                setStreakData(JSON.parse(streak.body));

                // Set greeting and quote
                const hour = new Date().getHours();
                if (hour < 12) setGreeting("Good Morning");
                else if (hour < 17) setGreeting("Good Afternoon");
                else setGreeting("Good Evening");
                
                setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const isPremium = profileData?.user_type === 'premium' && profileData?.premium_status === 'active';

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className={`dashboard-container ${isPremium ? 'premium-bg' : 'free-bg'}`}>
            <Navbar navigate={navigate} profileData={profileData} streakData={streakData} />
            
            <div className="dashboard-content">
                <GreetingCard 
                    greeting={greeting} 
                    name={profileData?.full_name} 
                    quote={motivationalQuote} 
                />
                
                <div className="dashboard-grid">
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

                <div className="dashboard-bottom">
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

const Navbar = ({ navigate, profileData, streakData }) => (
    <header className="header">
        <div className="header-content">
            <div className="logo">
                <span className="logo-text">Skill Route</span>
            </div>
            <div className="nav-links">
                <a href="#" onClick={() => navigate('/profiledata')} className="active-nav">Home</a>
                <a href="#" onClick={() => navigate('/test')}>Tests</a>
                <a href="#" onClick={() => navigate('/practice')}>Practice</a>
                <a href="#" onClick={() => navigate('/student-dashboard')}>Dashboard</a>
                <a href="#" onClick={() => navigate('/student-leaderboard')}>Leaderboard</a>
            </div>
            <div className="auth-buttons">
                <span className="streak-badge">
                    🔥 {streakData?.current_streak || 0}
                </span>
                <span className={`user-type-badge ${profileData?.user_type === 'premium' ? 'premium' : 'free'}`}>
                    {profileData?.user_type === 'premium' ? '👑 Premium User' : '🆓 Free User'}
                </span>
                <span className="roll-badge">
                    {profileData?.roll_no || "Roll No"}
                </span>
                <button 
                    className="btn-signup"
                    onClick={() => {
                        localStorage.removeItem('email');
                        navigate('/signup');
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    </header>
);


const GreetingCard = ({ greeting, name, quote }) => (
    <div className="greeting-card">
        <h1 className="greeting-title">
            {greeting}, {name || "Student"}! <span>👋</span>
        </h1>
        <p className="motivational-quote">"{quote}"</p>
    </div>
);

const PremiumInfoCard = ({ plan, startDate }) => (
    <div className="premium-info-card">
        <div className="premium-header">
            <div className="premium-icon">👑</div>
            <h3>Premium Member</h3>
        </div>
        <p className="premium-plan">Plan: {plan?.charAt(0).toUpperCase() + plan?.slice(1)}</p>
        <p className="premium-date">Started: {new Date(startDate).toLocaleDateString()}</p>
    </div>
);

const DaysLeftCard = ({ daysLeft, expiryDate }) => (
    <div className="days-left-card">
        <h3>Days Left</h3>
        <div className="days-number">{daysLeft}</div>
        <p className="expiry-date">Expires: {new Date(expiryDate).toLocaleDateString()}</p>
    </div>
);

const FreeVsPremiumCard = ({ onUpgrade }) => (
    <div className="free-vs-premium-card">
        <h3>Free vs Premium</h3>
        <div className="comparison-grid">
            <div className="free-features">
                <h4>Free Plan</h4>
                <ul>
                    <li>• 2 tests - for trial</li>
                    <li>• Basic tests only</li>
                    <li>• Simple AI feedback</li>
                    <li>• Basic streak tracking</li>
                    <li>• No advanced analytics</li>
                </ul>
            </div>
            <div className="premium-features">
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
        <button className="upgrade-btn" onClick={onUpgrade}>Upgrade to Premium</button>
    </div>
);

const StreakCard = ({ currentStreak, longestStreak }) => (
    <div className="streak-card">
        <h3>Daily Streak</h3>
        <div className="streak-stats">
            <div className="streak-item">
                <div className="streak-number current">{currentStreak || 0}</div>
                <p>Current</p>
            </div>
            <div className="streak-item">
                <div className="streak-number longest">{longestStreak || 0}</div>
                <p>Longest</p>
            </div>
        </div>
    </div>
);

const ActivityCalendar = ({ activeDates }) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0 = January
    const currentYear = currentDate.getFullYear();
    
    // Get first day of current month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday
    
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Count active days in current month
    const activeDaysCount = activeDates?.filter(dateStr => {
        const date = new Date(dateStr);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length || 0;
    
    // Create calendar grid
    const calendarDays = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isActive = activeDates?.includes(dateStr);
        const isToday = day === currentDate.getDate();
        
        calendarDays.push(
            <div
                key={day}
                className={`calendar-day ${
                    isActive ? 'active' : ''
                } ${isToday ? 'today' : ''}`}
                title={`${monthName} ${day}${isActive ? ' - Active' : ''}`}
            >
                {day}
            </div>
        );
    }
    
    return (
        <div className="activity-calendar">
            <div className="calendar-header">
                <h3>Activity Calendar</h3>
                <div className="calendar-stats">
                    <span className="month-name">{monthName}</span>
                    <span className="active-count">{activeDaysCount} active days</span>
                </div>
            </div>
            
            <div className="calendar-weekdays">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="weekday-label">{day}</div>
                ))}
            </div>
            
            <div className="calendar-grid-month">
                {calendarDays}
            </div>
        </div>
    );
};

const QuickActions = ({ navigate }) => (
    <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
            <button className="action-btn" onClick={() => navigate('/test')}>
                <div className="action-icon">🎤</div>
                <div className="action-text">
                    <div className="action-title">Start JAM Session</div>
                    <div className="action-desc">Practice speaking skills</div>
                </div>
            </button>
            <button className="action-btn" onClick={() => navigate('/test')}>
                <div className="action-icon">🗣️</div>
                <div className="action-text">
                    <div className="action-title">Pronunciation Test</div>
                    <div className="action-desc">Improve pronunciation</div>
                </div>
            </button>
            <button className="action-btn" onClick={() => navigate('/student-dashboard')}>
                <div className="action-icon">📊</div>
                <div className="action-text">
                    <div className="action-title">View Progress</div>
                    <div className="action-desc">Check analytics</div>
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
        <div className="modal-overlay" onClick={onClose}>
            <div className="pricing-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h2>Choose Your Premium Plan</h2>
                <div className="pricing-plans">
                    {plans.map((plan, idx) => (
                        <div key={idx} className={`pricing-plan ${plan.badge ? 'best-value' : ''}`}>
                            {plan.badge && <div className="plan-badge">{plan.badge}</div>}
                            <div className="plan-price">{plan.price}</div>
                            <div className="plan-title">{plan.title}</div>
                            <ul className="plan-features">
                                {plan.features.map((feature, i) => (
                                    <li key={i}>✓ {feature}</li>
                                ))}
                            </ul>
                            <button 
                                className="select-plan-btn"
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
            
            const response = await fetch('https://nrkg7cmta3.execute-api.ap-south-1.amazonaws.com/dev/razorpay-webhook', {
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

            const result = await response.json();
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
                prefill: {
                    email: email
                },
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
            const response = await fetch('https://nrkg7cmta3.execute-api.ap-south-1.amazonaws.com/dev/razorpay-webhook', {
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
            
            const result = await response.json();
            if (response.ok) {
                alert('Payment successful! Premium activated.');
                window.location.reload();
            } else {
                alert('Payment verification failed. Please contact support.');
            }
        } catch (error) {
            console.error('Verification error:', error);
            alert('Payment verification failed. Please contact support.');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h2>Complete Your Purchase</h2>
                <div className="payment-details">
                    <h3>{plan.title}</h3>
                    <div className="payment-price">{plan.price}</div>
                    <p>You will be redirected to our secure payment gateway to complete your purchase.</p>
                </div>
                <div className="payment-actions">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button 
                        className="proceed-btn" 
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