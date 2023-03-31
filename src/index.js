let myTasks = [];
const taskList = document.getElementById('taskList');
const addTask = document.getElementById('addTask');
const taskCounter = document.getElementById('tasks-counter');

// Get all tasks from local storage in key "myTodoList" if exists and set in myTasks.
function initialize(){
    const myStoredList = localStorage.getItem("myTodoList");
    let receivedList = [];
    receivedList = JSON.parse(myStoredList);

    if(receivedList != null && receivedList.length > 0){
        myTasks = receivedList;
        populateList();
    }
}

// Create new HTML element for task and Add to Task List, Add Event Listeners for hover over Task, Add 'hidden' Class for received Filter
function addTaskToList(task, filter = 'showAll') {
    const li = document.createElement('li');
    li.classList.add('taskItem');

    // Add 'hidden' Class for received Filter
    if(filter == 'showIncomplete'){
        if(task.completed) {
            li.classList.add('hidden');
        }
    } else if (filter == 'showCompleted') {
        if(!task.completed) {
            li.classList.add('hidden');
        }
    }

    li.innerHTML = `
        <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''} class="custom-checkbox">
        <label for="${task.id}">${task.taskTitle}</label>
        <img src="src/images/bin.svg" class="delete hidden" data-id=${task.id} />
    `;

    // Event Listeners for hover over Task
    li.addEventListener('mouseover', handleHover);
    li.addEventListener('mouseout', handleHoverEnd);

    // Add Element to taskList
    taskList.append(li);
}

// Call addTaskToList for each task in myTasks with received filter, Update Task Counter and Save Tasks in localStorage.
function populateList(filter) {
    taskList.innerHTML = '';
    let taskCount = 0;

    for(let i = 0; i < myTasks.length; i++) {
        addTaskToList(myTasks[i], filter);
        if(myTasks[i].completed == false){
            taskCount += 1; 
        }
    }

    taskCounter.innerHTML = taskCount;
    localStorage.setItem("myTodoList", JSON.stringify(myTasks));
}

// Toggle task of given taskId between Completed/Incomplete and re-populate list
function toggleTask(taskId) {
    const task = myTasks.filter(function(task) {
        return task.id == taskId;
    })

    if(task.length > 0) {
        const currentTask = task[0];

        currentTask.completed = !currentTask.completed
        populateList();
        return;
    }
}

// Delete a task of given taskId and re-populate list
function deleteTask(taskId) {
    const newTasks = myTasks.filter(function(task) {
        return task.id != taskId;
    })

    myTasks = newTasks;
    populateList()
}

// Create a new task when 'enter' key is pressed and Add Task field is not empty.
function handleOnKeyPress(evt){
    if(evt.key === "Enter"){
        const text = evt.target.value;

        if(!text){
            return;
        }

        const newTask = {
            taskTitle: text,
            id: "todoTask_" + Date.now().toString(),
            completed: false
        }

        evt.target.value = "";
        myTasks.push(newTask);
        populateList();
        return;
    }
}

// Set All Tasks as Completed and re-populate list
function completeAllTasks(){
    myTasks.forEach(task => {
        task.completed = true;
    })

    populateList();
}

// Remove all completed tasks from myTasks and re-populate list
function clearCompletedTasks() {
    const incompleteTasks = myTasks.filter(function(task) {
        return task.completed != true;
    })

    myTasks = incompleteTasks;
    populateList()
}

// Handler fon any Click event occured in the HTML DOM
function handleOnClick(evt){
    const element = evt.target

    if(element.className == 'delete'){    // Clicked on Task Delete Button      
        const taskId = element.dataset.id;
        deleteTask(taskId);

    } else if (element.className == 'custom-checkbox'){     // Clicked on Checkbox to toggle any task
        const taskId = element.id;
        toggleTask(taskId);

    } else if (element.id == 'showAll') {     // Clicked on 'All' button filter
        populateList()

        element.classList.add('btnActive');
        document.getElementById('showCompleted').classList.remove('btnActive');
        document.getElementById('showIncomplete').classList.remove('btnActive');

    } else if (element.id == 'showIncomplete') {     // Clicked on 'Incomplete' button filter
        populateList("showIncomplete")

        element.classList.add('btnActive');
        document.getElementById('showCompleted').classList.remove('btnActive');
        document.getElementById('showAll').classList.remove('btnActive');

    } else if (element.id == 'showCompleted') {     // Clicked on 'Completed' button filter
        populateList("showCompleted");

        element.classList.add('btnActive');
        document.getElementById('showAll').classList.remove('btnActive');
        document.getElementById('showIncomplete').classList.remove('btnActive');

    } else if (element.id == 'completeAll') {       // Clicked on 'Complete All Tasks' button
        completeAllTasks();
        
    } else if (element.id == 'clearCompleted') {    // Clicked on 'Clear Completed' button
        clearCompletedTasks();
    }
}

// Show Task Delete button when hovered on a task
function handleHover(evt) {
    const element = evt.target;

    if(element.className == 'taskItem'){
        const delBtn = element.querySelector('.delete');
        delBtn.classList.remove("hidden");
    }
}

// Hide Task Delete button when hover ends on a task
function handleHoverEnd(evt) {
    const element = evt.target;

    if(element.className == 'taskItem'){
        const delBtn = element.querySelector('.delete');
        delBtn.classList.add("hidden");
    }
}

// Add event listener for 'keyup' event in addTask Field
addTask.addEventListener('keyup', handleOnKeyPress);

// Add event listener for any 'click' event in DOM
document.addEventListener('click', handleOnClick);


// Initialize the TODO Application
initialize();
