import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';


export const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', formData);
      setMessage('Registration successful!');
      setFormData({ username: '', email: '', password: '' });
      // Wait 1 second and then redirect
    setTimeout(() => {
      navigate('/login');
    }, 1000);
    } catch (error) {
      console.error(error);
      setMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="mb-4 text-center">User Registration</h3>
      {message && <div className="alert alert-info text-center">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input 
            type="text" 
            className="form-control" 
            name="username"
            value={formData.username}
            onChange={handleChange}
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input 
            type="email" 
            className="form-control" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-control" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            required 
          />
        </div>
        <button type="submit" className="btn w-100" style={{backgroundColor: "#F4C3D2"}}>Register</button>
        <button className="btn w-100 mt-3" style={{backgroundColor: "#F4C3D2"}} type="button">
        <a href="/login" style={{textDecoration: 'none', color:'black'}}>
          Login
        </a>
      </button>
      </form>
    </div>
  );
};
