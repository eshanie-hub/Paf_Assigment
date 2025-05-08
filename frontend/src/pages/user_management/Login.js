import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setLogin } from "../../state/state";

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();


  useEffect(() => {
    const token = searchParams.get("token");
    const username = searchParams.get("username");
    const userId = searchParams.get("userId");

    if (token && username && userId) {
      dispatch(setLogin({ name: username, token , userId}));
      navigate("/pages/post_management/Home");
    }
  }, [dispatch, navigate, searchParams]);


  const [state, setState] = useState({
    email: "",
    password: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

 
  const handleForm = async (e) => {
    e.preventDefault();
    const { email, password } = state;

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: email,
        password: password
      });
      if (response.data.error) {
        alert(response.data.error);
        return;
      }else{

      const { token, username, userId } = response.data;

     
      dispatch(setLogin({ name: username, token: token, userId }));
      navigate('/pages/post_management/Home');
      console.log(response.data)
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials or server error');
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
        <h1 style={{textAlign: "center",marginBottom: "10px",}}>LOGIN</h1>
        <h6 style={{textAlign: "center",fontWeight: "bold",marginBottom: "20px"}}>Continue to your Account.</h6>

        <div style={{display: "flex",alignItems: "center",justifyContent: "center",backgroundColor: "#FFF5F7",borderRadius: "12px",height: "40px",cursor: "pointer",marginBottom: "15px"}}>
          <img
            src="https://img.icons8.com/color/16/000000/google-logo.png"
            alt="Google"
            style={{marginRight: "8px",height: "18px"}}
          />
          <a href="http://localhost:8080/oauth2/authorization/google" style={{textDecoration: 'none', color:'black'}}>
          Log In with Google
          </a>
        </div>
        <label className="form-label mt-3">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          className="form-control"
          value={state.email}
          onChange={handleChange}
          style={{
            fontSize: "0.8rem",
            color: "#888",
            margin: "10px 0",
            height: "40px"
          }}
        />

        <label className="form-label mt-3" htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          className="form-control"
          value={state.password}
          onChange={handleChange}
          style={{
            fontSize: "0.8rem",
            color: "#888",
            margin: "10px 0",
            height: "40px",
          }}
        />

        <button style={{backgroundColor: "#f8c3d9",border: "none",height: "45px",borderRadius: "10px",fontWeight: "bold",color: "#000",cursor: "pointer", marginTop:"20px"}}  onClick={handleForm}>LOGIN</button>

        <div style={{marginTop: "15px",textAlign: "center",fontSize: "0.85rem",color: "#888"}}>
          Are you a Newbie? <a href="/register">Register</a>
        </div>
      </div>
      <div style={{width: "40%"}}></div>
     
    </div>
  );

  
};