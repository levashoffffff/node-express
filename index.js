// Импортируем модуль express для создания и управления сервером.
const express = require('express');

// Импортируем модуль path для работы с путями файлов и директорий.
const path = require('path');

// Импортируем модуль express-handlebars для использования шаблонизатора Handlebars.
const exphbs = require('express-handlebars');

// Импортируем модуль mongoose для работы с базой данных MongoDB.
const mongoose = require('mongoose');

// Импортируем роуты для главной страницы.
const homeRoutes = require('./routes/home');

// Импортируем роуты для страницы добавления.
const addRoutes = require('./routes/add');

// Импортируем роуты для страницы курсов.
const coursesRouter = require('./routes/courses');

// Импортируем роуты для корзины.
const cardRoutes = require('./routes/card');

// Импортируем модель пользователя.
const User = require('./models/user');

// Создаем экземпляр приложения Express.
const app = express();

// Создаем и настраиваем экземпляр Handlebars.
const hbs = exphbs.create({
    defaultLayout: 'main', // Указываем основной макет по умолчанию.
    extname: 'hbs' // Указываем расширение для файлов шаблонов.
});

// Регистрируем Handlebars в качестве движка представлений в Express.
app.engine('hbs', hbs.engine);

// Устанавливаем 'hbs' в качестве используемого движка представлений.
app.set('view engine', 'hbs');

// Устанавливаем папку 'views' как директорию для хранения файлов представлений.
app.set('views', 'views');

// Промежуточное ПО (middleware) для добавления данных пользователя в каждый запрос.
app.use(async (req, res, next) => {
    try {
        // Ищем пользователя по статическому ID (в реальном приложении здесь будет аутентификация).
        const user = await User.findById('68d52ec3326e928d53cd33b3');

        // Прикрепляем найденного пользователя к объекту запроса.
        req.user = user;
        // Передаем управление следующему промежуточному ПО.
        next();
    } catch (e) {
        // В случае ошибки выводим ее в консоль.
        console.log(e);
    }
});

// Указываем Express, что папка 'public' должна использоваться для раздачи статических файлов.
app.use(express.static(path.join(__dirname, 'public')));

// Промежуточное ПО для парсинга данных, отправленных из HTML-форм.
app.use(express.urlencoded({ extended: true }));

// Подключаем роуты для главной страницы.
app.use('/', homeRoutes);

// Подключаем роуты для страницы добавления.
app.use('/add', addRoutes);

// Подключаем роуты для страницы курсов.
app.use('/courses', coursesRouter);

// Подключаем роуты для корзины.
app.use('/card', cardRoutes);

// Определяем порт, на котором будет работать сервер. Используем переменную окружения или 3000 по умолчанию.
const PORT = process.env.PORT || 3000;

// Асинхронная функция для запуска приложения и подключения к базе данных.
async function start() {
    try {
        // Строка подключения к MongoDB.
        const url = "mongodb://arturlevashoff_db_user:VPVSgg7iJs4qC2so@ac-vsrplqj-shard-00-00.aryxymm.mongodb.net:27017,ac-vsrplqj-shard-00-01.aryxymm.mongodb.net:27017,ac-vsrplqj-shard-00-02.aryxymm.mongodb.net:27017/crud?ssl=true&replicaSet=atlas-p2imdr-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
        // Подключаемся к базе данных MongoDB.
        await mongoose.connect(url);

        // Ищем одного пользователя в базе данных.
        const candidate = await User.findOne();
        // Если пользователь не найден,
        if (!candidate) {
            // создаем нового пользователя.
            const user = new User({
                email: 'levashoff@mail.ru', // Устанавливаем email.
                name: 'levashoff', // Устанавливаем имя.
                cart: { items: [] } // Инициализируем пустую корзину.
            });
            // Сохраняем нового пользователя в базе данных.
            await user.save();
        }

        // Запускаем сервер на указанном порту.
        app.listen(PORT, () => {
            // Выводим сообщение в консоль о том, что сервер запущен.
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        // В случае ошибки при запуске выводим ее в консоль.
        console.log(e);
    }
}

// Вызываем функцию для запуска приложения.
start();