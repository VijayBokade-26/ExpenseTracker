import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    BarChart3,
    Users,
    TrendingUp,
    Lock,
    ArrowRight,
    Zap,
    Shield,
} from "lucide-react";
import "../styles/landing.css";

function Landing() {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("token");

    return (
        <div className="landing-container">
            {/* Navigation */}
            <nav className="landing-nav">
                <div className="nav-brand">

                    <span>Splitzy</span>
                </div>
                <div className="nav-actions">
                    {isLoggedIn ? (
                        <>
                            <button
                                className="nav-btn secondary"
                                onClick={() => navigate("/dashboard")}
                            >
                                Dashboard
                            </button>
                            <button
                                className="nav-btn danger"
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    navigate("/");
                                    window.location.reload();
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-btn secondary">
                                Login
                            </Link>
                            <Link to="/signup" className="nav-btn primary">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Track Your Expenses Effortlessly</h1>
                    <p className="hero-subtitle">
                        Manage your spending, split bills with friends, and reach your
                        financial goals with Splitzy.
                    </p>

                    <div className="hero-cta">
                        {!isLoggedIn && (
                            <>
                                <Link to="/signup" className="btn btn-primary">
                                    Get Started Free <ArrowRight size={20} />
                                </Link>
                                <Link to="/login" className="btn btn-secondary">
                                    Already have an account? Login
                                </Link>
                            </>
                        )}
                        {isLoggedIn && (
                            <Link to="/dashboard" className="btn btn-primary">
                                Go to Dashboard <ArrowRight size={20} />
                            </Link>
                        )}
                    </div>

                    <div className="hero-stats">
                        <div className="stat">
                            <strong>10K+</strong>
                            <span>Active Users</span>
                        </div>
                        <div className="stat">
                            <strong>$2.5M+</strong>
                            <span>Tracked Expenses</span>
                        </div>
                        <div className="stat">
                            <strong>500K+</strong>
                            <span>Bills Split</span>
                        </div>
                    </div>
                </div>

                <div className="hero-image">
                    <div className="floating-card card-1">
                        <div className="card-icon">📊</div>
                        <div>
                            <p>Monthly Spending</p>
                            <strong>₹24,860</strong>
                        </div>
                    </div>
                    <div className="floating-card card-2">
                        <div className="card-icon">👥</div>
                        <div>
                            <p>Split with Friends</p>
                            <strong>8 Groups</strong>
                        </div>
                    </div>
                    <div className="floating-card card-3">
                        <div className="card-icon">📈</div>
                        <div>
                            <p>Savings Target</p>
                            <strong>₹50,000</strong>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2>Why Choose Splitzy?</h2>
                <p className="section-subtitle">
                    Everything you need to manage your finances
                </p>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <BarChart3 size={32} />
                        </div>
                        <h3>Smart Analytics</h3>
                        <p>Get detailed insights into your spending patterns and trends.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <Users size={32} />
                        </div>
                        <h3>Easy Bill Splitting</h3>
                        <p>Split expenses with friends and family instantly.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <TrendingUp size={32} />
                        </div>
                        <h3>Budget Planning</h3>
                        <p>Set budgets and track your progress towards financial goals.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <Lock size={32} />
                        </div>
                        <h3>Secure & Private</h3>
                        <p>Your financial data is encrypted and protected at all times.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <Zap size={32} />
                        </div>
                        <h3>Real-time Updates</h3>
                        <p>Get instant notifications for all your transactions.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <Shield size={32} />
                        </div>
                        <h3>Peace of Mind</h3>
                        <p>Advanced security features to protect your account.</p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <h2>How It Works</h2>
                <p className="section-subtitle">Get started in 3 simple steps</p>

                <div className="steps-container">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h3>Create Account</h3>
                        <p>Sign up with your email and password in seconds.</p>
                    </div>

                    <div className="step-divider">→</div>

                    <div className="step">
                        <div className="step-number">2</div>
                        <h3>Add Expenses</h3>
                        <p>Log your daily expenses and categorize them.</p>
                    </div>

                    <div className="step-divider">→</div>

                    <div className="step">
                        <div className="step-number">3</div>
                        <h3>Track & Analyze</h3>
                        <p>View reports and optimize your spending.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <h2>Ready to Take Control of Your Finances?</h2>
                <p>Join thousands of users tracking their expenses with Splitzy.</p>
                {!isLoggedIn && (
                    <Link to="/signup" className="btn btn-primary btn-large">
                        Start Free Trial <ArrowRight size={20} />
                    </Link>
                )}
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">

                        <span>Splitzy</span>
                    </div>
                    <p>&copy; 2026 Splitzy. All rights reserved.</p>
                </div>
                <div className="footer-links">
                    <a href="#privacy">Privacy</a>
                    <a href="#terms">Terms</a>
                    <a href="#contact">Contact</a>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
