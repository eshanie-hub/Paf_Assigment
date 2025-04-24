import { BrowserRouter, Routes,Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Navbar } from "./components/Navbar";


import { EventManagementCreate } from "./pages/event_management/Event_management_create";
import { EventManagementUpdate } from "./pages/event_management/Event_management_update";
import { EventManagementSingleView } from "./pages/event_management/Event_management_single_view";
import { EventManagementView } from "./pages/event_management/Event_management_view";
import { EventManagementBrowse } from './pages/event_management/Event_management_browse';


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

        </Routes>
      </div>
      </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
