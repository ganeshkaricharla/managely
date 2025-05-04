import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import GlobalSearch from "./pages/GlobalSearch";
import Tasks from "./pages/Tasks";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/search" element={<GlobalSearch />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
