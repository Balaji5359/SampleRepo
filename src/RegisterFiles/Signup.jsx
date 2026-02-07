import React, { useState, useEffect } from "react";
import "../theme-system.css";
import "./login-custom.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

function SignUp() {
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(location.state?.showLogin || true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        collegeName: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [statusCode, setStatusCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [apiMessage, setApiMessage] = useState("");
    const [error, setError] = useState("");
    const [showErrorCard, setShowErrorCard] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [passwordMismatch, setPasswordMismatch] = useState(false);
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
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Check password confirmation in real-time
        if (name === 'confirmPassword' || name === 'password') {
            const password = name === 'password' ? value : formData.password;
            const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
            setPasswordMismatch(password !== confirmPassword && confirmPassword !== '');
        }
    };

    const handleInputFocus = () => {
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setApiMessage("");

        if (isLogin) {
            // Login API call
            const url = import.meta.env.VITE_STUDENT_LOGIN_API;
            const userdata = {
                college_email: formData.email,
                password: formData.password,
                college_name: formData.collegeName
            };
            const headers = {
                "Content-Type": "application/json",
            };

            // console.log('Login API URL:', url);
            // console.log('Login Request Data:', userdata);

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(userdata),
                });
                // console.log('Login Response Status:', response.status);
                const data = await response.json();
                // console.log('Login Response Data:', data);
                setStatusCode(data.statusCode);
                setMessage(data.body);

                // Parse the quoted string in data.body
                let errorMsg = "";
                try {
                    errorMsg = JSON.parse(data.body);
                } catch (e) {
                    errorMsg = data.body;
                }
                setApiMessage(errorMsg);

                if (data.statusCode === 200) {
                    localStorage.setItem("email", formData.email);
                    // alert("Welcome back to Skill Route!");
                    navigate("/profiledata");
                } else {
                    // Show specific error message from API
                    setErrorMessage(errorMsg || "Login failed. Please try again.");
                    setShowErrorCard(true);
                }
            } catch (error) {
                console.log('Login API Error:', error);
                setError("Failed to connect to server. Please try again.");
                setErrorMessage("Network error. Please check your connection.");
                setShowErrorCard(true);
            } finally {
                setIsLoading(false);
            }
        } else {
            // Check password confirmation
            if (formData.password !== formData.confirmPassword) {
                setErrorMessage("Passwords do not match.");
                setShowErrorCard(true);
                setIsLoading(false);
                return;
            }
            
            // Signup API call
            const userData = {
                college_email: formData.email,
                full_name: formData.name,
                password: formData.password,
                college_name: formData.collegeName
            };
            
            const url = import.meta.env.VITE_STUDENT_SIGNUP_API;
            const headers = {
                'Content-Type': 'application/json'
            };

            // console.log('Signup API URL:', url);
            // console.log('Signup Request Data:', userData);

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(userData),
                });
                // console.log('Signup Response Status:', response.status);
                const data = await response.json();
                // console.log('Signup Response Data:', data);
                setStatusCode(data.statusCode);
                setMessage(data.body);
                
                // Parse the quoted string in data.body
                let errorMsg = "";
                try {
                    errorMsg = JSON.parse(data.body);
                } catch (e) {
                    errorMsg = data.body;
                }
                setApiMessage(errorMsg);
                
                if (data.statusCode === 200) {
                    localStorage.setItem("email", formData.email);
                    localStorage.setItem("fullName", formData.name);
                    // alert("Welcome to Skill Route!");
                    navigate("/profile-creation-survey");
                } else {
                    // Show specific error message from API
                    setErrorMessage(errorMsg || "Signup failed. Please try again.");
                    setShowErrorCard(true);
                }
            } catch (error) {
                console.log('Signup API Error:', error);
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
            <div className={`auth-layout ${showForm ? 'form-focused' : ''}`}>
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
                            <h2>{isLogin ? 'Welcome Back' : 'Welcome to Skill Route'}</h2>
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
                                    onFocus={handleInputFocus}
                                    placeholder="College Email"
                                    required
                                />
                            </div>

                            

                            <div className="input-group password-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                    placeholder="Password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="eye-button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {/* {showPassword ? '👁️' : '🙈'} */}
                                </button>
                            </div>

                            {!isLogin && (
                                <div className="input-group password-group">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        onFocus={handleInputFocus}
                                        placeholder="Confirm Password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="eye-button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {/*showConfirmPassword ? '👁️' : '🙈'*/}
                                    </button>
                                    {passwordMismatch && (
                                        <div className="error-text">Passwords do not match</div>
                                    )}
                                </div>
                            )}
                            <div className="input-group"><div className="input-group">
                                <select
                                    name="collegeName"
                                    value={formData.collegeName}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                    required
                                >
                                    <option value="">Select College</option>
                                    <option value="MITS University">MITS University</option>
                                    <option value="ABCD University">ABCD University</option>
                                </select>
                            </div></div>


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