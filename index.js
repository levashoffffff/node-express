const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRouter = require('./routes/courses');
const cardRoutes = require('./routes/card');

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

//Зарегистрировали папку как публичную
app.use(express.static('public'));

//Middleware для получения данных с форм
app.use(express.urlencoded({extended: true}));

//Регистируем роуты
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRouter);
app.use('/card', cardRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})