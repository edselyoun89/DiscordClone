const mongoose = require("mongoose");

// Схема пользователя для базы данных (MongoDB)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, enum: ["online", "offline", "busy"], default: "offline" },
  createdAt: { type: Date, default: Date.now }
});

const UserModel = mongoose.model("User", UserSchema);

// Класс пользователя для WebSocket (хранится в памяти сервера)
class User {
  constructor(socketId, username) {
    this.socketId = socketId; // ID сокета (WebSocket)
    this.username = username; // Имя пользователя
    this.status = "online"; // Статус пользователя ("online", "offline", "busy")
  }

  // Установка статуса пользователя
  setStatus(status) {
    if (["online", "offline", "busy"].includes(status)) {
      this.status = status;
    }
  }

  // Получение данных пользователя в JSON-формате
  toJSON() {
    return {
      socketId: this.socketId,
      username: this.username,
      status: this.status,
    };
  }
}

module.exports = {
  User,
  UserModel,
};
