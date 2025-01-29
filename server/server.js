require("dotenv").config(); // Загружаем переменные из .env

const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const config = require("./config");
const { User } = require("./models/User");
const Channel = require("./models/Channel");
const Message = require("./models/Message");

// Маршруты
const authRoutes = require("./routes/auth");
const callRoutes = require("./routes/call");
const chatRoutes = require("./routes/chat");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: config.CORS_OPTIONS });

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Подключено к MongoDB"))
  .catch((err) => console.error("❌ Ошибка подключения к MongoDB:", err));


app.use(express.json()); // Позволяет получать JSON в `req.body`
app.use(cors(config.CORS_OPTIONS));

// Подключение маршрутов
app.use("/auth", authRoutes);
app.use("/call", callRoutes(io));
app.use("/chat", chatRoutes(io));

const users = new Map(); // Список пользователей (socketId -> User)
const channels = new Map(); // Каналы
const messageHistory = []; // История сообщений

// Создаём текстовые и голосовые каналы
channels.set("general", new Channel("general", "text"));
channels.set("voice-1", new Channel("voice-1", "voice"));

io.on("connection", (socket) => {
  console.log(`Пользователь подключился: ${socket.id}`);

  // Пользователь присоединился
  socket.on("user join", (username) => {
    const user = new User(socket.id, username);
    users.set(socket.id, user);
    
    console.log("Текущий список пользователей:", Array.from(users.values()).map((user) => user.toJSON()));

    io.emit("user list", Array.from(users.values()).map((user) => user.toJSON()));
  });

  // Установка статуса пользователя
  socket.on("set status", (status) => {
    if (users.has(socket.id)) {
      users.get(socket.id).setStatus(status);
      io.emit("user list", Array.from(users.values()).map((user) => user.toJSON()));
    }
  });

  // Присоединение к каналу
  socket.on("join channel", ({ channelName, userId }) => {
    if (channels.has(channelName)) {
      channels.get(channelName).join(userId);
      io.emit("channel update", {
        channelName,
        members: channels.get(channelName).getMembers(),
      });
    }
  });

  // Покидание канала
  socket.on("leave channel", ({ channelName, userId }) => {
    if (channels.has(channelName)) {
      channels.get(channelName).leave(userId);
      io.emit("channel update", {
        channelName,
        members: channels.get(channelName).getMembers(),
      });
    }
  });

  // Отправка сообщений
  socket.on("send message", ({ channel, sender, text }) => {
    const message = new Message(channel, sender, text);
    messageHistory.push(message);
    io.emit("new message", message.toJSON());
  });

  // Запрос истории сообщений
  socket.on("get messages", (channel) => {
    const channelMessages = messageHistory.filter((msg) => msg.channel === channel);
    socket.emit("message history", channelMessages.map((msg) => msg.toJSON()));
  });

  // Голосовой чат - Звонки
  socket.on("call", ({ from, to }) => {
    const targetSocketId = [...users.entries()].find(([_, name]) => name.username === to)?.[0];
    if (targetSocketId) {
      io.to(targetSocketId).emit("incoming call", { from });
    }
  });

  // Принятие вызова
  socket.on("accept call", (callerName) => {
    const callerSocketId = [...users.entries()].find(([_, name]) => name.username === callerName)?.[0];
    if (callerSocketId) {
      io.to(callerSocketId).emit("call accepted");
    }
  });

  // Завершение вызова
  socket.on("end call", (targetUser) => {
    const targetSocketId = [...users.entries()].find(([_, name]) => name.username === targetUser)?.[0];
    if (targetSocketId) {
      io.to(targetSocketId).emit("call ended");
    }
  });

  // WebRTC - Обработка ICE-кандидатов
  socket.on("candidate", (candidate) => {
    socket.broadcast.emit("candidate", candidate);
  });

  // WebRTC - Обработка предложений (Offer/Answer)
  socket.on("offer", (offer) => {
    socket.broadcast.emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    socket.broadcast.emit("answer", answer);
  });

  // Отключение пользователя
  socket.on("disconnect", () => {
    console.log(`Пользователь отключился: ${socket.id}`);
    users.delete(socket.id);
    io.emit("user list", Array.from(users.values()).map((user) => user.toJSON()));
  });
});

server.listen(config.SERVER_PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${config.SERVER_PORT}`);
});
