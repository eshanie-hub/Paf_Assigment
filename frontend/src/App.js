import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Navbar } from "./components/Navbar";


import { LearningPlanView } from "./pages/learning_plan/Learning_plan_view";
import { LearningPlanCreate } from "./pages/learning_plan/Learning_plan_create";
import { LearningPlanUpdate } from "./pages/learning_plan/Learning_plan_update";
import {LearningPlanCalendar} from "./pages/learning_plan/Learning_plan_calendar"

function App() {
  return (
    <BrowserRouter>
    
      <div className="mx-5 my-3">
      <Header username="Eshanie"/>
      <div className="d-flex flex-row mt-4 gap-5 " >  
      
      <Navbar />
      <div className="p-3 flex-grow-1"  style={{backgroundColor: "#FFF5F7"}}>
        <Routes>
          <Route path="/pages/learning_plan/learning_plan_view" element={<LearningPlanView/>}></Route>
          <Route path="/pages/learning_plan/Learning_plan_create" element={<LearningPlanCreate/>}></Route>
          <Route path="/pages/learning_plan/Learning_plan_update/:id" element={<LearningPlanUpdate/>}></Route>
          <Route path="/pages/learning_plan/Learning_plan_calendar" element={<LearningPlanCalendar/>}></Route>

        </Routes>
      </div>
      </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
