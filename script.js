document.getElementById("add-button").addEventListener("click", addTask);
document.getElementById("filter-category").addEventListener("change", filterTasks);
document.getElementById("filter-priority").addEventListener("change", filterTasks);
document.getElementById("clear-all").addEventListener("click", clearAllTasks);

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(displayTask);
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    const taskText = document.getElementById("task-input").value.trim();
    const category = document.getElementById("category").value;
    const priority = document.getElementById("priority").value;

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const task = { text: taskText, category, priority, completed: false };
    displayTask(task);

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    saveTasks(tasks);

    document.getElementById("task-input").value = "";
}

function displayTask(task) {
    const listItem = document.createElement("li");
    listItem.classList.add(`priority-${task.priority.toLowerCase()}`);
    listItem.innerHTML = `
        ${task.text} - <em>${task.category}</em> 
        <span>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </span>
    `;
    
    listItem.classList.toggle("completed", task.completed);
    listItem.querySelector(".edit").addEventListener("click", () => editTask(task, listItem));
    listItem.querySelector(".delete").addEventListener("click", () => deleteTask(task, listItem));
    listItem.addEventListener("click", () => toggleComplete(task, listItem));

    document.getElementById("task-list").appendChild(listItem);
}

function editTask(task, listItem) {
    const newTaskText = prompt("Edit task:", task.text);
    if (newTaskText) {
        task.text = newTaskText;
        saveTasks(getUpdatedTasks());
        listItem.firstChild.textContent = newTaskText;
    }
}

function deleteTask(task, listItem) {
    listItem.remove();
    saveTasks(getUpdatedTasks());
}

function toggleComplete(task, listItem) {
    task.completed = !task.completed;
    listItem.classList.toggle("completed", task.completed);
    saveTasks(getUpdatedTasks());
}

function filterTasks() {
    const filterCategory = document.getElementById("filter-category").value;
    const filterPriority = document.getElementById("filter-priority").value;
    document.getElementById("task-list").innerHTML = "";

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.filter(task => 
        (filterCategory === "All" || task.category === filterCategory) &&
        (filterPriority === "All" || task.priority === filterPriority)
    ).forEach(displayTask);
}

function clearAllTasks() {
    localStorage.removeItem("tasks");
    document.getElementById("task-list").innerHTML = "";
}

function getUpdatedTasks() {
    const tasks = [];
    document.getElementById("task-list").querySelectorAll("li").forEach(listItem => {
        const [text, category, priority, completed] = listItem.innerText.split(" - ");
        tasks.push({ text, category, priority, completed });
    });
    return tasks;
}

// Load tasks on page load
loadTasks();
