const input = document.getElementById("taskInput");
const dateInput = document.getElementById("dueDateInput");
const addBtn = document.getElementById("addBtn");
const undoBtn = document.getElementById("undoBtn");
const taskList = document.getElementById("taskList");

let lastDeleted = null;

// Load tasks when page loads
document.addEventListener("DOMContentLoaded", loadTasks);

addBtn.addEventListener("click", addTask);
undoBtn.addEventListener("click", undoTask);

function addTask() {
  if (input.value === "") return;

  const task = {
    text: input.value,
    date: dateInput.value,
    completed: false
  };

  saveTask(task);
  createTaskElement(task);

  input.value = "";
  dateInput.value = "";
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

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    updateStorage();
  });

  li.addEventListener("dblclick", () => {
    lastDeleted = task;
    li.remove();
    deleteTask(task);
  });

  taskList.appendChild(li);
}

function saveTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function loadTasks() {
  const tasks = getTasks();
  tasks.forEach(task => createTaskElement(task));
}

function deleteTask(taskToDelete) {
  let tasks = getTasks();
  tasks = tasks.filter(task => task.text !== taskToDelete.text);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function undoTask() {
  if (lastDeleted) {
    saveTask(lastDeleted);
    createTaskElement(lastDeleted);
    lastDeleted = null;
  }
}

function updateStorage() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    const spanText = li.querySelector("span").textContent;
    const checkbox = li.querySelector("input");
    const parts = spanText.split(" (");
    tasks.push({
      text: parts[0],
      date: parts[1].replace(")", ""),
      completed: checkbox.checked
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}