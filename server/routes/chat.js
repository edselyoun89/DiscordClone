const express = require("express");
const router = express.Router();
const Message = require("../models/Message"); // Подключаем модель сообщений

module.exports = (io, messageHistory) => {
  // Отправка сообщения
  router.post("/send", (req, res) => {
    const { channel, sender, text } = req.body;

    if (!channel || !sender || !text) {
      return res.status(400).json({ message: "Все поля обязательны" });
    }

    const newMessage = new Message(channel, sender, text);
    messageHistory.push(newMessage);

    io.to(channel).emit("new message", newMessage.toJSON()); // Отправка сообщения только в канал

    res.json({ message: "Сообщение отправлено", data: newMessage });
  });

  // Получение истории сообщений
  router.get("/history/:channel", (req, res) => {
    const { channel } = req.params;
    const channelMessages = messageHistory.filter((msg) => msg.channel === channel);
    res.json(channelMessages.map((msg) => msg.toJSON()));
  });

  return router;
};
