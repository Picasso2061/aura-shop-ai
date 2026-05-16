import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Show success message from signup if redirecting
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/_/backend/login', {
        email,
        password
      });
      
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Identity verification failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Morphing Background */}
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">AURA<span>AI</span></div>
          <h1>Predictive Shopping</h1>
          <p>Sign in to your AI-powered terminal.</p>
        </div>

        {successMessage && (
          <div className="error-toast" style={{ borderColor: 'var(--primary)', color: 'var(--primary)', background: 'rgba(124, 58, 237, 0.1)' }}>
            {successMessage}
          </div>
        )}

        {error && <div className="error-toast">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-container">
            <input 
              type="email" 
              placeholder=" " 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <label>Email Address</label>
          </div>
          
          <div className="input-container">
            <input 
              type="password" 
              placeholder=" " 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <label>Password</label>
          </div>

          <div className="form-utils">
            <label className="remember-me">
              <input type="checkbox" style={{ accentColor: 'var(--primary)' }} />
              Remember Me
            </label>
            <a href="#reset" className="forgot-pw">Forgot Password?</a>
          </div>

          <button type="submit" className="signin-button" disabled={loading}>
            {loading ? 'LOGGING IN...' : 'SIGN IN'}
          </button>
        </form>

        <div className="social-section">
          <div className="social-divider"><span>OR CONTINUE WITH</span></div>
          <div className="social-btns">
            <button className="social-btn">
              <span style={{ fontSize: '1.2rem' }}>G</span>
            </button>
            <button className="social-btn">
              <span style={{ fontSize: '1.2rem' }}></span>
            </button>
          </div>
        </div>

        <p className="signup-footer">
          New to the future? <Link to="/signup">Create Identity</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
