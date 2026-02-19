const input = document.getElementById("taskInput");
const dateInput = document.getElementById("dueDateInput");
const addBtn = document.getElementById("addBtn");
const undoBtn = document.getElementById("undoBtn");
const taskList = document.getElementById("taskList");

let lastDeleted = null;

// Load tasks from DATABASE (not localStorage)
document.addEventListener("DOMContentLoaded", loadTasks);

addBtn.addEventListener("click", addTask);
undoBtn.addEventListener("click", undoTask);

function addTask() {
    if (input.value === "") return;

    fetch("/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: input.value,
                date: dateInput.value
            })
        })
        .then(res => res.json())
        .then(() => {
            loadTasks(); // reload from Neon DB
        });

    input.value = "";
    dateInput.value = "";
}

function loadTasks() {
    fetch("/tasks")
        .then(res => res.json())
        .then(tasks => {
            taskList.innerHTML = ""; // clear list
            tasks.forEach(task => createTaskElement(task));
        });
}

function createTaskElement(task) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task.text + " (" + task.date + ")";
    li.appendChild(span);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    li.appendChild(checkbox);

    li.addEventListener("dblclick", () => {
        lastDeleted = task;

        fetch(/tasks/$ { task.id }, {
            method: "DELETE"
        }).then(() => loadTasks());
    });

    taskList.appendChild(li);
}

function undoTask() {
    if (lastDeleted) {
        fetch("/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(lastDeleted)
        }).then(() => loadTasks());

        lastDeleted = null;
    }
}