const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const pendingList = document.getElementById("pending-list");
const completedList = document.getElementById("completed-list");
const pendingCount = document.getElementById("pending-count");
const completedCount = document.getElementById("completed-count");

let tasks = [];
let editingId = null;

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
    const savedTasks = JSON.parse(saved);
    tasks = Array.isArray(savedTasks) ? savedTasks : [];
  } catch {
    tasks = [];
  }
}

function addTask(text) {
  const cleanText = text.trim();

  if (cleanText === "") {
    return;
  }

  editingId = null;

  tasks.push({
    id: Date.now(),
    text: cleanText,
    completed: false,
    createdAt: new Date().toLocaleString(),
    completedAt: null
  });

  saveTasks();
  render();
}

function createActionButton(label, action) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.dataset.action = action;
  return button;
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id;

  // Edit mode: input aur Save/Cancel buttons dikhayein.
  if (task.id === editingId) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = task.text;
    li.appendChild(input);

    const actions = document.createElement("div");
    actions.className = "task-actions";
    actions.appendChild(createActionButton("Save", "save"));
    actions.appendChild(createActionButton("Cancel", "cancel"));
    li.appendChild(actions);

    return li;
  }

  const textSpan = document.createElement("span");
  textSpan.textContent = task.text;

  if (task.completed) {
    textSpan.classList.add("completed");
  }

  li.appendChild(textSpan);

  const time = document.createElement("small");

  if (task.completed && task.completedAt) {
    time.textContent =
      "Added: " + task.createdAt + " | Completed: " + task.completedAt;
  } else {
    time.textContent = "Added: " + task.createdAt;
  }

  li.appendChild(time);

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const toggleLabel = task.completed ? "Undo" : "Complete";
  actions.appendChild(createActionButton(toggleLabel, "toggle"));
  actions.appendChild(createActionButton("Edit", "edit"));
  actions.appendChild(createActionButton("Delete", "delete"));

  li.appendChild(actions);

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

  // Edit input ab page par aa chuka hai, ab usse focus kar sakte hain.
  const editInput = document.querySelector(
    "#pending-list input, #completed-list input"
  );

  if (editInput) {
    editInput.focus();
    editInput.select();
  }
}

function toggleTask(id) {
  const task = tasks.find(function (task) {
    return Number(task.id) === Number(id);
  });

  if (!task) {
    return;
  }

  task.completed = !task.completed;

  if (task.completed) {
    task.completedAt = new Date().toLocaleString();
  } else {
    task.completedAt = null;
  }

  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return Number(task.id) !== Number(id);
  });

  if (editingId === Number(id)) {
    editingId = null;
  }

  saveTasks();
  render();
}

function startEdit(id) {
  editingId = Number(id);
  render();
}

function saveEdit(id, li) {
  const input = li.querySelector("input");
  const cleanText = input.value.trim();

  if (cleanText === "") {
    input.focus();
    return;
  }

  const task = tasks.find(function (task) {
    return Number(task.id) === Number(id);
  });

  if (!task) {
    return;
  }

  task.text = cleanText;
  editingId = null;

  saveTasks();
  render();
}

function cancelEdit() {
  editingId = null;
  render();
}

function handleListClick(event) {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  const li = button.closest("li");

  if (!li || !li.dataset.id) {
    return;
  }

  const id = Number(li.dataset.id);
  const action = button.dataset.action;

  if (action === "toggle") {
    toggleTask(id);
  } else if (action === "delete") {
    deleteTask(id);
  } else if (action === "edit") {
    startEdit(id);
  } else if (action === "save") {
    saveEdit(id, li);
  } else if (action === "cancel") {
    cancelEdit();
  }
}

function handleListKeydown(event) {
  if (!event.target.matches("input")) {
    return;
  }

  const li = event.target.closest("li");

  if (!li || !li.dataset.id) {
    return;
  }

  const id = Number(li.dataset.id);

  if (event.key === "Enter") {
    event.preventDefault();
    saveEdit(id, li);
  } else if (event.key === "Escape") {
    cancelEdit();
  }
}

pendingList.addEventListener("click", handleListClick);
completedList.addEventListener("click", handleListClick);

pendingList.addEventListener("keydown", handleListKeydown);
completedList.addEventListener("keydown", handleListKeydown);

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