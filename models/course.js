// Импортируем необходимые модули из библиотеки mongoose
const {Schema, model} = require('mongoose');

// Определяем схему для модели "Course"
const course = new Schema({
    // Поле "title" (название курса)
    title: {
        type: String, // Тип данных - строка
        required: true // Поле является обязательным
    },
    // Поле "price" (цена курса)
    price: {
        type: Number, // Тип данных - число
        required: true // Поле является обязательным
    },
    // Поле "img" (URL изображения курса)
    img: String // Тип данных - строка
    // Поле "id" будет создаваться mongoose автоматически как "_id"
})

// Добавляем метод "toClient" к схеме
course.method('toClient', function() {
    // Преобразуем объект mongoose в обычный объект JavaScript
    const course = this.toObject();

    // Добавляем новое поле "id", значение которого берется из "_id"
    course.id = course._id;
    // Удаляем старое поле "_id"
    delete course._id;

    // Возвращаем измененный объект
    return course;
})

// Экспортируем модель "Course", созданную на основе схемы "course"
module.exports = model('Course', course)