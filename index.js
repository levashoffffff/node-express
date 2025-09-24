const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
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
app.use(express.static(path.join(__dirname, 'public')));

//Middleware для получения данных с форм
app.use(express.urlencoded({ extended: true }));

//Регистируем роуты
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRouter);
app.use('/card', cardRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        const url = "mongodb://arturlevashoff_db_user:VPVSgg7iJs4qC2so@ac-vsrplqj-shard-00-00.aryxymm.mongodb.net:27017,ac-vsrplqj-shard-00-01.aryxymm.mongodb.net:27017,ac-vsrplqj-shard-00-02.aryxymm.mongodb.net:27017/crud?ssl=true&replicaSet=atlas-p2imdr-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
        await mongoose.connect(url);
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();
