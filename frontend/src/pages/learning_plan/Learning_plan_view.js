import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { LearningPlanCalendar } from './Learning_plan_calendar';

export const LearningPlanView = () => {
  const [state, setState] = useState({
    LearningPlan: []
  })
  useEffect(() => {
    axios.get("http://localhost:8080/api/learningPlan").then(res => {
      if(res.data){
        setState({
          LearningPlan: res.data
        })
      }
    })
  }, []);

  const onDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this plan?"
    );
    if (confirmDelete) {
      axios
        .delete(`http://localhost:8080/api/learningPlan/${id}`)
        .then((res) => {
          alert("Deleted successfully");
          // Optionally, you can update the state after deletion
          setState((prevState) => ({
            LearningPlan: prevState.LearningPlan.filter(
              (item) => item.id !== id
            ),
          }));
        })
        .catch((error) => {
          console.error("Error deleting plan:", error);
          alert("Failed to delete plan");
        });
    }
  };

  return (
    <div className='p-2'>
      
      
      <div className="gap-2 row">
      <div className="col">
      <h3>Today's Learning Plan!</h3>
      </div>
      <div className="col">
        {/* <p class="card-text">calendar with events </p>  */}
        <button className="btn my-2 my-sm-0 me-2 " style={{backgroundColor: "#F4C3D2"}} type="submit" >
          <a href="/pages/learning_plan/Learning_plan_create" style={{textDecoration: 'none', color:'black'}}>
            Create
          </a>
        </button>
        <button className="btn my-2 my-sm-0 me-2 " style={{backgroundColor: "#F4C3D2"}} type="submit" >
          <a href="/pages/learning_plan/Learning_plan_calendar" style={{textDecoration: 'none', color:'black'}}>
            Go to the calendar
          </a>
        </button>
        </div>
        </div>
      <div className="row">
        <div className="col-5 ">
          {state.LearningPlan.map((LearningPlan, index) => (
            <div className="card mt-3">
            <div className="card-body p-0">
              <div key={index} className="d-flex">
                {/* Left Section with Month and Date */}
                <div className="d-flex flex-column align-items-center justify-content-start bg-light p-3" style={{width: "80px"}}>
                  <span className="text-uppercase small">{new Date(LearningPlan.date).toLocaleString('default', {month: 'short'})}</span>
                  <h2 className="m-0" style={{fontSize: "2rem"}}>{LearningPlan.date.split('-')[2]}</h2>
                </div>

                {/* Middle Section with Content */}
                <div className="d-flex flex-column p-3 flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <span className="badge bg-danger">{LearningPlan.title}</span>
                  </div>
                  <p className="card-text mt-2 mb-1">{LearningPlan.description}</p>
                </div>

                {/* Right Section with Time */}
                <div className="d-flex flex-column align-items-end justify-content-center p-3">
                  <p className="card-text text-muted small m-0">
                    <i className="bi bi-clock me-1"></i>
                    {LearningPlan.startTime} - {LearningPlan.endTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
          ))}
          

          
          </div>
          <div className="d-flex col">
            Time management
            <div className=''>
            <p>Busy Times in a day</p>
            <p>Busy Days </p>
            </div>
          </div>
        
      </div>

      
    </div>
   
  )
}