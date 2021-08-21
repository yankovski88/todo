import { Todo } from './todo.js'
import { Storage } from "./storage.js";

const storage = new Storage('taskList')

const inputMainElement = document.querySelector('.input-main');
const topTodoElement = document.querySelector('.top-todo');

const todo = new Todo(storage, topTodoElement, inputMainElement)

todo.inputMainElement.addEventListener('keydown', (event) => {
    if (event.keyCode === 13 && todo.inputMainElement.value) {
        todo.addHandler()
    }
})

todo.setStartTasks() // забираем все начальные таски
todo.renderTasks(todo.sortDateUpTasks()) // на инициализации страницы рендерим таски

todo.setCounterTasksHandler(); // установили счетчик при инициализации страницы
todo.disabledButtonAdd(); // прописано начальное состояние кнопки

todo.inputSearchElement.addEventListener('input', (event) => {
    todo.getCoincidenceTasks(event.target.value, todo.tasks)
    todo.renderTasks(todo.getCoincidenceTasks(event.target.value))

    todo.setCounterTasksHandler();
})
todo.setActiveHandler(todo.topTodoElement) // сделать таск активным

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
