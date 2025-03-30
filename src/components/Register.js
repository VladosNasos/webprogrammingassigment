// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Auth.css';
import CongratulationsModal from './CongratulationsModal';
import ErrorBoundary from './ErrorBoundary';

function Register() {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
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
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await api.post('/Auth/register', formData);
      setShowCongrats(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="d-flex align-items-center justify-content-center min-vh-100 auth-container fade-in">
        {showCongrats && <CongratulationsModal onClose={() => navigate('/login')} />}
        <div className="card shadow fade-in auth-card">
          <div className="card-body">
            <h3 className="card-title text-center mb-2">Get Started</h3>
            <p className="text-center lead mb-4">
              Start your productivity journey today
            </p>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleRegister}>
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

              <div className="mb-3">
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

              <div className="mb-4">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input 
                  type="password" 
                  className="form-control form-control-lg" 
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
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
                ) : 'Create Account'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <span className="text-muted">Already have an account? </span>
              <Link to="/login" className="text-primary text-decoration-none">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default Register;