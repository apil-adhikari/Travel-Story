import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React from "react";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/Signup";
import Home from "./pages/Home/Home";
import Signup from "./pages/Auth/Signup";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
