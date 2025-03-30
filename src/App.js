// src/App.js
import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Login from './components/Login';
import Register from './components/Register';
import NotesList from './components/NotesList';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function AppContent() {
  const location = useLocation();
  const nodeRef = useRef(null);
  return (
    <TransitionGroup>
      <CSSTransition nodeRef={nodeRef} key={location.key} classNames="page" timeout={300}>
        <div ref={nodeRef}>
          <Routes location={location}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <NotesList />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
