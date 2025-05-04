import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

export const LearningPlanUpdate = () => {
    const params = useParams();
  const navigate = useNavigate();
    const [state, setState] = useState({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: ""
      })

    
      const [errors, setErrors] = useState({});
      const [submitting, setSubmitting] = useState(false);

      const validateValues = (inputValues) => {
        let errors = {};
        if (inputValues.title.length < 1) {
          errors.title = "title can't be null";
        }

        if (inputValues.description.length < 1) {
          errors.description = "description can't be null";
        }

      
        if (inputValues.date.length < 1) {
          errors.date = "date can't be null";
        }
        
        
        //time can't be null
        if (inputValues.startTime < 1) {
          errors.startTime = "time can't be null";
        }

        //time can't be null
        if (inputValues.endTime < 1) {
          errors.endTime = "time can't be null";
        }

        return errors;
      };

      const handleChange = (e) =>{
        setState({ ...state, [e.target.name]: e.target.value });
        setErrors(validateValues(state));
      }
      
      const handleSubmit = (event) =>{
        event.preventDefault();
        setErrors(validateValues(state));
        setSubmitting(true);

        if(Object.keys(errors).length === 0 && submitting){
          const 
        {
            title, 
            description, 
            date,
            startTime,
            endTime
        } = state;
    
        const data = {
          title: title,
          description: description,
          date: date,
          startTime: startTime,
          endTime: endTime
        }
        console.log(data);

        axios.put(`http://localhost:8080/api/learningPlan/${params.id}`, data, { withCredentials: true })
        .then((res) => {
          alert("Data submited successfully");
          navigate(-1);
        })
      }
      }
      
      useEffect(() => {
        axios.get(`http://localhost:8080/api/learningPlan/${params.id}`, { withCredentials: true }).then((res) => {
          if(res.data){
            setState({
              title: res.data.title,
              description: res.data.description,
              date: res.data.date,
              startTime: res.data.startTime,
              endTime: res.data.endTime
            })
            
          }
        })
      },[params.id]);
    return (
        <div className='p-5'>
          <h3 className='pb-5 text-center'>Learning Plan Edit</h3>
          <form>
          <div class="row mt-4 mb-3">
            <div class="col">
              <label class="form-label">Title</label>
              <input 
                type="text"
                name="title" 
                className='form-control'
                placeholder="Select title of the post"
                value={state.title}
                onChange={handleChange}
                />
                {errors.title && (
                  <div class="text-danger mt-2">
                    {errors.title}
                  </div>
                  )}
            
            </div>
    
              <div class="col">
                <label class="form-label">Date</label>
                <input 
                  type="date"
                  name="date" 
                  className='form-control'
                  placeholder="Enter date of the post"
                  value={state.date}
                  onChange={handleChange}
                  />
                  {errors.date && (
                    <div class="text-danger mt-2">
                      {errors.date}
                    </div>
                    )}
              </div>
              </div>
              <div class="row mt-4 mb-3">
              <div class="col">
                <label class="form-label">Start Time</label>
                <input 
                  type="time"
                  name="startTime" 
                  className='form-control'
                  placeholder="Enter time of the post"
                  value={state.startTime}
                  onChange={handleChange}
                  />
                  {errors.startTime && (
                    <div class="text-danger mt-2">
                      {errors.startTime}
                    </div>
                    )}
              </div>
    
              <div class="col">
                <label class="form-label">End Time</label>
                <input 
                  type="time"
                  name="endTime" 
                  className='form-control'
                  placeholder="Enter time of the post"
                  value={state.endTime}
                  onChange={handleChange}
                  />
                  {errors.endTime && (
                    <div class="text-danger mt-2">
                      {errors.endTime}
                    </div>
                    )}
              </div>
            </div>
    
            <div class="mb-3">
              <label class="form-label">Description</label>
              <input 
                  type="text"
                  name="description" 
                  className='form-control'
                  placeholder="Enter description of the post"
                  value={state.description}
                  onChange={handleChange}
                  />
                  {errors.description && (
                    <div class="text-danger mt-2">
                      {errors.description}
                    </div>
                    )}
            </div>
            <button className='btn mt-5' style={{backgroundColor: "#c1b688 "}} type='submit' onClick={handleSubmit}>
              Edit learning plan
            </button>
            
          </form>
    
          
        </div>
      )
    }
    