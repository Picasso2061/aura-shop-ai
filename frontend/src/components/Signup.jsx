import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../Login.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Neural confirmation mismatch: Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await axios.post('/_/backend/register', { email, password });
      navigate('/login', { state: { message: 'Identity Created. Please Authorize.' } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. This Neural ID may already be in use.');
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
          <h1>Join the Future</h1>
          <p>Create your unique Identity to begin.</p>
        </div>

        {error && <div className="error-toast">{error}</div>}

        <form onSubmit={handleSignup} className="login-form">
          <div className="input-container">
            <input 
              type="email" 
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Neural ID (Email)</label>
          </div>
          
          <div className="input-container">
            <input 
              type="password" 
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Access Key (Password)</label>
          </div>

          <div className="input-container">
            <input 
              type="password" 
              placeholder=" "
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <label>Confirm Access Key</label>
          </div>
          
          <button type="submit" className="signin-button" disabled={loading}>
            {loading ? 'GENERATING IDENTITY...' : 'CREATE IDENTITY'}
          </button>
        </form>

        <div className="signup-footer">
          Already verified? <Link to="/login">Authorize Access</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
