import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { LearningPlanSummary } from './Learning_plan_summary';


export const LearningPlanView = () => {
  const [state, setState] = useState({
    LearningPlan: [],
    filteredPlans: []
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get("http://localhost:8080/api/learningPlan", {withCredentials: true}).then(res => {
      if(res.data){
        setState({
          LearningPlan: res.data,
          filteredPlans: res.data
        });
      }
    });
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setState(prev => ({...prev, filteredPlans: prev.LearningPlan}));
    } else {
      setState(prev => ({
        ...prev,
        filteredPlans: prev.LearningPlan.filter(plan => plan.title === filter)
      }));
    }
  }, [filter]);



  return (
    <div className='p-2'>
  <div className="gap-2 row">
    <div className="col">
      <h3>Today's Learning Plan!</h3>
    </div>
    <div className="col d-flex justify-content-end align-items-center">
      {/* Filter Dropdown */}
      <div className="dropdown me-2">
        <button 
          className="btn dropdown-toggle" 
          style={{backgroundColor: "#F4C3D2"}} 
          type="button" 
          id="filterDropdown" 
          data-bs-toggle="dropdown" 
          aria-expanded="false"
        >
          Filter: {filter === 'all' ? 'All' : filter}
        </button>
        <ul className="dropdown-menu" aria-labelledby="filterDropdown">
          <li><button className="dropdown-item" onClick={() => setFilter('all')}>All</button></li>
          <li><button className="dropdown-item" onClick={() => setFilter('Urgent')}>Urgent</button></li>
          <li><button className="dropdown-item" onClick={() => setFilter('Normal')}>Normal</button></li>
        </ul>
      </div>
      
      {/* Action Buttons */}
      <button className="btn me-2" style={{backgroundColor: "#F4C3D2"}} type="button">
        <a href="/pages/learning_plan/Learning_plan_create" style={{textDecoration: 'none', color:'black'}}>
          Create
        </a>
      </button>
      <button className="btn" style={{backgroundColor: "#F4C3D2"}} type="button">
        <a href="/pages/learning_plan/Learning_plan_calendar" style={{textDecoration: 'none', color:'black'}}>
          Calendar
        </a>
      </button>
    </div>
  </div>

  <div className="row">
    {/* Left Column - Learning Plans List */}
    <div className="col-md-6">
      {state.filteredPlans.map((LearningPlan, index) => (
        <div className="card mt-3" key={index}>
          <div className="card-body p-0">
            <div className="d-flex">
              {/* Left Section with Month and Date */}
              <div className="d-flex flex-column align-items-center justify-content-start bg-light p-3" style={{width: "80px"}}>
                <span className="text-uppercase small">
                  {new Date(LearningPlan.date).toLocaleString('default', {month: 'short'})}
                </span>
                <h2 className="m-0" style={{fontSize: "2rem"}}>
                  {LearningPlan.date.split('-')[2]}
                </h2>
              </div>
        
              {/* Middle Section with Content */}
              <div className="d-flex flex-column p-3 flex-grow-1">
                <div className="d-flex justify-content-between align-items-start">
                  <span className={`badge ${LearningPlan.title === 'Urgent' ? 'bg-danger' : 'bg-primary'}`}>
                    {LearningPlan.title}
                  </span>
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

    {/* Right Column - LearningPlanSummary with Gap */}
    <div className="col-md-6">
      <div className="ps-md-3 sticky-top" style={{top: '20px'}}>
        <LearningPlanSummary/>
      </div>
    </div>
  </div>
</div>
   
  )
}
