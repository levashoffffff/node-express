const path = require('path');
const fs = require('fs');

//Путь к базе данных
const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'card.json'
)

class Card {
    static async add(course) {
        //Попадает объект c свойствами courses, price. 
        const card = await Card.fetch();

        //Если в массиве объектов courses находим совпадение. Возвращает индекс элемента
        const idx = card.courses.findIndex(c => c.id === course.id);
        //В переменной нужная карточка
        const candidate = card.courses[idx];


        if (candidate) {
            //курс ужe есть
            //Если в переменной есть карточка, значит необходимо увеличить количесво курсов на +1 
            candidate.count++;

            /* card.courses[idx] = candidate; */
        } else {
            //нужно добавить
            //Прописываем свойство количества 1
            course.count = 1;
            //Добавляем в массив объектов новый объект
            card.courses.push(course);
        }

        card.price += +course.price;

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    static async remove(id) {
        //Считываем данные из card.json (БД). Те элементы которые в корзине
        const card = await Card.fetch();
        
        const idx = card.courses.findIndex(c => c, id === id);
        const course = card.courses[idx];

        if (course.count === 1) {
            //Удалить
            card.courses = card.courses.filter(c => c.id !== id);
        } else {
            //Изменить количество
            card.courses[idx].count--;
        }

        card.price -= course.price;

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), err => {
                if (err) {
                    reject(err)
                } else {
                    resolve(card)
                }
            })
        })
    }

    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(p, 'utf-8', (err, content) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(JSON.parse(content))
                }
            })
        })
    }
}

module.exports = Card;