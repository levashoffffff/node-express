const {Router} = require('express');
const router = Router();

//Для обработки get запроса
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Главная страница',
        isHome: true
    })
})

module.exports = router;