// Импортируем Router из express и модель Course
const { Router } = require('express');
const Course = require('../models/course');
// Создаем новый роутер
const router = Router();

// Обрабатываем GET-запрос на путь '/'
router.get('/', async (req, res) => {
    // Получаем все курсы из базы данных
    const courses = await Course.find();
    // Рендерим страницу 'courses'
    res.render('courses', {
        title: 'Курсы', // Устанавливаем заголовок страницы
        isCourses: true, // Флаг для активной ссылки в навигации
        // Преобразуем курсы для клиента, чтобы заменить _id на id
        courses: courses.map(c => c.toClient())
    });
})

// Обрабатываем POST-запрос на путь '/remove' для удаления курса
router.post('/remove', async (req, res) => {
    try {
        // Удаляем курс по _id, который получаем из тела запроса
        await Course.deleteOne({
            _id: req.body.id
        })
        // Перенаправляем на страницу с курсами
        res.redirect('/courses')
    } catch (e) {
        // В случае ошибки выводим ее в консоль
        console.log(e);
    }
})

// Обрабатываем GET-запрос на страницу редактирования товара, например '/<id>/edit'
router.get('/:id/edit', async (req, res) => {
    // Проверяем, разрешено ли редактирование через query-параметр 'allow'
    if (!req.query.allow) {
        // Если не разрешено, перенаправляем на главную страницу
        return res.redirect('/');
    }

    // Находим курс по id, который получаем из параметров URL
    const course = await Course.findById(req.params.id);
    // Рендерим страницу 'course-edit'
    res.render('course-edit', {
        title: `Редактировать ${course.title}`, // Устанавливаем заголовок страницы
        // Преобразуем курс для клиента
        course: course.toClient()
    })
})

// Обрабатываем POST-запрос на путь '/edit' для обновления курса
router.post('/edit', async (req, res) => {
    // Извлекаем id из тела запроса
    const { id } = req.body;
    // Удаляем id из тела запроса, чтобы он не попал в обновляемые данные
    delete req.body.id;
    // Находим курс по id и обновляем его данными из тела запроса
    await Course.findByIdAndUpdate(id, req.body);
    // Перенаправляем на страницу с курсами
    res.redirect('/courses');
})


// Обрабатываем GET-запрос на страницу отдельного курса, например '/<id>'
router.get('/:id', async (req, res) => {
    // Находим курс по id из параметров URL
    const course = await Course.findById(req.params.id);
    // Рендерим страницу 'course'
    res.render('course', {
        layout: 'empty', // Используем пустой layout
        title: `Курс ${course.title}`, // Устанавливаем заголовок страницы
        // Преобразуем курс для клиента
        course: course.toClient()
    });
})

// Экспортируем роутер
module.exports = router;