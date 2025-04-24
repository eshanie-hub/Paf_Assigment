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
            <div className="card  mt-3" >
              <div className="card-body " >
                <div key={index}>
                <div class="row">
                <div class="col">
                 
                  <p className="card-text">{LearningPlan.description}  </p>
                </div>
                <div class="col">
                  <p className="card-text">{LearningPlan.date}</p>
                  <p className="card-text">Start time: {LearningPlan.startTime} - {LearningPlan.endTime}</p>
                </div>
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