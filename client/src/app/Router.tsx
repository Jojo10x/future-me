"use client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Profile from "./profile/page";


const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
