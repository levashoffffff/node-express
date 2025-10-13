// Импортируем Router из express для создания модульных обработчиков маршрутов
const { Router } = require('express');
// Импортируем модель Course для получения информации о курсах
const Course = require('../models/course');
// Создаем экземпляр роутера
const router = Router();

// Маршрут для добавления курса в корзину
router.post('/add', async (req, res) => {
    try {
        // Находим курс по id, который нужно добавить в корзину
        const course = await Course.findById(req.body.id);
        // Добавляем курс в корзину пользователя
        await req.user.addToCart(course);
        // Перенаправляем пользователя на страницу с курсами
        res.redirect('/card');
    } catch (e) {
        // В случае ошибки выводим ее в консоль
        console.log(e);
    }
});

// Маршрут для удаления курса из корзины
router.delete('/remove/:id', async (req, res) => {
    try {
        // Удаляем курс из корзины пользователя
        await req.user.removeFromCart(req.params.id);
        // Получаем обновленные данные о корзине
        const user = await req.user.populate('cart.items.courseId');
        // Преобразуем элементы корзины для удобного отображения
        const courses = user.cart.items.map(c => ({
            ...c.courseId._doc,
            id: c.courseId.id,
            count: c.count
        }));
        // Формируем объект корзины для отправки на клиент
        const card = {
            courses,
            price: courses.reduce((total, course) => total += course.price * course.count, 0)
        };
        // Отправляем обновленные данные о корзине в формате JSON
        res.status(200).json(card);
    } catch (e) {
        // В случае ошибки выводим ее в консоль
        console.log(e);
    }
});

// Маршрут для отображения страницы корзины
router.get('/', async (req, res) => {
    try {
        // Получаем данные о корзине пользователя
        /* const user = await req.user.populate('cart.items.courseId'); */
        // Преобразуем элементы корзины для удобного отображения
        /* const courses = user.cart.items.map(c => ({
            ...c.courseId._doc,
            id: c.courseId.id,
            count: c.count
        })); */
        // Формируем объект корзины для рендеринга страницы
        /* const card = {
            courses,
            price: courses.reduce((total, course) => total += course.price * course.count, 0)
        }; */
        // Рендерим страницу 'card'
        /* res.render('card', {
            title: 'Корзина', // Заголовок страницы
            isCard: true, // Флаг для выделения активной ссылки в навигации
            courses: card.courses, // Список курсов в корзине
            price: card.price // Общая стоимость курсов в корзине
        }); */
        res.json({test: true});
    } catch (e) {
        // В случае ошибки выводим ее в консоль
        console.log(e);
    }
});

// Экспортируем роутер для использования в основном файле приложения
module.exports = router;
