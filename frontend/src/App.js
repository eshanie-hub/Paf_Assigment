import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Navbar } from "./components/Navbar";
import PostForm from './pages/post_management/Post_Form';
import PostManagementCreate from './pages/post_management/post_management_create';
import PostManagementView from './pages/post_management/Post_management_view';
import PostManagementDelete from './pages/post_management/post_management_delete';
import PostManagementUpdate from './pages/post_management/Post_management_update';

function App() {
  return (
    <BrowserRouter>
    
      <div className="mx-5 my-3">
      <Header username="Eshanie"/>
      <div className="d-flex flex-row mt-4 gap-5 " >  
      
      <Navbar />
      <div className="p-3 flex-grow-1"  style={{backgroundColor: "#FFF5F7"}}>
        <Routes>
          

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
