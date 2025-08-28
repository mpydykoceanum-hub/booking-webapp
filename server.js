const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = 'ВАШ_ТОКЕН_БОТА';
const ADMIN_ID = 123456789; // ваш Telegram ID
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // если хостите index.html + CSS + JS тут

// Эндпоинт для WebApp
app.post('/booking', (req, res) => {
    const data = req.body;
    const msg = `Новая запись:\nУслуга: ${data.service}\nДата: ${data.date}\nВремя: ${data.time}\nТелефон: ${data.phone}`;
    bot.sendMessage(ADMIN_ID, msg);
    res.send({ ok: true });
});

app.listen(3000, () => console.log('Server running on port 3000'));
