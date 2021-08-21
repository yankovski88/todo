// import { Storage } from './js/storage.js'

class Storage {
    constructor(key) {
        this.key = key;
    }

    get() {
        return JSON.parse(window.localStorage.getItem(this.key)) ?? [];
    }

    set(value) {
        window.localStorage.setItem(this.key, JSON.stringify(value));
    }
}

const storage = new Storage('taskList')

class Todo {
    tasks = [];

    constructor(elem, elemInputAdd) {
        this._elem = elem;
        this._elemInputAdd = elemInputAdd;
        this._elem.addEventListener('click', this.onClick.bind(this))



        this.inputMainElement = document.querySelector('.input-main'); //
        this.inputSearchElement = document.querySelector('.search');
        this.counterTasksElement = document.querySelector(".counter-tasks");
        this.addButtonElement = document.querySelector('.button-add');
        this.topTodoElement = document.querySelector('.top-todo');
        this.buttonsElements = this.topTodoElement.querySelectorAll('button') //
        this.tasksElement = document.querySelector('.tasks')

        this._elemInputAdd.addEventListener('input', (event) => {
            this.disabledButtonAdd();
        });


    }

    // функция которая берет строку и массив и возвращает массив объектов в которых есть совпадение
    getCoincidenceTasks = (querySearch) => {
        return this.tasks.filter((task) => {
            return task.text.includes(querySearch)
        })
    }

    // код рендерит li с таской
    renderTask = (item) => {
        if (!this.tasksElement) {
            return;
        }

        this.tasksElement.insertAdjacentHTML('beforeend', `
<li class="task">
  <div class="leftContent">
    <input id="id_${item.id}" type="checkbox" ${item.isChecked ? "checked" : ``}>
    <input id="id_message-task${item.id}" class="input-edit hidden" placeholder="edit task" value=${item.text}>
    <div class="message-task">${item.text}</div>
  </div>
  <div class="rightContent">
    <label class="cowbell-range" for="cowbell">
      <input id="id_range${item.id}" type="range" class="cowbell" name="cowbell" min="0" max="100" value="${item.importance}" step="10">
      <div id="id_importance${item.id}" class="numberImportance">${item.importance}</div>
    importance</label>
    <button data-action="editTaskAction" class="edit" id="id_edit${item.id}" >Edit</button>
    <button id="id_${item.id}" class="dell">Dell</button>
  </div>
</li>
        `)
    }

    // функция на основании массива в storage рендерит таски
    renderAllTask() {
        this.tasksElement.innerHTML = '';
        this.tasks.forEach((task) => {
            this.renderTask(task)
        });
        // this.dellTaskHandler();
        // this.editTaskHandler()
        // this.toggleShowEditInputHandler()
    }

    // функция на основании массива в storage рендерит таски
    renderTasks(tasks) {
        this.tasksElement.innerHTML = '';
        tasks.forEach((task) => {
            this.renderTask(task)
        });
        // this.dellTaskHandler();
        // this.editTaskHandler()
        // this.toggleShowEditInputHandler()
    }

    // функция добавляет disabled на кнопку
    disabledButtonAdd = () => {
        if (this.inputMainElement.value === '') {
            this.addButtonElement.setAttribute("disabled", "disabled")
        } else {
            this.addButtonElement.removeAttribute("disabled")
        }
    };

    createTaskDefault() {
        return {
            text: this.inputMainElement.value,
            isChecked: false,
            id: Date.now(),
            importance: 0,
            date: Date.now()
        }
    }

    addHandler() {
        const task = this.createTaskDefault();

        this.tasks.push(task)

        storage.set(this.tasks)

        this.inputMainElement.value = ``;
        this.disabledButtonAdd()
        this.renderAllTask();

        // this.setCounterTasksHandler()

        // this.setCheckedHandler()
        // this.range()

        this.rangeHandler()
        this.dellTaskHandler();
        this.editTaskHandler();
        this.toggleShowEditInputHandler();
        this.setCheckedHandler();
        this.setCounterTasksHandler();
    }

    // функция показывает только активные таски
    getActiveTasks() {
        return this.tasks.filter(({isChecked}) => isChecked === false)
    }

    // функция показывает только завершенные таски
    getCompletedTasks() {
        return this.tasks.filter(({isChecked}) => isChecked === true)
    }

    // слушатель удаляет все выделенные таски
    clearCompletedTasksHandler() {
        this.tasksElement.innerHTML = '';
        this.tasks = this.getActiveTasks(this.tasks);
        storage.set(this.tasks)
        this.renderAllTask()
        // this.setCounterTasksHandler()

        this.rangeHandler()
        this.dellTaskHandler();
        this.editTaskHandler();
        this.toggleShowEditInputHandler();
        this.setCheckedHandler();
        this.setCounterTasksHandler();
    }

    // слушатель выделяет все таски
    checkAllHandler() {
        this.tasks = this.tasks.map((task) => ({...task, isChecked: true}))     // код выделяет все таски
        storage.set(this.tasks)
        this.renderAllTask()
        // this.setCounterTasksHandler()
        // this.setCheckedHandler()


        this.rangeHandler()
        this.dellTaskHandler();
        this.editTaskHandler();
        this.toggleShowEditInputHandler();
        this.setCheckedHandler();
        this.setCounterTasksHandler();
    }

    // функция на основании массива в storage рендерит активные таски
    renderActiveTasks() {
        this.tasksElement.innerHTML = '';
        this.getActiveTasks().forEach((task) => {
            this.renderTask(task)
        });
        // this.setCheckedHandler();

        // this.rangeHandler()
        // this.dellTaskHandler();
        // this.editTaskHandler();
        // this.toggleShowEditInputHandler();
        // this.setCheckedHandler();
        // this.setCounterTasksHandler();
    }

    // функция на основании массива в storage рендерит активные таски
    renderCompletedTasks() {
        this.tasksElement.innerHTML = '';
        this.getCompletedTasks().forEach((task) => {
            this.renderTask(task)
        });
        // this.setCheckedHandler();
    }

    // слушатель показать все таски
    showAllTasksHandler() {
        this.renderAllTask()
        this.setCheckedHandler();

        this.rangeHandler();
        this.dellTaskHandler();
        this.editTaskHandler();
        this.toggleShowEditInputHandler();

        this.setCounterTasksHandler();
    }

    // слушатель показать активные таски
    showActiveTasksHandler() {
        this.renderActiveTasks()

        this.setCheckedHandler()
        this.rangeHandler();
        this.dellTaskHandler();
        this.editTaskHandler();
        this.toggleShowEditInputHandler();
        this.setCounterTasksHandler();
    }

    // слушатель на завершенные таски
    showCompletedTasksHandler() {
        this.renderCompletedTasks();
        // this.renderAllTask(this.getCompletedTasks(storage.get()))
        this.setCheckedHandler()

        this.rangeHandler();
        this.dellTaskHandler();
        this.editTaskHandler();
        this.toggleShowEditInputHandler();
        this.setCounterTasksHandler();
    }


    onClick(event) {
        const action = event.target.dataset.action;
        if (action) {
            this[action]()
        }
    }

    // функция которая следит за чекбоксами и изменяет на основании их массив
    setCheckedHandler = () => {
        const checkboxElements = this.tasksElement.querySelectorAll('input');
        checkboxElements.forEach((checkbox) => {
            checkbox.addEventListener('click', (event) => {
                if (checkbox.hasAttribute('checked')) {
                    checkbox.removeAttribute('checked')
                    this.tasks.forEach((task) => {
                        if (`id_${task.id}` === checkbox.id) {
                            task.isChecked = false
                        }
                    })
                    storage.set(this.tasks)
                } else if (!checkbox.hasAttribute('checked')) {
                    checkbox.setAttribute('checked', 'checked')
                    this.tasks.forEach((task) => {
                        if (`id_${task.id}` === checkbox.id) {
                            task.isChecked = true
                        }
                    })
                    storage.set(this.tasks)
                }
                // this.setCounterTasksHandler(this.tasks);
                // this.rangeHandler()
                // this.dellTaskHandler();
                // this.editTaskHandler();
                // this.toggleShowEditInputHandler();
                // this.setCheckedHandler();
                this.setCounterTasksHandler();
            })
        })
    }

    // устанавливает счетчик активных тасков
    setCounterTasksHandler() {
        // this.counterTasksElement.innerHTML = `${this.getCountTask(this.tasks)}`
        this.counterTasksElement.innerHTML = `${this.getCountTask()}`
    }

    // установить все активности
    setActiveHandler(elem) {
        elem.addEventListener('click', (event) => {
            if (event.target.localName === 'button') {
                this.buttonsElements.forEach((button) => {
                    button.classList.remove('active')
                    event.target.classList.remove('animated');
                    event.target.classList.remove('animatedTwo');

                })
                event.target.classList.add('active');
                event.target.classList.add('animated');
                event.target.classList.remove('animatedTwo');

            }
        })
    }

    // функция по удалению таски
    dellTaskHandler (){
        const dellButtons = this.tasksElement.querySelectorAll('.dell')
        dellButtons.forEach((delButton) => {
            delButton.addEventListener('click', (event) => {
                this.tasks.forEach((task, index) => {
                    if (`id_${task.id}` === event.target.id) {
                        this.tasks.splice(index, 1)
                        storage.set(this.tasks)
                        this.renderAllTask()
                        // this.renderAllTask(this.tasks)

                        this.rangeHandler()
                        this.dellTaskHandler();
                        this.editTaskHandler();
                        this.toggleShowEditInputHandler();
                        this.setCheckedHandler();
                        this.setCounterTasksHandler();
                    }
                })
            })
        })
    }

    setStartTasks() {
        // если есть массив в сторе, то сделай локальный таким же, иначе массив пустой
        this.tasks = storage.get();
    }

    // функция которая после взаимодействия с массивом подсчитывает сколько задач осталось
    getCountTask = () => {
        if (!this.tasks) {
            return 0
        }
        const tasks = this.tasks.filter((item) => {
            return item.isChecked === false
        })
        return tasks.length
    }

    rangeHandler() {
        const cowbellElement = this.tasksElement.querySelectorAll('.cowbell')
        cowbellElement.forEach((elem) => {
            elem.addEventListener('input', (event) => {
                let idElem = `#id_importance${event.target.id.slice(8, event.target.id.length)}`
                const numberImportanceElement = elem.parentNode.querySelector('.numberImportance') //#id_importance637320
                numberImportanceElement.innerHTML = event.target.value

                this.tasks.forEach((task, index) => {
                    if (`id_range${task.id}` === event.target.id) {
                        task.importance = event.target.value;
                        const upDateTasks = this.tasks.sort((a, b) => a.importance - b.importance)
                        storage.set(upDateTasks)
                    }
                })
            })
        })
    }

    sortImportanceUpHandler() {
        const upTasks = this.tasks.sort((a, b) => b.importance - a.importance)
        // this.renderAllTask(upTasks)
        this.renderTasks(upTasks)

        this.rangeHandler();
        this.dellTaskHandler();
        this.editTaskHandler();
        this.toggleShowEditInputHandler();
        this.setCheckedHandler();
        this.setCounterTasksHandler();
    }

    sortImportanceDownHandler() {
        // const downTasks = this.tasks.sort((a, b) => a.importance - b.importance)
        // this.renderAllTask(downTasks)
        this.renderTasks(this.tasks.sort((a, b) => a.importance - b.importance))

        this.rangeHandler();
        this.dellTaskHandler();
        this.editTaskHandler();
        this.toggleShowEditInputHandler();
        this.setCheckedHandler();
        this.setCounterTasksHandler();
    }

    sortDateUpTasks() {
        return this.tasks.sort((a, b) => a.date - b.date)
    }

    sortDateUpHandler() {
        // const upDateTasks = this.tasks.sort((a, b) => a.date - b.date)
        // this.renderAllTask(upDateTasks)
        // this.renderTasks(upDateTasks)

        this.renderTasks(this.sortDateUpTasks())
        this.rangeHandler();
        this.dellTaskHandler();
        this.editTaskHandler();
        this.toggleShowEditInputHandler();
        this.setCheckedHandler();
        this.setCounterTasksHandler();
    }

    sortDateDownHandler() {
        // const downDateTasks = this.tasks.sort((a, b) => b.date - a.date)
        // this.renderAllTask(downDateTasks)
        this.renderTasks(this.tasks.sort((a, b) => b.date - a.date))
        this.rangeHandler();
        this.dellTaskHandler();
        this.editTaskHandler();
        this.toggleShowEditInputHandler();
        this.setCheckedHandler();
        this.setCounterTasksHandler();
    }

    // слушатель на редактирование таски
    toggleShowEditInputHandler() {
        console.log('tut')
        const editTaskElements = this.tasksElement.querySelectorAll('.edit')
        editTaskElements.forEach((editTask) => {
            editTask.addEventListener('click', (event) => {
                this.tasks.forEach((task, index) => {
                    if (`id_edit${task.id}` === event.target.id) {
                        const inputEditElement = editTask.parentElement.parentElement.querySelector('.input-edit')
                        console.log(inputEditElement)
                        inputEditElement.classList.toggle('disable-hidden')

                        this.rangeHandler()
                        this.dellTaskHandler();
                        this.editTaskHandler();
                        // this.toggleShowEditInputHandler();
                        this.setCheckedHandler();
                        this.setCounterTasksHandler();
                    }
                })
            })
        })
    }

    editTaskHandler = () => {
        const editInputElements = this.tasksElement.querySelectorAll('.input-edit')
        editInputElements.forEach((editInputElement) => {
            editInputElement.addEventListener('change', (event) => {
                this.tasks.forEach((task, index) => {
                    if (`id_message-task${task.id}` === event.target.id) {
                        task.text = event.target.value;
                        storage.set(this.tasks)
                        this.renderAllTask()

                        this.rangeHandler()
                        this.dellTaskHandler();
                        // this.editTaskHandler();
                        this.toggleShowEditInputHandler();
                        this.setCheckedHandler();
                        this.setCounterTasksHandler();
                        editInputElement.classList.add('hidden')
                    }
                })
            })
        })
        // this.setCheckedHandler()
    }
}

const inputMainElement = document.querySelector('.input-main');
const topTodoElement = document.querySelector('.top-todo');
const todo = new Todo(topTodoElement, inputMainElement)

// следим за инпутом и если там что-то введено, то кнопка работает
todo.inputMainElement.addEventListener('input', (event) => {
    todo.disabledButtonAdd();
})
todo.inputMainElement.addEventListener('keydown', (event) => {
    if (event.keyCode === 13 && todo.inputMainElement.value) {
        todo.addHandler()
    }
})

todo.setStartTasks() // забираем все начальные таски
// todo.renderAllTask(todo.sortDateUpTasks(todo.tasks)) // на инициализации страницы рендерим таски
todo.renderTasks(todo.sortDateUpTasks()) // на инициализации страницы рендерим таски
// todo.setCounterTasksHandler(storage.get('taskList')); // установили счетчик при инициализации страницы
todo.setCounterTasksHandler(); // установили счетчик при инициализации страницы

todo.setCheckedHandler() // установить все чекнутые инпуты
todo.disabledButtonAdd(); // прописано начальное состояние кнопки

todo.inputSearchElement.addEventListener('input', (event) => {
    // todo.getCoincidenceTasks(event.target.value, todo.tasks)
    todo.getCoincidenceTasks(event.target.value, todo.tasks)

    // todo.renderAllTask(todo.getCoincidenceTasks(event.target.value, todo.tasks))
    todo.renderTasks(todo.getCoincidenceTasks(event.target.value))
})
todo.setActiveHandler(todo.topTodoElement) // сделать таск активным
todo.dellTaskHandler() // удалить таск

todo.rangeHandler() // управляет ренджем и меняет цифры

todo.toggleShowEditInputHandler() // редактирование
todo.editTaskHandler() // редактирование таски


// в зависимости от селекта сортирует массив
const sortElement = document.querySelector('.sort');
sortElement.addEventListener('change', (event) => {
    switch (event.target.value) {
        case 'sortImportanceUpHandler':
            todo.sortImportanceUpHandler()
            break;
        case 'sortImportanceDownHandler':
            todo.sortImportanceDownHandler()
            break;
        case 'sortDateUpHandler':
            todo.sortDateUpHandler()
            break;
        case 'sortDateDownHandler':
            todo.sortDateDownHandler()
            break;
        default:
            break;
    }
})


// class CommentTodo {
//     comments = [];
//
//     setComment(comment) {
//         this.comments.push(comment)
//     }
//
//     getComments() {
//         return this.comments
//     }
//
//     renderComment(elem, obj) {
//         elem.insertAdjacentHTML('beforeend', `
// <li class="comment">
//     <div class="comment__name">${obj.name}</div>
//     <div class="comment__text">${obj.comment}</div>
// </li>`)
//     }
//
//     renderComments(elem, comments) {
//         elem.innerHTML = '';
//         comments.forEach((comment) => { // нужна функция по рендеру массива
//             this.renderComment(elem, comment)
//         })
//     }
//
//     setStartComments() {
//             this.comments = storageCommentsTodo.get();
//     }
//
//     addDisabledToButton(elem) {
//         elem.setAttribute("disabled", "disabled")
//     }
//
//     removeDisabledToButton(elem) {
//         elem.removeAttribute("disabled")
//     }
//
//     disabledButton(firstInputElement, secondInputElement, ButtonElement) {
//         if (firstInputElement.value === '' || secondInputElement.value === '') {
//             this.addDisabledToButton(ButtonElement)
//         } else {
//             this.removeDisabledToButton(ButtonElement)
//         }
//     }
// }
//
// const storageCommentsTodo = new Storage('todoComments')
// const commentTodo = new CommentTodo();
//
// const fromCommentElement = document.querySelector('.from-comment');
// const ulCommentsElement = document.querySelector('.comments');
// const fromCommentNameElement = document.querySelector('.from-comment__name');
// const fromCommentCommentElement = document.querySelector('.from-comment__comment');
// const fromCommentAdd = document.querySelector('.from-comment__add')
// const messageCongratulationTextElement = document.querySelector('.message-congratulation-text');
//
// fromCommentElement.addEventListener('submit', async (event) => {
//     event.preventDefault();
//     const formData = new FormData(fromCommentElement);
//     const comment = Object.fromEntries(formData.entries());
//     commentTodo.setComment(comment);
//     storageCommentsTodo.set(commentTodo.getComments());
//
//     commentTodo.renderComments(ulCommentsElement, commentTodo.getComments());
//
//     fromCommentNameElement.value = '';
//     fromCommentCommentElement.value = '';
//     commentTodo.disabledButton(fromCommentNameElement, fromCommentNameElement, fromCommentAdd)
//
//     messageCongratulationTextElement.classList.remove('animated-margin')
//
//     setTimeout(() => {
//         messageCongratulationTextElement.classList.add('animated-margin')
//     }, 300)
//
//     // let response = await fetch('url', {
//     //     method: 'POST',
//     //     body: new FormData(fromCommentElement)
//     // });
//     // let result = await response.json();
// })
//
// commentTodo.setStartComments(); // устанавливаем стартовые комменты
// commentTodo.renderComments(ulCommentsElement, commentTodo.comments);
//
// fromCommentElement.addEventListener('change', (event) => {
//     commentTodo.disabledButton(fromCommentNameElement, fromCommentNameElement, fromCommentAdd)
// })
//
// commentTodo.disabledButton(fromCommentNameElement, fromCommentNameElement, fromCommentAdd)
//
//
// messageCongratulationTextElement.addEventListener('click', (event) => {
//     messageCongratulationTextElement.classList.remove('animated-margin')
//
//     setTimeout(() => {
//         messageCongratulationTextElement.classList.add('animated-margin')
//     }, 10)
// })
//
// console.log(todo.tasks)
//
// // Vasia
// // Todo is normal.
// //     Alex
// // I have seen very good todo!
