// src/components/NoteForm.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

function NoteForm({ note, onClose, onSave }) {
  const [title, setTitle] = useState(note?.title || '');
  const [description, setDescription] = useState(note?.description || '');
  // scheduledTime: для input datetime-local формат должен быть "YYYY-MM-DDTHH:MM"
  const [scheduledTime, setScheduledTime] = useState(note?.scheduledTime ? note.scheduledTime.substring(0,16) : '');
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle(note?.title || '');
    setDescription(note?.description || '');
    setScheduledTime(note?.scheduledTime ? note.scheduledTime.substring(0,16) : '');
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, description, scheduledTime };
      if (note && note.id) {
        await api.put(`/Notes/${note.id}`, payload);
      } else {
        await api.post('/Notes', payload);
      }
      onSave();
    } catch (err) {
      setError('Error saving note. ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{note ? 'Edit Note' : 'Create Note'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Scheduled Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                {note ? 'Save Changes' : 'Create Note'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NoteForm;
