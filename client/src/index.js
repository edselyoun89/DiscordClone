import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js"; // Добавлено расширение .js
import "./styles.css"; // Подключение глобальных стилей
import "bootstrap/dist/css/bootstrap.min.css"; // Подключение Bootstrap
import "./styles.css"; // Убедитесь, что файл действительно существует

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
