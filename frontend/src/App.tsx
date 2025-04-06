import React from "react";
import {BrowserRouter, Route, Routes} from 'react-router'
import Home from "./pages/Home.tsx";
import Homepage from "./pages/Homepage.tsx";

const App: React.FC = () => {
  // State for inputs
  

  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/home" element={<Homepage/>}/>
    </Routes>
   </BrowserRouter>
  );
};

export default App;