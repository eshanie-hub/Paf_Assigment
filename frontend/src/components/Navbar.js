import React from 'react'
import { useEffect } from "react";
import { useLocation } from "react-router-dom";


export const Navbar = () => {
    
    const location = useLocation(); // Get current URL
    
    useEffect(() => {
        const navLinks = document.querySelectorAll(".nav-link");
        navLinks.forEach((link) => {
        if (link.getAttribute("href") === location.pathname) {
            link.classList.add("active", "fw-bold"); // Active styles
            link.style.backgroundColor = "#F4C3D2";
            link.style.width = "100%"; // Make the background cover the full width
            link.style.display = "block"; // Ensure the link takes full width
            link.style.paddingLeft = "0"; // Remove extra padding
            link.style.paddingRight = "0"; // Remove extra padding
            link.style.borderRadius = "0"; 
            
        } else {
            link.classList.remove("active", "fw-bold");
            link.style.width = ""; // Reset width
            link.style.display = ""; // Reset display
            link.style.paddingLeft = ""; // Reset padding
            link.style.paddingRight = ""; // Reset padding
            link.style.borderRadius = "";

        }
        });
    }, [location]);

  return (
    <div className="row flex-nowrap ">
    <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0  pb-5 rounded-4 " style={{backgroundColor: "#FFF5F7", width: "250px", height: "80vh", minWidth: "250px" }}>
    <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-dark ">
          <a className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-dark text-decoration-none pb-5 pt-4">
           
            <span class="fs-5 d-none d-sm-inline"><b>ART</b></span>
           
        </a>
    
        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start text-dark" id="menu">
            <li className="nav-item mb-3">
            <a href="/pages/post_management/Home" className="nav-link align-middle px-3 text-dark rounded-pill" style={{ transition: "0.3s" }}>
                    <span className="">Home</span>
                </a>
            </li>
            <li className="nav-item mb-3">
            <a href="/pages/learning_plan/learning_plan_view" className="nav-link align-middle px-3 text-dark rounded-pill" style={{ transition: "0.3s" }}>
                    <span className="">Learning Plan</span>
                </a>
            </li>
            <li className="nav-item mb-3">
                <a href="/pages/learning_progress/learning_progress_view" className="nav-link align-middle px-3 text-dark rounded-pill" style={{ transition: "0.3s" }}>
                    <span className="">Learning Progress</span>
                </a>
            </li>
            <li className="nav-item mb-3">
                <a href="/pages/event_management/Event_management_view" className="nav-link align-middle px-3 text-dark rounded-pill" style={{ transition: "0.3s" }}>
                    <span className="">Event Management</span>
                </a>
            </li>
            <li className="nav-item mb-3">
                <a href="/pages/user_management/user_management_view" className="nav-link align-middle px-3 text-dark rounded-pill" style={{ transition: "0.3s" }}>
                    <span className="">Profile</span>
                </a>
            </li>
            </ul>
        </div>
    </div>
    </div>
    
  )
}
