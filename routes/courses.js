// Импортируем Router из express для создания модульных обработчиков маршрутов
const { Router } = require('express');
// Импортируем модель Course для взаимодействия с коллекцией курсов в базе данных
const Course = require('../models/course');
// Создаем экземпляр роутера
const router = Router();

// Маршрут для отображения списка всех курсов
router.get('/', async (req, res) => {
    try {
        // Асинхронно получаем все курсы из базы данных, заменяя userId на данные пользователя
        const courses = await Course.find().populate('userId', 'email name');
        // Рендерим страницу 'courses'
        res.render('courses', {
            title: 'Курсы', // Заголовок страницы
            isCourses: true, // Флаг для выделения активной ссылки в навигации
            // Преобразуем курсы для удобного отображения на клиенте
            courses: courses.map(c => c.toClient())
        });
    } catch (e) {
        // В случае ошибки выводим ее в консоль
        console.log(e);
    }
});

// Маршрут для удаления курса
router.post('/remove', async (req, res) => {
    try {
        // Удаляем курс по _id, полученному из тела запроса
        await Course.deleteOne({ _id: req.body.id });
        // Перенаправляем пользователя на страницу с курсами
        res.redirect('/courses');
    } catch (e) {
        // В случае ошибки выводим ее в консоль
        console.log(e);
    }
});

// Маршрут для отображения страницы редактирования курса
router.get('/:id/edit', async (req, res) => {
    try {
        // Проверяем, разрешено ли редактирование через query-параметр 'allow'
        if (!req.query.allow) {
            // Если не разрешено, перенаправляем на главную страницу
            return res.redirect('/');
        }
        // Находим курс по id из параметров URL
        const course = await Course.findById(req.params.id);
        // Рендерим страницу 'course-edit'
        res.render('course-edit', {
            title: `Редактировать ${course.title}`, // Динамический заголовок страницы
            // Преобразуем курс для удобного отображения на клиенте
            course: course.toClient()
        });
    } catch (e) {
        // В случае ошибки выводим ее в консоль
        console.log(e);
    }
});

// Маршрут для обновления данных курса
router.post('/edit', async (req, res) => {
    try {
        // Извлекаем id из тела запроса
        const { id } = req.body;
        // Удаляем id из объекта req.body, чтобы избежать его попадания в обновляемые данные
        delete req.body.id;
        // Находим курс по id и обновляем его данными из тела запроса
        await Course.findByIdAndUpdate(id, req.body);
        // Перенаправляем пользователя на страницу с курсами
        res.redirect('/courses');
    } catch (e) {
        // В случае ошибки выводим ее в консоль
        console.log(e);
    }
});

// Маршрут для отображения страницы отдельного курса
router.get('/:id', async (req, res) => {
    try {
        // Находим курс по id из параметров URL
        const course = await Course.findById(req.params.id);
        // Рендерим страницу 'course'
        res.render('course', {
            layout: 'empty', // Используем кастомный layout 'empty'
            title: `Курс ${course.title}`, // Динамический заголовок страницы
            // Преобразуем курс для удобного отображения на клиенте
            course: course.toClient()
        });
    } catch (e) {
        // В случае ошибки выводим ее в консоль
        console.log(e);
    }
});

// Экспортируем роутер для использования в основном файле приложения
module.exports = router;
