import React, { useState, useEffect } from "react";
import axios from "axios";
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