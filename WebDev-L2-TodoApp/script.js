const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const pendingList = document.getElementById("pending-list");
const completedList = document.getElementById("completed-list");
const pendingCount = document.getElementById("pending-count");
const completedCount = document.getElementById("completed-count");

let tasks = [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasks() {
  const saved = localStorage.getItem("tasks");

  if (!saved) {
    tasks = [];
    return;
  }

  try {
    const parsedTasks = JSON.parse(saved);
    tasks = Array.isArray(parsedTasks) ? parsedTasks : [];
  } catch {
    tasks = [];
  }
}

function addTask(text) {
  const cleanText = text.trim();

  if (cleanText === "") {
    return;
  }

  tasks.push({
    id: Date.now(),
    text: cleanText,
    completed: false,
    createdAt: new Date().toLocaleString()
  });

  saveTasks();
  render();
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id;

  if (task.completed) {
    li.classList.add("completed");
  }

  const span = document.createElement("span");
  span.textContent = task.text;
  li.appendChild(span);

  const time = document.createElement("small");
  time.textContent = "Added: " + task.createdAt;
  li.appendChild(time);

  return li;
}

function render() {
  pendingList.innerHTML = "";
  completedList.innerHTML = "";

  const pendingTasks = tasks.filter(function (task) {
    return !task.completed;
  });

  const completedTasks = tasks.filter(function (task) {
    return task.completed;
  });

  pendingTasks.forEach(function (task) {
    pendingList.appendChild(createTaskElement(task));
  });

  completedTasks.forEach(function (task) {
    completedList.appendChild(createTaskElement(task));
  });

  pendingCount.textContent = pendingTasks.length + " pending";
  completedCount.textContent = completedTasks.length + " completed";

  if (pendingTasks.length === 0) {
    const message = document.createElement("li");
    message.textContent = "Nothing to do. Add a task!";
    pendingList.appendChild(message);
  }

  if (completedTasks.length === 0) {
    const message = document.createElement("li");
    message.textContent = "No completed tasks yet.";
    completedList.appendChild(message);
  }
}

addBtn.addEventListener("click", function () {
  addTask(taskInput.value);
  taskInput.value = "";
});

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask(taskInput.value);
    taskInput.value = "";
  }
});

loadTasks();
render();