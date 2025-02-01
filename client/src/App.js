import React from 'react'
import {BrowserRouter as Router, Route, Routes,Navigate} from 'react-router-dom'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Note from './pages/Note'
import {useState,useEffect} from 'react'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem('authData'));
    if (storedAuth && storedAuth.token && storedAuth.expiry > Date.now()) {
      setIsAuthenticated(true);
    }
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Signin setAuth={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup setAuth={setIsAuthenticated} />} />
        <Route path="/notes" element={isAuthenticated ? <Note /> : <Navigate to="/signin" />} />
        <Route path="/" element={isAuthenticated ? <Navigate to="/notes" /> : <Navigate to="/signin" />} />
      </Routes>
    </Router>
  )
}

export default App