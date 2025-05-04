import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Navbar } from "./components/Navbar";

import LearningProgressView from "./pages/learning_progress/Learning_Progress_view";
import LearningProgressStatsCreate from "./pages/learning_progress/Learning_progress_stats_create";
import LearningProgressUpdate from "./pages/learning_progress/Learning_progress_update";
import LearningProgressTableCreate from "./pages/learning_progress/Learning_progress_table_create";

import { EventManagementCreate } from "./pages/event_management/Event_management_create";
import { EventManagementUpdate } from "./pages/event_management/Event_management_update";
import { EventManagementSingleView } from "./pages/event_management/Event_management_single_view";
import { EventManagementView } from "./pages/event_management/Event_management_view";
import { EventManagementBrowse } from './pages/event_management/Event_management_browse';

import { LearningPlanView } from "./pages/learning_plan/Learning_plan_view";
import { LearningPlanCreate } from "./pages/learning_plan/Learning_plan_create";
import { LearningPlanUpdate } from "./pages/learning_plan/Learning_plan_update";
import { LearningPlanCalendar } from "./pages/learning_plan/Learning_plan_calendar";

import PostForm from './pages/post_management/Post_Form';
import PostManagementCreate from './pages/post_management/post_management_create';
import PostManagementDelete from './pages/post_management/post_management_delete';
import PostManagementUpdate from './pages/post_management/post_management_update';
import PostManagementView from './pages/post_management/post_management_view';

import { Login } from "./pages/user_management/Login";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="mx-5 my-3">
      <Header username="Eshanie" />
      <div className="d-flex flex-row mt-4 gap-5">
        <Navbar />
        <div className="p-3 flex-grow-1" style={{ backgroundColor: "#FFF5F7" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page without layout */}
        <Route path="/login" element={<Login />} />

        {/* Routes with layout */}
        <Route path="/" element={<MainLayout />}>
          {/* Event Management */}
          <Route path="pages/event_management/Event_management_create" element={<EventManagementCreate />} />
          <Route path="pages/event_management/Event_management_update/:id" element={<EventManagementUpdate />} />
          <Route path="pages/event_management/Event_management_browse" element={<EventManagementBrowse />} />
          <Route path="pages/event_management/Event_management_single_view/:id" element={<EventManagementSingleView />} />
          <Route path="pages/event_management/Event_management_view" element={<EventManagementView />} />

          {/* Learning Plan */}
          <Route path="pages/learning_plan/learning_plan_view" element={<LearningPlanView />} />
          <Route path="pages/learning_plan/Learning_plan_create" element={<LearningPlanCreate />} />
          <Route path="pages/learning_plan/Learning_plan_update/:id" element={<LearningPlanUpdate />} />
          <Route path="pages/learning_plan/Learning_plan_calendar" element={<LearningPlanCalendar />} />

          {/* Post Management */}
          <Route path="pages/post_management/Home" element={<PostManagementView />} />
          <Route path="pages/post_management/Post_Form/:id" element={<PostForm />} />
          <Route path="pages/post_management/Post_management_create" element={<PostManagementCreate />} />
          <Route path="pages/post_management/Post_management_delete/:id" element={<PostManagementDelete />} />
          <Route path="pages/post_management/Post_management_update/:id" element={<PostManagementUpdate />} />

          {/* Learning Progress */}
          <Route path="pages/learning_progress/Learning_progress_create" element={<LearningProgressStatsCreate />} />
          <Route path="pages/learning_progress/Learning_progress_table_create" element={<LearningProgressTableCreate />} />
          <Route path="pages/learning_progress/Learning_progress_update/:id" element={<LearningProgressUpdate />} />
          <Route path="pages/learning_progress/learning_progress_view" element={<LearningProgressView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
