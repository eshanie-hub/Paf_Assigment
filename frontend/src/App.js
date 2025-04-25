import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Navbar } from "./components/Navbar";


import { EventManagementCreate } from "./pages/event_management/Event_management_create";
import { EventManagementUpdate } from "./pages/event_management/Event_management_update";
import { EventManagementSingleView } from "./pages/event_management/Event_management_single_view";
import { EventManagementView } from "./pages/event_management/Event_management_view";
import { EventManagementBrowse } from './pages/event_management/Event_management_browse';



import { LearningPlanView } from "./pages/learning_plan/Learning_plan_view";
import { LearningPlanCreate } from "./pages/learning_plan/Learning_plan_create";
import { LearningPlanUpdate } from "./pages/learning_plan/Learning_plan_update";
import {LearningPlanCalendar} from "./pages/learning_plan/Learning_plan_calendar"
import PostForm from './pages/post_management/Post_Form';
import PostManagementCreate from './pages/post_management/post_management_create';
import PostManagementDelete from './pages/post_management/post_management_delete';
import PostManagementUpdate from './pages/post_management/post_management_update';
import PostManagementView from './pages/post_management/post_management_view';
function App() {
  return (
    <BrowserRouter>
    
      <div className="mx-5 my-3">
      <Header username="Eshanie"/>
      <div className="d-flex flex-row mt-4 gap-5 " >  
      
      <Navbar />
      <div className="p-3 flex-grow-1"  style={{backgroundColor: "#FFF5F7"}}>
        <Routes>
          {/* event management routes */}
          <Route path="/pages/event_management/Event_management_create" element={<EventManagementCreate/>}></Route>
          <Route path="/pages/event_management/Event_management_update/:id" element={<EventManagementUpdate/>}></Route>
          <Route path="/pages/event_management/Event_management_browse" element={<EventManagementBrowse/>}></Route>
          <Route path="/pages/event_management/Event_management_single_view/:id" element={<EventManagementSingleView />} ></Route>
          <Route path="/pages/event_management/Event_management_view" element={<EventManagementView/>}></Route>

          <Route path="/pages/learning_plan/learning_plan_view" element={<LearningPlanView/>}></Route>
          <Route path="/pages/learning_plan/Learning_plan_create" element={<LearningPlanCreate/>}></Route>
          <Route path="/pages/learning_plan/Learning_plan_update/:id" element={<LearningPlanUpdate/>}></Route>
          <Route path="/pages/learning_plan/Learning_plan_calendar" element={<LearningPlanCalendar/>}></Route>

          

          {/* post management routes */}
          <Route path="/" element={<PostManagementView />} />
          <Route path="/pages/post_management/Post_Form/:id" element={<PostForm />} />
          <Route path="/pages/post_management/Post_management_create" element={<PostManagementCreate />} />
          <Route path="/pages/post_management/Post_management_delete/:id" element={<PostManagementDelete />} />
          <Route path="/pages/post_management/Post_management_update/:id" element={<PostManagementUpdate />} />

        </Routes>
      </div>
      </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
