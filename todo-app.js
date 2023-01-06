
// alert('проект в разработке, некоторые функции пока не работают');

(function () {
    let listArray = [];
    let listName = '';

    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

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

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(obj) {
        let item = document.createElement('li');
        // кнопки размещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deletBotton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = obj.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'готово';
        deletBotton.classList.add('btn', 'btn-danger');
        deletBotton.textContent = 'удалить';

        if (obj.done == true) item.classList.add('list-group-item-success');

        doneButton.addEventListener('click', function () {
            item.classList.toggle('list-group-item-success')

            for (const listItem of listArray) {
                if (listItem.id == obj.id) listItem.done = !listItem.done
            }
            saveList(listArray, listName);

        });
        deletBotton.addEventListener('click', function () {
            if (confirm('вы уверены?')) {
                item.remove();

                const currentName = item.firstChild.textContent

                for (let i = 0; i < listArray.length; i++) {
                    if (listArray[i].id == obj.id) listArray.splice(i, 1)
                }
                
                saveList(listArray, listName);
            }
        });

        buttonGroup.append(doneButton);
        buttonGroup.append(deletBotton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deletBotton,
        };
    }

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

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        listName = keyName;

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        let localData = localStorage.getItem(listName)

        if (localData !== null && localData !== '') listArray = JSON.parse(localData);

        for (const itemList of listArray){
            let todoItem = createTodoItem(itemList);
            todoList.append(todoItem.item);
        }

        todoItemForm.form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!todoItemForm.input.value) {
                return;
            }

            let newItem = {
                id: getNewId(listArray),
                name: todoItemForm.input.value,
                done: false,
            };

            listArray.push(newItem);
            saveList(listArray, listName);

            let todoItem = createTodoItem(newItem);

            todoList.append(todoItem.item);

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

    window.createTodoApp = createTodoApp;

})();












// конец    console.log();
