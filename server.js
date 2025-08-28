// server.js
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

// ======= НАСТРОЙКИ =======
const BOT_TOKEN = '7887423687:AAE3EYy6rswQX0kUmM1ZXRxGltjaAjKlvWQ';  // вставь сюда токен бота
const ADMIN_ID = https://t.me/rainydave;           // твой Telegram ID, куда будут приходить заявки

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // если index.html + style.css + app.js лежат в папке 'public'

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
