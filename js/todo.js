'use strict';
import {Storage} from "./storage.js";

const storage = new Storage('taskList')

export class Todo {
    tasks = [];
    currentTasks = [];

    constructor(elem, elemInputAdd) {
        this._elem = elem;
        this._elemInputAdd = elemInputAdd;
        this._elem.addEventListener('click', this.onClick.bind(this))

        this.inputMainElement = document.querySelector('.input-main');
        this.inputSearchElement = document.querySelector('.search');
        this.counterTasksElement = document.querySelector(".counter-tasks");
        this.addButtonElement = document.querySelector('.button-add');
        this.topTodoElement = document.querySelector('.top-todo');
        this.buttonsElements = this.topTodoElement.querySelectorAll('button')
        this.tasksElement = document.querySelector('.tasks')
        this.messageCongratulationTextElement = document.querySelector('.message-congratulation-text');

        this._elemInputAdd.addEventListener('input', () => {
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
    }

    // функция на основании массива в storage рендерит таски
    renderTasks(tasks) {
        this.tasksElement.innerHTML = '';
        tasks.forEach((task) => {
            this.renderTask(task)
        });
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

        this.rangeHandler()
        this.dellTaskHandler();
        this.editTaskHandler();
        this.toggleShowEditInputHandler();
        this.setCheckedHandler();
        this.setCounterTasksHandler();
        this.addAnimationHandler();
    }

    addAnimationHandler() {
        this.messageCongratulationTextElement.classList.remove('animated-margin')

        setTimeout(() => {
            this.messageCongratulationTextElement.classList.add('animated-margin')
        }, 100)
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
    }

    // функция на основании массива в storage рендерит активные таски
    renderCompletedTasks() {
        this.tasksElement.innerHTML = '';
        this.getCompletedTasks().forEach((task) => {
            this.renderTask(task)
        });
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
                this.setCounterTasksHandler();
            })
        })
    }

    // устанавливает счетчик активных тасков
    setCounterTasksHandler() {
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
    dellTaskHandler() {
        const dellButtons = this.tasksElement.querySelectorAll('.dell')
        dellButtons.forEach((delButton) => {
            delButton.addEventListener('click', (event) => {
                this.tasks.forEach((task, index) => {
                    if (`id_${task.id}` === event.target.id) {
                        this.tasks.splice(index, 1)
                        storage.set(this.tasks)
                        this.renderAllTask()

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
        this.currentTasks = upTasks;
        this.renderTasks(upTasks)

        this.rangeHandler();
        this.dellTaskHandler();
        this.editTaskHandler();
        this.toggleShowEditInputHandler();
        this.setCheckedHandler();
        this.setCounterTasksHandler();
    }

    sortImportanceDownHandler() {
        const downTasks = this.tasks.sort((a, b) => a.importance - b.importance)

        this.currentTasks = downTasks;
        this.renderTasks(downTasks)

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
        this.currentTasks = this.sortDateUpTasks();
        this.renderTasks(this.sortDateUpTasks())

        this.rangeHandler();
        this.dellTaskHandler();
        this.editTaskHandler();
        this.toggleShowEditInputHandler();
        this.setCheckedHandler();
        this.setCounterTasksHandler();
    }

    sortDateDownHandler() {
        this.currentTasks = this.tasks.sort((a, b) => b.date - a.date);
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
        const editTaskElements = this.tasksElement.querySelectorAll('.edit')
        editTaskElements.forEach((editTask) => {
            editTask.addEventListener('click', (event) => {
                this.tasks.forEach((task, index) => {
                    if (`id_edit${task.id}` === event.target.id) {
                        const inputEditElement = editTask.parentElement.parentElement.querySelector('.input-edit')
                        inputEditElement.classList.toggle('disable-hidden')

                        this.rangeHandler()
                        this.dellTaskHandler();
                        this.editTaskHandler();
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
                        this.toggleShowEditInputHandler();
                        this.setCheckedHandler();
                        this.setCounterTasksHandler();
                        editInputElement.classList.add('hidden')
                    }
                })
            })
        })
    }
}
