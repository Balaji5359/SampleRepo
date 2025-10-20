import React, { useState, useEffect } from "react";
import "./login.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

function SignUp() {
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(location.state?.showLogin || true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState("");
    const [statusCode, setStatusCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [apiMessage, setApiMessage] = useState("");
    const [error, setError] = useState("");
    const [showErrorCard, setShowErrorCard] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style = "";
        document.body.classList.add("auth-page");
        
        // Set login mode if coming from profile creation
        if (location.state?.showLogin) {
            setIsLogin(true);
        }
        
        return () => {
            document.body.classList.remove("auth-page");
        };
    }, [location.state]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setApiMessage("");

        if (isLogin) {
            // Login API call
            const url = "https://jaumunpkj2.execute-api.ap-south-1.amazonaws.com/dev/signup/login";
            const userdata = {
                email: formData.email,
                password: formData.password,
            };
            const headers = {
                "Content-Type": "application/json",
            };

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(userdata),
                });
                const data = await response.json();
                setStatusCode(data.statusCode);
                setMessage(data.body);

                try {
                    const parsedBody = JSON.parse(data.body);
                    setApiMessage(parsedBody.message || "");
                } catch (e) {
                    setApiMessage(data.body || "");
                }

                if (data.statusCode === 200) {
                    localStorage.setItem("email", formData.email);
                    navigate("/profiledata");
                } else {
                    // Show error card for login failures
                    setErrorMessage("Invalid email or password. Please try again.");
                    setShowErrorCard(true);
                }
            } catch (error) {
                setError("Failed to connect to server. Please try again.");
                setErrorMessage("Network error. Please check your connection.");
                setShowErrorCard(true);
            } finally {
                setIsLoading(false);
            }
        } else {
            // Signup API call
            const userData = {
                body: {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }
            };
            
            const url = 'https://jaumunpkj2.execute-api.ap-south-1.amazonaws.com/dev/signup';
            const headers = {
                'Content-Type': 'application/json'
            };

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(userData),
                });
                const data = await response.json();
                setStatusCode(data.statusCode);
                setMessage(data.body);
                
                try {
                    const parsedBody = JSON.parse(data.body);
                    setApiMessage(parsedBody.message || "");
                } catch (e) {
                    setApiMessage(data.body || "");
                }
                
                if (data.statusCode === 200) {
                    localStorage.setItem("email", formData.email);
                    navigate("/profile-creation-survey");
                } else {
                    // Show error card for signup failures (e.g., invalid college email)
                    setErrorMessage("Invalid college email. Please use your college email address.");
                    setShowErrorCard(true);
                }
            } catch (error) {
                setError("Failed to connect to server. Please try again.");
                setErrorMessage("Network error. Please check your connection.");
                setShowErrorCard(true);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-layout">
                {/* Welcome Section - Desktop Only */}
                <div className="welcome-section">
                    <div className="welcome-content">
                        <h1>Welcome to Skill Route!</h1>
                        <p>Discover our administrator advisory and exciting new features designed to enhance your experience.</p>
                        <div className="cta-buttons">
                            <button className="btn-outline">Learn More</button>
                            <button className="btn-outline">Watch Demo</button>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="form-section">
                    <div className="form-container">
                        <div className="brand-header">
                            <h2>Welcome to Skill Route!</h2>
                            <p>{isLogin ? 'Sign in to continue' : 'Register now'}</p>
                        </div>

                        <div className="form-tabs">
                            <button
                                className={!isLogin ? 'tab active' : 'tab'}
                                onClick={() => setIsLogin(false)}
                                type="button"
                            >
                                Sign Up
                            </button>
                            <button
                                className={isLogin ? 'tab active' : 'tab'}
                                onClick={() => setIsLogin(true)}
                                type="button"
                            >
                                Login
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form">
                            {!isLogin && (
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Full Name"
                                        required
                                    />
                                </div>
                            )}

                            <div className="input-group">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Password"
                                    required
                                />
                            </div>

                            {isLogin && (
                                <div className="remember-me">
                                    <input type="checkbox" id="remember" />
                                    <label htmlFor="remember">Remember me</label>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? (isLogin ? 'Logging in...' : 'Creating Account...') : (isLogin ? 'Login' : 'Sign Up')}
                            </button>
                        </form>

                        {apiMessage && (
                            <div className="message success">{apiMessage}</div>
                        )}

                        {error && (
                            <div className="message error">{error}</div>
                        )}
                        
                        {/* switch controls placed inside the card and centered */}
                        <div className="switch-in-card">
                            {!isLogin && (
                                <p className="switch-text">
                                    Already have an account? <button type="button" onClick={() => setIsLogin(true)} className="link-btn">Log in</button>
                                </p>
                            )}
                            {isLogin && (
                                <p className="switch-text">
                                    Don't have an account? <button type="button" onClick={() => setIsLogin(false)} className="link-btn">Sign up</button>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;