import React from 'react'

export const Header = ({username}) => {
  return (
    <nav className="navbar">
      <h2>Welcome back, {username}</h2>
        <div>
          <button className="btn my-2 my-sm-0 me-2 " style={{backgroundColor: "#F4C3D2"}} type="submit">Notifications</button>
          <button className="btn" style={{  borderColor: "#FF0051", color: "black" }} type="submit">Logout</button>
        </div>
        
    </nav>
  )
}