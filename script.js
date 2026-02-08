const input = document.getElementById("taskInput");
const dateInput = document.getElementById("dueDateInput");
const addBtn = document.getElementById("addBtn");
const undoBtn = document.getElementById("undoBtn");
const taskListlist = document.getElementById("taskList"); // your ul

let lastDeleted = null;

addBtn.addEventListener("click", addTask);
undoBtn.addEventListener("click", undoTask);

function addTask() {
  if (input.value === "") return;

  const li = document.createElement("li");

  // Task text with date
  const span = document.createElement("span");
  span.textContent = input.value + " (" + dateInput.value + ")";
  li.appendChild(span);

  // Checkbox after task text
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  li.appendChild(checkbox);

  // Double click to delete
  li.addEventListener("dblclick", () => {
    lastDeleted = li; // save the exact li
    li.remove();
  });

  taskListlist.appendChild(li);

  input.value = "";
  dateInput.value = "";
}

function undoTask() {
  if (lastDeleted) {
    taskListlist.appendChild(lastDeleted); // fix: use taskListlist
    lastDeleted = null;
  }
}
