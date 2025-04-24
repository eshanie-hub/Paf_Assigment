import { BrowserRouter, Routes, Route } from "react-router-dom"

import { Navbar } from "./components/Navbar";

import LearningProgressView from "./pages/learning_progress/Learning_Progress_view";
import LearningProgressStatsCreate from "./pages/learning_progress/Learning_progress_stats_create";
import LearningProgressUpdate from "./pages/learning_progress/Learning_progress_update";
import LearningProgressTableCreate from "./pages/learning_progress/Learning_progress_table_create";

import { Header } from "./components/Header";





function App() {
  return (
    <BrowserRouter>

      <div className="mx-5 my-3">
        <Header username="Eshanie" />
        <div className="d-flex flex-row mt-4 gap-5 " >

          <Navbar />
          <div className="p-3 flex-grow-1" style={{ backgroundColor: "#FFF5F7" }}>
            <Routes>

              {/* learning progress routes */}
              <Route path="/pages/learning_progress/Learning_progress_create" element={<LearningProgressStatsCreate />}></Route>
              <Route path="/pages/learning_progress/Learning_progress_table_create" element={<LearningProgressTableCreate />}></Route>
              <Route path="/pages/learning_progress/Learning_progress_update/id" element={<LearningProgressUpdate />}></Route>
              <Route path="/pages/learning_progress/learning_progress_view" element={<LearningProgressView />}></Route>


            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
