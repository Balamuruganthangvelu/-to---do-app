const input = document.getElementById("taskInput");
const dateInput = document.getElementById("dueDateInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// Load from database when page opens
document.addEventListener("DOMContentLoaded", loadTasks);

addBtn.addEventListener("click", addTask);

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
    loadTasks(); // reload from DB
  });

  input.value = "";
  dateInput.value = "";
}

function loadTasks() {
  fetch("/tasks")
    .then(res => res.json())
    .then(tasks => {
      taskList.innerHTML = "";
      tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.text + " (" + task.date + ")";
        taskList.appendChild(li);
      });
    });
}