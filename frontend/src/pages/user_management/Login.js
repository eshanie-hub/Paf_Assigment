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
    <form>
      <div className="d-flex align-items-center mb-3 pb-1">
        <i className="fas fa-cubes fa-2x me-3" style={{ color: "#e2dad6" }}></i>
        <span className="h1 fw-bold mb-0">Login</span>
      </div>

      <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: "1px" }}>Sign into your account</h5>

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

      <div className="pt-1 mb-4">
        <button className="btn btn-lg btn-block" type="button" style={{ backgroundColor: "#c1b688" }} onClick={handleForm}>
          Login
        </button>
      </div>

      <Button variant="danger" onClick={handleGoogleLogin} className="w-100">
        Login with Google
      </Button>
    </form>
  );
};