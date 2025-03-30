// src/components/WelcomeModal.js
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CongratulationsModal.css'; // Reuse the same styles

function WelcomeModal({ onClose }) {
  useEffect(() => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }
      const particleCount = 30 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.2, 0.8), y: Math.random() - 0.2 }
      }));
    }, 250);

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div className="congrats-modal-overlay">
      <div className="congrats-modal-content">
        <h1 className="congrats-title">Welcome Back!</h1>
        <p className="congrats-message">We missed you, champion!</p>
      </div>
    </div>
  );
}

export default WelcomeModal;
