'use strict';

export class Todo {
    tasks = [];
    currentTasks = [];

    constructor(storage, elem, elemInputAdd) {
        this._storage = storage;
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

        this.tasksElement.addEventListener('click', (event) => {
            if (event.target.className === 'dell') {
                const taskElement = event.target.parentElement.parentElement;
                this.tasks.forEach((task, index) => {
                    if (`id_task${task.id}` === taskElement.id) {
                        this.tasks.splice(index, 1);
                        this._storage.set(this.tasks);
                        this.renderAllTask();

                        this.setCounterTasksHandler();
                    }
                })
            } else if (event.target.className === 'edit') {
                const taskElement = event.target.parentElement.parentElement;

                this.tasks.forEach((task) => {
                    if (`id_task${task.id}` === taskElement.id) {
                        const inputEditElement = taskElement.querySelector('.input-edit')
                        inputEditElement.classList.toggle('hidden')
                    }
                })
            } else if (event.target.className === 'checkbox-done') { // ?????????????? ?????????????? ???????????? ???? ???????????????????? ?? ???????????????? ???? ?????????????????? ???? ????????????
                const taskElement = event.target.parentElement.parentElement;
                this.tasks.forEach((task) => {
                    if (`id_task${task.id}` === taskElement.id) {
                        if (event.target.hasAttribute('checked')) {
                            event.target.removeAttribute('checked')
                            this.tasks.forEach((task) => {
                                if (`id_${task.id}` === event.target.id) {
                                    task.isChecked = false
                                }
                            })
                            this._storage.set(this.tasks)
                        } else if (!event.target.hasAttribute('checked')) {
                            event.target.setAttribute('checked', 'checked')
                            this.tasks.forEach((task) => {
                                if (`id_${task.id}` === event.target.id) {
                                    task.isChecked = true
                                }
                            })
                            this._storage.set(this.tasks)
                        }
                        this.setCounterTasksHandler();
                    }
                })
            }
        });


        this.tasksElement.addEventListener('input', (event) => {
            if (event.target.className === 'cowbell') {
                const taskElement = event.target.parentElement.parentElement.parentElement;
                this.tasks.forEach((task, index) => {
                    if (`id_task${task.id}` === taskElement.id) {
                        event.target.nextElementSibling.innerHTML = event.target.value
                        task.importance = event.target.value;
                        const upDateTasks = this.tasks.sort((a, b) => a.importance - b.importance)
                        this._storage.set(upDateTasks)
                    }
                })
            }
        });

        this.tasksElement.addEventListener('change', (event) => {
            if (event.target.className.split(' ')[0] === 'input-edit') {
                const taskElement = event.target.parentElement.parentElement;
                this.tasks.forEach((task, index) => {
                    if (`id_task${task.id}` === taskElement.id) {
                        task.text = event.target.value;
                        this._storage.set(this.tasks);
                        event.target.classList.add('hidden')
                        this.renderAllTask();
                    }
                })
            }
        });
    }


    // ?????????????? ?????????????? ?????????? ???????????? ?? ???????????? ?? ???????????????????? ???????????? ???????????????? ?? ?????????????? ???????? ????????????????????
    getCoincidenceTasks = (querySearch) => {
        return this.tasks.filter((task) => {
            return task.text.includes(querySearch)
        })
    }

    // ?????? ???????????????? li ?? ????????????
    renderTask = (item) => {
        if (!this.tasksElement) {
            return;
        }

        this.tasksElement.insertAdjacentHTML('beforeend', `
            <li id="id_task${item.id}" class="task">
              <div class="leftContent">
                <input id="id_${item.id}" class="checkbox-done" type="checkbox" ${item.isChecked ? "checked" : ``}>
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

    // ?????????????? ???? ?????????????????? ?????????????? ?? storage ???????????????? ??????????
    renderAllTask() {
        this.tasksElement.innerHTML = '';
        this.tasks.forEach((task) => {
            this.renderTask(task)
        });
    }

    // ?????????????? ???? ?????????????????? ?????????????? ?? storage ???????????????? ??????????
    renderTasks(tasks) {
        this.tasksElement.innerHTML = '';
        tasks.forEach((task) => {
            this.renderTask(task)
        });
    }

    // ?????????????? ?????????????????? disabled ???? ????????????
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

        this._storage.set(this.tasks)

        this.inputMainElement.value = ``;
        this.disabledButtonAdd()
        this.renderAllTask();

        this.setCounterTasksHandler();
        this.addAnimationHandler();
    }

    addAnimationHandler() {
        this.messageCongratulationTextElement.classList.remove('animated-margin')

        setTimeout(() => {
            this.messageCongratulationTextElement.classList.add('animated-margin')
        }, 100)
    }

    // ?????????????? ???????????????????? ???????????? ???????????????? ??????????
    getActiveTasks() {
        return this.tasks.filter(({isChecked}) => !isChecked)
    }

    // ?????????????? ???????????????????? ???????????? ?????????????????????? ??????????
    getCompletedTasks() {
        return this.tasks.filter(({isChecked}) => isChecked)
    }

    // ?????????????????? ?????????????? ?????? ???????????????????? ??????????
    clearCompletedTasksHandler() {
        this.tasksElement.innerHTML = '';
        this.tasks = this.getActiveTasks(this.tasks);
        this._storage.set(this.tasks)
        this.renderAllTask()

        this.setCounterTasksHandler();
    }

    // ?????????????????? ???????????????? ?????? ??????????
    checkAllHandler() {
        this.tasks = this.tasks.map((task) => ({...task, isChecked: true}))     // ?????? ???????????????? ?????? ??????????
        this._storage.set(this.tasks)
        this.renderAllTask()

        this.setCounterTasksHandler();
    }

    // ?????????????? ???? ?????????????????? ?????????????? ?? storage ???????????????? ???????????????? ??????????
    renderActiveTasks() {
        this.tasksElement.innerHTML = '';
        this.getActiveTasks().forEach((task) => {
            this.renderTask(task)
        });
    }

    // ?????????????? ???? ?????????????????? ?????????????? ?? storage ???????????????? ???????????????? ??????????
    renderCompletedTasks() {
        this.tasksElement.innerHTML = '';
        this.getCompletedTasks().forEach((task) => {
            this.renderTask(task)
        });
    }

    // ?????????????????? ???????????????? ?????? ??????????
    showAllTasksHandler() {
        this.renderAllTask()

        this.setCounterTasksHandler();
    }

    // ?????????????????? ???????????????? ???????????????? ??????????
    showActiveTasksHandler() {
        this.renderActiveTasks()

        this.setCounterTasksHandler();
    }

    // ?????????????????? ???? ?????????????????????? ??????????
    showCompletedTasksHandler() {
        this.renderCompletedTasks();

        this.setCounterTasksHandler();
    }


    onClick(event) {
        const action = event.target.dataset.action;
        if (action) {
            this[action]()
        }
    }

    // ?????????????????????????? ?????????????? ???????????????? ????????????
    setCounterTasksHandler() {
        this.counterTasksElement.innerHTML = `${this.getCountTask()}`
    }

    // ???????????????????? ?????? ????????????????????
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

    setStartTasks() {
        // ???????? ???????? ???????????? ?? ??????????, ???? ???????????? ?????????????????? ?????????? ????, ?????????? ???????????? ????????????
        this.tasks = this._storage.get();
    }

    // ?????????????? ?????????????? ?????????? ???????????????????????????? ?? ???????????????? ???????????????????????? ?????????????? ?????????? ????????????????
    getCountTask = () => {
        if (!this.tasks) {
            return 0
        }
        const tasks = this.tasks.filter((item) => {
            return item.isChecked === false
        })
        return tasks.length
    }

    sortImportanceUpHandler() {
        const upTasks = this.tasks.sort((a, b) => b.importance - a.importance)
        this.currentTasks = upTasks;
        this.renderTasks(upTasks)

        this.setCounterTasksHandler();
    }

    sortImportanceDownHandler() {
        const downTasks = this.tasks.sort((a, b) => a.importance - b.importance)

        this.currentTasks = downTasks;
        this.renderTasks(downTasks)

        this.setCounterTasksHandler();
    }

    sortDateUpTasks() {
        return this.tasks.sort((a, b) => a.date - b.date)
    }

    sortDateUpHandler() {
        this.currentTasks = this.sortDateUpTasks();
        this.renderTasks(this.sortDateUpTasks())

        this.setCounterTasksHandler();
    }

    sortDateDownHandler() {
        this.currentTasks = this.tasks.sort((a, b) => b.date - a.date);
        this.renderTasks(this.tasks.sort((a, b) => b.date - a.date))

        this.setCounterTasksHandler();
    }
}
