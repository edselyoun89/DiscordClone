import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.js";
import MainPage from "./pages/MainPage.js";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/main"
          element={
            isAuthenticated ? <MainPage socket={socket} /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
