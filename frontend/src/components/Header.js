import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { setLogout } from "../state/state.js";
import { useNavigate } from 'react-router-dom';


export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userName = useSelector(state => state.name);
  
  const logout = () =>{
      dispatch(setLogout());
      navigate("/login")
  }

  return (
    <nav className="navbar">
      <h2>Welcome back, {userName}</h2>
        <div>
          <button className="btn my-2 my-sm-0 me-2 " style={{backgroundColor: "#F4C3D2"}} type="submit">Notifications</button>
          <button className="btn" style={{  borderColor: "#FF0051", color: "black" }} type="submit" onClick={logout}>Logout</button>
        </div>
        
    </nav>
  )
}