import React, { useState,useEffect } from 'react';
import './styles/signin.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signin = ({ setAuth }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem('authData'));
    if (storedAuth && storedAuth.token && storedAuth.expiry > Date.now()) {
      setAuth(true);
      navigate('/notes');
    }
  }, [setAuth, navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('https://notes-app-u7f0.onrender.com/api/signin', credentials);
      const tokenExpiry = new Date().getTime() + 3 * 60 * 60 * 1000;
      localStorage.setItem('authData', JSON.stringify({ token: res.data.token, expiry: tokenExpiry, credentials}));
      setAuth(true);
      navigate('/notes');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <div>Not have an Account? <a href='http://localhost:3000/signup'>Create a new Account</a></div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default Signin;
