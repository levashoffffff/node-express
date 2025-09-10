const {Router} = require('express');
const Course = require('../models/course');
const router = Router();

router.get('/', async (req, res) => {
    const courses = await Course.getAll();
    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses: courses
    });
})

//Страница редактирования товара get запрос
router.get('/:id/edit', async (req, res) => {
    //Проверяем есть ли такой query параметр
    if(!req.query.allow) {
        return res.redirect('/');
    }

    //В переменную попадает нужный нам курс
    const course = await Course.getById(req.params.id);
    
    res.render('course-edit', {
        title: `Редактировать ${course.title}`,
        course
    })
})

//Страница редактирования товара post запрос
router.post('/edit', async (req, res) => {
    await Course.update(req.body);
    res.redirect('/courses');
})


//Страница открытой карточки товара
router.get('/:id', async (req, res) => {
    const course = await Course.getById(req.params.id);
    res.render('courser_page', {
        layout: 'empty',
        title: `Курс ${course.title}`,
        course: course
    });
})

module.exports = router;