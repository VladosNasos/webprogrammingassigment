// src/components/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Auth.css';
import WelcomeModal from './WelcomeModal';
import ErrorBoundary from './ErrorBoundary';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await api.post('/Auth/login', formData);
      localStorage.setItem('token', response.data.token);
      setShowWelcome(true);
      setTimeout(() => navigate('/notes'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="d-flex align-items-center justify-content-center min-vh-100 auth-container fade-in">
        {showWelcome && <WelcomeModal onClose={() => navigate('/notes')} />}
        <div className="card shadow fade-in auth-card">
          <div className="card-body">
            <h3 className="card-title text-center mb-2">Welcome Back!</h3>
            <p className="text-center lead mb-4">
              Ready to conquer your notes?
            </p>
            
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input 
                  type="email" 
                  className="form-control form-control-lg" 
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  autoFocus
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <input 
                  type="password" 
                  className="form-control form-control-lg" 
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  minLength="8"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 py-3"
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : 'Continue'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <span className="text-muted">New here? </span>
              <Link to="/register" className="text-primary text-decoration-none">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default Login;