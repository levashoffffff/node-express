// Импортируем Schema и model из библиотеки mongoose
const {Schema, model} = require('mongoose');

// Создаем новую схему для пользователя
const userSchema = new Schema({
    // Определяем поле email
    email: {
        type: String, // Тип данных - строка
        required: true // Поле является обязательным
    },
    // Определяем поле name
    name: {
        type: String, // Тип данных - строка
        required: true // Поле является обязательным
    },
    // Определяем корзину пользователя
    cart: {
        // Корзина содержит массив элементов
        items: [
            {
                // Количество определенного товара в корзине
                count: {
                    type: Number, // Тип данных - число
                    required: true, // Поле является обязательным
                    default: 1 // Значение по умолчанию - 1
                },
                // ID курса, добавленного в корзину
                courseId: {
                    type: Schema.Types.ObjectId, // Тип данных - ObjectId
                    ref: 'Course', // Ссылка на модель 'Course'
                    required: true // Поле является обязательным
                }
            }
        ]
    }
})

// Добавляем метод addToCart к схеме пользователя
userSchema.methods.addToCart = function(course) {
    // Копируем элементы корзины
    const items = [...this.cart.items];
    // Ищем индекс курса в корзине
    const idx = items.findIndex(c => {
        return c.courseId.toString() === course._id.toString();
    })

    // Если курс уже есть в корзине, увеличиваем его количество
    if(idx >= 0) {
        items[idx].count = items[idx].count + 1;
    } else {
        // Иначе, добавляем новый курс в корзину
        items.push({
            courseId: course._id,
            count: 1
        })
    }

    /* const newCart = {items: items}
    this.cart = newCart */

    // Обновляем корзину пользователя
    this.cart = {items: items};
    // Сохраняем изменения
    return this.save();

}

// Экспортируем модель 'User' с определенной схемой
module.exports = model('User', userSchema);