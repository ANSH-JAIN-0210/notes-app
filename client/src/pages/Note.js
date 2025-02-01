import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import './styles/note.css';

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [newNote, setNewNote] = useState({ name: '', tag: '', description: '' });
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const authData = JSON.parse(localStorage.getItem('authData'));
  const userName = authData?.credentials?.username || "User";

  useEffect(() => {
    const fetchNotes = async () => {
      console.log(authData)
      try {
        if (!authData || !authData.token) throw new Error('User not authenticated');

        const res = await axios.get('http://localhost:5000/api/notes', {
          headers: { Authorization: `Bearer ${authData.token}` },
        });
        setNotes(res.data);
        setFilteredNotes(res.data);
      } catch (err) {
        console.error(err);
        navigate('/');
      }
    };
    fetchNotes();
  }, [navigate]);

  // Search Functionality
  useEffect(() => {
    const filtered = notes.filter(note =>
      note.note_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.note_tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.note_description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNotes(filtered);
  }, [searchQuery, notes]);

  const handleAddOrUpdateNote = async () => {
    try {
      if (!authData || !authData.token) throw new Error('User not authenticated');

      if (editingNoteId) {
        // Update Note
        const res = await axios.put(
          `http://localhost:5000/api/notes/${editingNoteId}`,
          {
            note_name: newNote.name,
            note_tag: newNote.tag,
            note_description: newNote.description,
          },
          { headers: { Authorization: `Bearer ${authData.token}` } }
        );

        setNotes(notes.map(note => (note._id === editingNoteId ? res.data.note : note)));
      } else {
        // Add New Note
        const res = await axios.post(
          'http://localhost:5000/api/notes',
          {
            note_name: newNote.name,
            note_tag: newNote.tag,
            note_description: newNote.description,
          },
          { headers: { Authorization: `Bearer ${authData.token}` } }
        );

        setNotes([...notes, res.data.note]);
      }

      setNewNote({ name: '', tag: '', description: '' });
      setShowModal(false);
      setEditingNoteId(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleEditNote = (note) => {
    setNewNote({
      name: note.note_name,
      tag: note.note_tag,
      description: note.note_description,
    });
    setEditingNoteId(note._id);
    setShowModal(true);
  };

  const handleDeleteNote = async (noteId) => {
    try {
      if (!authData || !authData.token) throw new Error('User not authenticated');

      await axios.delete(`http://localhost:5000/api/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${authData.token}` },
      });

      setNotes(notes.filter((note) => note._id !== noteId));
    } catch (err) {
      console.error('Error deleting note:', err.response?.data?.message || err.message);
      alert(err.response?.data?.message || 'An error occurred while deleting the note');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewNote({ name: '', tag: '', description: '' });
    setEditingNoteId(null);
  };

  return (
    <div className="note-app">
      {/* Navbar */}
      <header className="navbar">
        <h1 className="app-name">GoodNotes</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>
        <div className="profile-section">
          <span className="user-initials">{userName.charAt(0)}</span>
          <span className="user-name">{userName}</span>
          <button className="logout-btn" onClick={() => localStorage.removeItem('authData') || navigate('/signin')}>
            Logout
          </button>
        </div>
      </header>

      {/* Notes Grid */}
      <div className="notes-grid">
        {filteredNotes.map((note) => (
          <div className="note-card" key={note._id}>
            <h3>{note.note_name}</h3>
            <p><b>Tag:</b> {note.note_tag}</p>
            <p>{note.note_description}</p>
            <div className="note-actions">
              <button className="edit-btn" onClick={() => handleEditNote(note)}>
                <FaEdit />
              </button>
              <button className="delete-btn" onClick={() => handleDeleteNote(note._id)}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Note Button */}
      <button className="add-note-btn" onClick={() => setShowModal(true)}>
        <FaPlus />
      </button>

      {/* Modal for Creating/Editing a Note */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-modal" onClick={handleCloseModal}>
              <FaTimes />
            </button>
            <h2>{editingNoteId ? 'Edit Note' : 'Create a Note'}</h2>
            <input
              type="text"
              value={newNote.name}
              onChange={(e) => setNewNote({ ...newNote, name: e.target.value })}
              placeholder="Note Title"
            />
            <input
              type="text"
              value={newNote.tag}
              onChange={(e) => setNewNote({ ...newNote, tag: e.target.value })}
              placeholder="Tag (Optional)"
            />
            <textarea
              value={newNote.description}
              onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
              placeholder="Note Description"
            />
            <button className="save-note-btn" onClick={handleAddOrUpdateNote}>
              {editingNoteId ? 'Update Note' : 'Save Note'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Note;