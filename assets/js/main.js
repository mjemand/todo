'use strict';

const bodyDay = document.querySelector('.body__day');
const bodyDate = document.querySelector('.body__date');
const todoInput = document.querySelector('.todo-input');
const addTodoButton = document.querySelector('.add-todo');
const todoContainer = document.querySelector('.todo-container');
const completedContainer = document.querySelector('.completed-container');
const todoCounterHolder = document.querySelector('.counter');
const showHideButton = document.querySelector('.show-hide');
const clearAllButton = document.querySelector('.clear-all');
const dayNames = [
    'Sunday', 
    'Monday', 
    'Tuesday', 
    'Wednessday', 
    'Thursday', 
    'Friday', 
    'Saturday',
];
let todoCounter = 0;
let storageId = 1;

const showDate = () => {
    const currentDate = new Date();
    const day = [
        currentDate.getMonth() + 1, 
        currentDate.getDate(),
        currentDate.getFullYear(), 
    ].map( num => num < 10 ? `0${num}` : num );

    bodyDay.textContent = dayNames[currentDate.getDay()];
    bodyDate.textContent = day.join('-');
};
showDate();

const storageHandler = {
    set: (key, value) => localStorage.setItem(key, value),
    get: key => localStorage.getItem(key),
    reset: key => localStorage.removeItem(key),
};

const counterReset = () => {
    todoCounter = 0; 
    todoCounterHolder.textContent = todoCounter;
}

const counterUpdater = (direction) => {
    if (direction) todoCounter += 1;
    else todoCounter -= 1; 
    todoCounterHolder.textContent = todoCounter;
}

const deleteTodo = (id) => {
    document.querySelector(`[data-id="${id}"]`).parentElement.remove();
    storageHandler.reset(id);
    counterUpdater(false);
}

const todoCompleted = (id) => {
    let valueString = storageHandler.get(id);
    valueString = valueString.replace('"state":1', '"state":2');
    storageHandler.set(id, valueString);
    const targetCheckbox = document.querySelector(`[data-setid="${id}"]`);
    const targetTodo = targetCheckbox.parentElement;
    targetCheckbox.disabled = true;
    targetTodo.remove();
    completedContainer.insertBefore(targetTodo, completedContainer.firstChild);
    counterUpdater(false);
}

const addDeleteEventListener = (id) => document.querySelector(`[data-id="${id}"]`).addEventListener('click', () => deleteTodo(id));
const addSetEventListener = (id) => document.querySelector(`[data-setid="${id}"]`).addEventListener('click', () => todoCompleted(id));

const createTodo = (text, id, state) => {
    let isChecked = '';
    let parentContainer = todoContainer;
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item');
    if (parseInt(state) === 2) {
        parentContainer = completedContainer;
        isChecked = 'checked disabled';
    } else counterUpdater(true);
    todoItem.innerHTML = `  <input type="checkbox" ${isChecked} name="set-completed" class="set-completed" data-setid="${id}">
                            ${text}
                            <button class="delete-button" data-id="${id}"><i class="fa fa-trash"></i></button>`;
    parentContainer.insertBefore(todoItem, parentContainer.firstChild);
}

const addTodo = () => {
    if (todoInput.value) {
        createTodo(todoInput.value, storageId, 1);
        storageHandler.set(storageId.toString(), JSON.stringify({todo: todoInput.value, state: 1, }));
        addDeleteEventListener(storageId);
        addSetEventListener(storageId);
        todoInput.value = '';
        storageId += 1;
    }
}

const buildTodoList = () => {
    Object.keys(localStorage).forEach((key) => {
        const obj = JSON.parse(storageHandler.get(key));
        createTodo(obj.todo, key, obj.state);
        addDeleteEventListener(key);
        addSetEventListener(key);
        if(parseInt(key) >= storageId) storageId = parseInt(key) + 1;
    });
}
buildTodoList();

const setShowHide = () => {
    const btnContent = showHideButton.textContent;
    if (btnContent == 'Show Complete') {
        completedContainer.classList.remove('hide');
        showHideButton.textContent = 'Hide Complete'
    } else {
        completedContainer.classList.add('hide');
        showHideButton.textContent = 'Show Complete'
    }
}

const clearAll = () => {
    Object.keys(localStorage).forEach((key) => {
        const obj = JSON.parse(storageHandler.get(key));
        if (parseInt(obj.state) === 1) {
            storageHandler.reset(key);
            document.querySelector(`[data-setid="${key}"]`).parentElement.remove();
            counterReset();
        }
    });
}

const addTodoClickListener = () => addTodoButton.addEventListener('click', addTodo);
const addShowHideClickListener = () => showHideButton.addEventListener('click', setShowHide);
const clearAllClickListener = () => clearAllButton.addEventListener('click', clearAll);
addTodoClickListener();
addShowHideClickListener();
clearAllClickListener();