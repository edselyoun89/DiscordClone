const express = require("express");
const router = express.Router();

module.exports = (io, users) => {
  // Начало звонка
  router.post("/call", (req, res) => {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({ message: "Необходимо указать вызывающего и вызываемого пользователя." });
    }

    // Найти пользователя, которому звонят
    const targetSocketId = [...users.entries()].find(([_, user]) => user.username === to)?.[0];

    if (targetSocketId) {
      io.to(targetSocketId).emit("incoming call", { from });
      res.json({ message: `Звонок отправлен пользователю ${to}` });
    } else {
      res.status(404).json({ message: "Пользователь не в сети" });
    }
  });

  // Принятие вызова
  router.post("/accept-call", (req, res) => {
    const { caller } = req.body;

    if (!caller) {
      return res.status(400).json({ message: "Необходимо указать вызывающего пользователя." });
    }

    const callerSocketId = [...users.entries()].find(([_, user]) => user.username === caller)?.[0];

    if (callerSocketId) {
      io.to(callerSocketId).emit("call accepted");
      res.json({ message: "Звонок принят" });
    } else {
      res.status(404).json({ message: "Вызывающий пользователь не в сети" });
    }
  });

  // Отклонение вызова
  router.post("/reject-call", (req, res) => {
    const { caller } = req.body;

    if (!caller) {
      return res.status(400).json({ message: "Необходимо указать вызывающего пользователя." });
    }

    const callerSocketId = [...users.entries()].find(([_, user]) => user.username === caller)?.[0];

    if (callerSocketId) {
      io.to(callerSocketId).emit("call rejected");
      res.json({ message: "Звонок отклонен" });
    } else {
      res.status(404).json({ message: "Вызывающий пользователь не в сети" });
    }
  });

  // Завершение вызова
  router.post("/end-call", (req, res) => {
    const { caller, receiver } = req.body;

    if (!caller || !receiver) {
      return res.status(400).json({ message: "Необходимо указать участников вызова." });
    }

    const callerSocketId = [...users.entries()].find(([_, user]) => user.username === caller)?.[0];
    const receiverSocketId = [...users.entries()].find(([_, user]) => user.username === receiver)?.[0];

    if (callerSocketId) io.to(callerSocketId).emit("call ended");
    if (receiverSocketId) io.to(receiverSocketId).emit("call ended");

    res.json({ message: "Звонок завершен" });
  });

  return router;
};
