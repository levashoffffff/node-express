// Импортируем Schema и model из mongoose для создания схемы и модели
const { Schema, model } = require('mongoose');

// Определяем схему для модели Course
const courseSchema = new Schema({
    // Поле title (название курса)
    title: {
        type: String, // Тип данных - строка
        required: true // Поле является обязательным
    },
    // Поле price (цена курса)
    price: {
        type: Number, // Тип данных - число
        required: true // Поле является обязательным
    },
    // Поле img (URL изображения курса)
    img: String, // Тип данных - строка
    // Поле userId (идентификатор пользователя, создавшего курс)
    userId: {
        type: Schema.Types.ObjectId, // Тип данных - ObjectId
        ref: 'User' // Ссылка на модель User
    }
});

// Добавляем метод toClient к схеме для преобразования объекта курса
courseSchema.method('toClient', function() {
    // Преобразуем объект mongoose в обычный объект JavaScript
    const course = this.toObject();

    // Заменяем поле _id на id для удобства работы на клиенте
    course.id = course._id;
    delete course._id;

    // Возвращаем преобразованный объект
    return course;
});

// Экспортируем модель Course, созданную на основе схемы courseSchema
module.exports = model('Course', courseSchema);
