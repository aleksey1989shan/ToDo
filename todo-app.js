
// alert('проект в разработке, некоторые функции пока не работают');

(function () {
    // массив для дел
    let listArray = [];
    let listName = '';

    //создаём и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        // присваиваем title которвй мы передаём в качестве аргумента
        appTitle.innerHTML = title;
        return appTitle;
    }
    // создаём и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'добавить дело';
        button.disabled = true;
        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }

    // создаём вощвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    // создаёт элемент для списка дел в вернёт всё необходимое для взаимодействия с этим элементом
    function createTodoItem(obj) {
        let item = document.createElement('li');
        // кнопки размещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deletBotton = document.createElement('button');

        // устанавливаем стили для элемента списка, а также для размещения кнопок в его правой части с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = obj.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'готово';
        deletBotton.classList.add('btn', 'btn-danger');
        deletBotton.textContent = 'удалить';

        if (obj.done == true) item.classList.add('list-group-item-success');

        // добавляем обработчики на кнопки
        doneButton.addEventListener('click', function () {
            item.classList.toggle('list-group-item-success')

            for (const listItem of listArray) {
                if (listItem.id == obj.id) listItem.done = !listItem.done
            }
            // делаю сохранение при выполнеи записи
            saveList(listArray, listName);

        });
        deletBotton.addEventListener('click', function () {
            // confirm - встроен в браузер и вернёт true если нажать да. Если нажимаем да, то удаляем элемент с помощью метода remove
            if (confirm('вы уверены?')) {
                item.remove();

                const currentName = item.firstChild.textContent

                for (let i = 0; i < listArray.length; i++) {
                    if (listArray[i].id == obj.id) listArray.splice(i, 1)
                }
                // делаю сохранение при удалении
                saveList(listArray, listName);
            }
        });

        // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deletBotton);
        item.append(buttonGroup);

        // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deletBotton,
        };
    }

    // создаю функцию которая проверяет id у item и находит больший, добавляет единицу и 
    // возвращает переменную с новым значением которое болше на единицу
    function getNewId(arr) {
        let max = 0;
        for (const item of arr) {
            if (item.id > max) max = item.id
        }
        return max + 1;
    }

    // функция сохранения данных
    function saveList(arr, keyName){
        localStorage.setItem(keyName, JSON.stringify(arr));
    }

    function createTodoApp(container, title = 'список дел', keyName) {
        // находим контейнер по id
        // let container = document.getElementById('todo-app');

        // вызывааем три функции которые содали до этого
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
        // код для демонстрации 1
        // let todoItems = [createTodoItem('сходить за хлебом'), createTodoItem('кпить молоко')];

        // делаю глобальный доступ
        listName = keyName;


        // их результат размещаем внутри контейнера
        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);
        // код для демонстрации 1
        // todoList.append(todoItems[0].item);
        // todoList.append(todoItems[1].item);

        // расшифровуем сохранённый массив
        let localData = localStorage.getItem(listName)
        // проверяю на пустоту при первом запуске чтобы небыло ошибки. 
        // и делаю превращение из строки в массив
        if (localData !== null && localData !== '') listArray = JSON.parse(localData);

        // выводим сохранённый список
        for (const itemList of listArray){
            let todoItem = createTodoItem(itemList);
            todoList.append(todoItem.item);
        }

        // браузер создаёт событие submit на форме по нажатию на enter или на кнопку создания дела
        todoItemForm.form.addEventListener('submit', function (e) {
            // эта строчка необходима, чтобы предотвратить стандартное действие браузера
            // в данном случае мы не хотим чтобы страница перезагружалась при отправке формы
            e.preventDefault();

            // игнорируем создание элемента если пользователь ничего не ввёл
            // проверяем есть ли какое-то значение внутри инпута, если там ничего нет возвращаемся и ничего не делаем
            if (!todoItemForm.input.value) {
                return;
            }

            // элемент массива listArray
            let newItem = {
                id: getNewId(listArray),
                name: todoItemForm.input.value,
                done: false,
            };
            // дбавляю запись в массив
            listArray.push(newItem);
            // делаю сохранение при добавлении записи в массив
            saveList(listArray, listName);

            /*
            создаём и добавляем в список новое дело с названием из поля для ввода
            создаём новый элемент с помощью функции createTodoItem, в неё мы передаём содержимое инпута
             и берём из этого объекта item так как в нём храниться сам элемент
            todoList.append(createTodoItem(todoItemForm.input.value).item);
            */
            // помещаем в todoItem резльтат работы createTodoItem. после поменяли на newItem
            let todoItem = createTodoItem(newItem);

            // создаём и добавляем в список новое дело с названием из поля для ввода
            todoList.append(todoItem.item);

            // обнуляем значение в поле, чтобы не пришлось стирать его вручную когда 
            // пользователю захочется создать новый элемент
            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;
        });


        function dis() {
            if (todoItemForm.input.value) {
                todoItemForm.button.disabled = false;
            }
            if (!todoItemForm.input.value) {
                todoItemForm.button.disabled = true;
            }
            // console.log('работает')

        };

        todoItemForm.input.addEventListener('input', dis);

    }

    // обработчик событий DOMContentLoaded нужен для получения доступа к дом дереву зазрузившейся html странице
    // document.addEventListener('DOMContentLoaded', function () {
    //     createTodoApp(document.getElementById('my-todos'), 'мои дела'); 
    //     createTodoApp(document.getElementById('Elina-todos'), 'дела Алины');
    //     createTodoApp(document.getElementById('daughter-todos'), 'дела дочки');
    // });

    // чтобы получить доступ к функции из других скриптов, явно регаем её в глобальном объекте window
    // для этого берём объект window создаём в ней свойство createTodoApp и в него приравняем саму функцию createTodoApp
    window.createTodoApp = createTodoApp;



})();



// теперь делаю чтобы по отправке формы создавался новый элемент списка

// function dis (){
//     // if(input.value = true){
//     //     button.disabled = false;
//     // }
//     console.log('привет')
// };

// input.addEventListener('input', dis);

// dis();
















// конец    console.log();