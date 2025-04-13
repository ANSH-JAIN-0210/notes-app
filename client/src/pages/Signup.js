import React, { useState,useEffect } from 'react';
import './styles/signup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = ({ setAuth }) => {
  const [credentials, setCredentials] = useState({
    name: '', username: '', email: '', phone: '', password: ''
  });
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
      const res = await axios.post('https://notes-app-u7f0.onrender.com/api/signup', credentials);
      localStorage.setItem('authData', JSON.stringify({
        token: res.data.token,
        expiry: Date.now() + 3 * 60 * 60 * 1000
        , formData: credentials
      }));
      setAuth(true);
      navigate('/notes');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          className="signup-input"
          type="text"
          name="name"
          value={credentials.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <input
          className="signup-input"
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          className="signup-input"
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          className="signup-input"
          type="text"
          name="phone"
          value={credentials.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          required
        />
        <input
          className="signup-input"
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <div>Already have an Account? <a href='http://localhost:3000/signin'>SignIn to Your Account</a></div>
        <button className="signup-button" type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
