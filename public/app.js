//функция которая преобразует число в рубли в формате
const toCurrency = price => {
    return new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format(price)
}

//Находим все элементы price и преобразуем их в рубли
document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent);
})

//Находим элемент с id='card'
const $card = document.querySelector('#card');
//Если элемент найден
if ($card) {
    //Привязываем обработчик события клика к элемнту
    $card.addEventListener('click', event => {
        //Проверяем есть ли класс js-remove у элемента по которому кликнули
        if (event.target.classList.contains('js-remove')) {
            //Из дата атрибута элемента (по которому кликнули) достаем id
            const id = event.target.dataset.id;
            //Делаем delete запрос (на удаление карточки на бэк)
            fetch('/card/remove/' + id, {
                method: 'delete'
            }).then(res => res.json()) //получаем ответ в json
                .then(card => { //Если в обновленной карточке с учетом удаленного элемента есть элементы в свойстве courses
                    if (card.courses.length) {
                        //Обновляем таблицу
                        const html = card.courses.map(c => { // перерендерим страницу с учетом нового количества
                            return `
                            <tr>
                                <td>${c.title}</td>
                                <td>${c.count}</td>
                                <td>
                                    <button class="btn btn-small js-remove" data-id="${c.id}">Удалить</button>
                                </td>
                            </tr>
                        `
                        }).join('')
                        $card.querySelector('tbody').innerHTML = html; //Помещаем новую разметку в tbody
                        //Находим элемент price и преобразуем в рубли цену
                        $card.querySelector('.price').textContent = toCurrency(card.price);
                    } else {
                        $card.innerHTML = `<p>Корзина пуста</p>`;
                    }

                })
        }
    })
}