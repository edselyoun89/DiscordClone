import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username.trim() !== "") {
      setIsAuthenticated(true);
      navigate("/main");
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h1 className="welcome-text">Добро пожаловать в чат</h1>
        <input
          type="text"
          className="input-field"
          placeholder="Введите имя..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>
          Войти
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
