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
      navigate('/');
    }, 1000);
    } catch (error) {
      console.error(error);
      setMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div style={{display: "flex", height: "100vh", fontFamily: "sans-serif",backgroundImage: `url("bg.jpg")`, backgroundSize: "100%",       // Ensures image covers entire element
      backgroundPosition: "center",  
      backgroundRepeat: "no-repeat", 
      width: "100vw",               
      margin: 0,                    
      padding: 0 
      }}>
      <div style={{width: "60%",maxWidth: "500px",backgroundColor: "#fff",borderRadius: "20px", boxShadow: "0 0 15px rgba(0,0,0,0.2)",margin: "auto",padding: "40px",display: "flex",flexDirection: "column",justifyContent: "center",}}>
        <h1 style={{textAlign: "center",marginBottom: "10px",}}>Register</h1>
        <h6 style={{textAlign: "center",fontWeight: "bold",marginBottom: "20px"}}>Create your Account.</h6>

        {message && <div className="alert alert-info text-center">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label mt-3">Username</label>
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
          <label className="form-label  mt-3">Email</label>
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
          <label className="form-label  mt-3">Password</label>
          <input 
            type="password" 
            className="form-control" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            required 
          />

        <button style={{backgroundColor: "#f8c3d9",border: "none",height: "45px",borderRadius: "10px",fontWeight: "bold",color: "#000",cursor: "pointer", marginTop:"20px", width: "100%"}}>Register</button>

        <div style={{marginTop: "15px",textAlign: "center",fontSize: "0.85rem",color: "black"}}>
          Are you registered? <a href="/">Login</a>
        </div>
      </div>
      </form>
      
     
    </div>
    <div style={{width: "40%"}}></div>
    </div>
  );
};
