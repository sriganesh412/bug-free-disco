document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTaskToDOM(task));
    };

    const saveTasks = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const getTasksFromStorage = () => {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    };

    const addTaskToDOM = (task) => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        taskItem.dataset.id = task.id;
        taskItem.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
                <button class="toggle-btn">${task.completed ? 'Uncomplete' : 'Complete'}</button>
            </div>
        `;

        // Add event listener to toggle full text display
        const taskText = taskItem.querySelector('.task-text');
        taskText.addEventListener('click', () => {
            taskText.classList.toggle('show-full-text');
        });

        // Insert the new task at the top of the list
        taskList.insertBefore(taskItem, taskList.firstChild);
    };

    const addTask = (text) => {
        const tasks = getTasksFromStorage();
        const task = {
            id: Date.now(),
            text,
            completed: false
        };
        tasks.push(task);
        saveTasks(tasks);
        addTaskToDOM(task);
    };

    const editTask = (id, newText) => {
        const tasks = getTasksFromStorage();
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.text = newText;
            saveTasks(tasks);
            loadTaskList();
        }
    };

    const deleteTask = (id) => {
        let tasks = getTasksFromStorage();
        tasks = tasks.filter(task => task.id !== id);
        saveTasks(tasks);
        loadTaskList();
    };

    const toggleTaskCompletion = (id) => {
        const tasks = getTasksFromStorage();
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks(tasks);
            loadTaskList();
        }
    };

    const loadTaskList = () => {
        taskList.innerHTML = '';
        loadTasks();
    };

    const handleAddTask = () => {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            taskInput.value = '';
        }
    };

    addTaskBtn.addEventListener('click', handleAddTask);

    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleAddTask();
        }
    });

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const taskItem = e.target.closest('.task-item');
            const taskId = parseInt(taskItem.dataset.id, 10);
            deleteTask(taskId);
        }

        if (e.target.classList.contains('edit-btn')) {
            const taskItem = e.target.closest('.task-item');
            const taskId = parseInt(taskItem.dataset.id, 10);
            const newTaskText = prompt('Edit your task:', taskItem.querySelector('span').textContent);
            if (newTaskText !== null && newTaskText.trim() !== '') {
                editTask(taskId, newTaskText);
            }
        }

        if (e.target.classList.contains('toggle-btn')) {
            const taskItem = e.target.closest('.task-item');
            const taskId = parseInt(taskItem.dataset.id, 10);
            toggleTaskCompletion(taskId);
        }
    });

    loadTasks();
});
