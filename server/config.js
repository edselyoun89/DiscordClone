require("dotenv").config(); // Загружаем переменные окружения из .env

const config = {
  SERVER_PORT: process.env.SERVER_PORT || 5000, // Читаем порт из .env, иначе 5000
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000", // Клиентский URL
  CORS_OPTIONS: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  WEBRTC_ICE_SERVERS: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "turn:turn.server.com", username: "user", credential: "password" }, // Добавлен TURN сервер (пример)
  ],
  JWT_SECRET: process.env.JWT_SECRET || "supersecretkey", // Защита токенов
  DB_URL: process.env.DB_URL || "mongodb://localhost:27017/chat-app", // Подключение к БД
};

module.exports = config;
