const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/User"); // Подключаем модель пользователя
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

// Регистрация нового пользователя
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Введите имя пользователя и пароль" });
    }

    // Проверяем, есть ли уже такой пользователь
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Пользователь уже существует" });
    }

    // Хешируем пароль перед сохранением
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "Регистрация успешна" });
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
});

// Вход в систему
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Введите имя пользователя и пароль" });
    }

    // Проверяем наличие пользователя
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Неверные учетные данные" });
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Неверные учетные данные" });
    }

    // Создаём токен JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token, username: user.username });
  } catch (error) {
    console.error("Ошибка входа:", error);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
});

// Получение данных пользователя
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Нет токена" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.userId).select("-password"); // Исключаем пароль

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json(user);
  } catch (error) {
    console.error("Ошибка получения пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
});

module.exports = router;
