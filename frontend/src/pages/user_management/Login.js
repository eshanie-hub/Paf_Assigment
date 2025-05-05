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

    if (token && username) {
      dispatch(setLogin({ name: username, token }));
      alert("Google login successful");
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

      const { token, username } = response.data;

     
      dispatch(setLogin({ name: username, token: token }));
      alert('Login Successfully');
      navigate('/pages/post_management/Home');
      console.log(response.data)
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials or server error');
    }
  };


  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="mb-4 text-center">User Login</h3>
    <form>
      <div className="form-outline mb-4">
        <input
          type="text"
          id="email"
          name="email"
          className="form-control"
          value={state.email}
          onChange={handleChange}
        />
        <label className="form-label">Email</label>
      </div>

      <div className="form-outline mb-4">
        <input
          type="password"
          id="password"
          name="password"
          className="form-control"
          value={state.password}
          onChange={handleChange}
        />
        <label className="form-label" htmlFor="password">Password</label>
      </div>

      <div className="pt-1 mb-4 d-flex gap-2">
        <button className="btn flex-fill me-2" type="button" style={{ backgroundColor: "#F4C3D2" }} onClick={handleForm}>
          Login
        </button>
        <button className="btn flex-fill" style={{backgroundColor: "#F4C3D2"}} type="button">
        <a href="/register" style={{textDecoration: 'none', color:'black'}}>
        Register
        </a>
      </button>
      </div>

      <Button variant="danger" onClick={handleGoogleLogin} className="w-100">
        Login with Google
      </Button>
    </form>
    </div>
  );
};