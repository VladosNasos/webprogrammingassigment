import React, { useState } from 'react';

const PasswordInput = ({ id, name, label, value, onChange, error, autoComplete }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{label}</label>
      <div className="input-group">
        <input
          type={showPassword ? 'text' : 'password'}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );
};

export default PasswordInput;