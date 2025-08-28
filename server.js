const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

// ======= НАСТРОЙКИ =======
const BOT_TOKEN = process.env.BOT_TOKEN;  // токен берём из переменной окружения
if (!BOT_TOKEN) {
    console.error('Ошибка: BOT_TOKEN не задан! Установите переменную окружения.');
    process.exit(1);
}

const ADMIN_ID = process.env.ADMIN_ID;    // Telegram ID админа, тоже через переменную окружения
if (!ADMIN_ID) {
    console.error('Ошибка: ADMIN_ID не задан! Установите переменную окружения.');
    process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // index.html, style.css, app.js

// ======= ЭНДПОИНТ ДЛЯ ЗАЯВОК =======
app.post('/booking', (req, res) => {
    const data = req.body;

    const msg = `📌 Новая запись:\n` +
                `Услуга: ${data.service}\n` +
                `Дата: ${data.date}\n` +
                `Время: ${data.time}\n` +
                `Телефон: ${data.phone}`;

    bot.sendMessage(ADMIN_ID, msg);
    res.send({ ok: true });
});

// ======= ЗАПУСК СЕРВЕРА =======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
