import { BrowserRouter, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
    
      <div className="mx-5 my-3">
      <Header username="Eshanie"/>
      <div className="d-flex flex-row mt-4 gap-5 " >  
      
      <Navbar />
      <div className="p-3 flex-grow-1"  style={{backgroundColor: "#FFF5F7"}}>
        <Routes>
        </Routes>
      </div>
      </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
