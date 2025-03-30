// src/components/NotesList.js
import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import Navbar from './Navbar';
import NoteForm from './NoteForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NotesList.css';

function NotesList() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [deleteNoteId, setDeleteNoteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const pageSize = 10;

  const fetchNotes = useCallback(async () => {
    try {
      const response = await api.get('/Notes', {
        params: {
          search,
          fromDate,
          endDate,
          pageNumber,
          pageSize,
        },
      });
      setNotes(response.data.notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }, [search, fromDate, endDate, pageNumber]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleResetFilters = () => {
    setSearch('');
    setFromDate('');
    setEndDate('');
    setPageNumber(1);
  };

  const handleEdit = (note) => {
    setEditNote(note);
    setShowNoteForm(true);
  };

  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    setDeleteNoteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/Notes/${deleteNoteId}`);
      toast.success('Note deleted successfully!');
      setShowDeleteModal(false);
      setDeleteNoteId(null);
      fetchNotes();
    } catch (error) {
      toast.error('Error deleting note.');
      console.error('Error deleting note:', error);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <header className="notes-header py-5 text-center text-white">
        <div className="container">
          <h1 className="display-4">Your Creative Notes</h1>
          <p className="lead">Organize your thoughts with style</p>
          <button
            className="btn btn-light btn-lg mt-3"
            onClick={() => {
              setEditNote(null);
              setShowNoteForm(true);
            }}
          >
            Create New Note
          </button>
        </div>
      </header>
      <div className="container my-5">
        <div className="card p-4 shadow-sm mb-4">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control form-control-lg"
                placeholder="From date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control form-control-lg"
                placeholder="End date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary btn-lg w-100" onClick={handleResetFilters}>
                Reset Filters
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div className="col-md-4 mb-4" key={note.id}>
                <div
                  className="card note-card h-100"
                  onClick={() => handleEdit(note)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">{note.title}</h5>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={(e) => handleDeleteClick(note.id, e)}
                      >
                        Delete
                      </button>
                    </div>
                    <p className="card-text mt-2">{note.description}</p>
                    {note.scheduledTime && (
                      <p className="text-muted">
                        Scheduled: {new Date(note.scheduledTime).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="card-footer text-muted">
                    {new Date(note.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info text-center" role="alert">
                No notes found. Create your first note!
              </div>
            </div>
          )}
        </div>
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${pageNumber === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPageNumber(pageNumber - 1)}>
                Previous
              </button>
            </li>
            <li className="page-item">
              <button className="page-link" onClick={() => setPageNumber(pageNumber + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
      {showNoteForm && (
        <NoteForm
          note={editNote}
          onClose={() => setShowNoteForm(false)}
          onSave={() => {
            setShowNoteForm(false);
            setPageNumber(1);
            fetchNotes();
            toast.success(editNote ? 'Note updated!' : 'Note created!');
          }}
        />
      )}
      {showDeleteModal && (
        <DeleteConfirmationModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}

export default NotesList;
