let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const inputBox = document.getElementById("ipBox");
const taskList = document.getElementById("Tlist");

/* ADD TASK */
function addTask() {
    const text = inputBox.value.trim();
    if (!text) return alert("Enter a task!");

    const task = {
        id: Date.now(),
        text,
        priority: document.getElementById("priority").value,
        tag: document.getElementById("tag").value,
        due: document.getElementById("dueDate").value,
        completed: false,
        important: false
    };

    tasks.push(task);
    saveTasks();
    inputBox.value = "";
    renderTasks();
}

/* RENDER */
function renderTasks() {
    const search = document.getElementById("searchBox").value.toLowerCase();
    const filter = document.getElementById("filter").value;

    taskList.innerHTML = "";

    const today = new Date().toISOString().split("T")[0];

    tasks
        .filter(t => t.text.toLowerCase().includes(search))
        .filter(t => {
            if (filter === "completed") return t.completed;
            if (filter === "pending") return !t.completed;
            return true;
        })
        .sort((a, b) => b.important - a.important)
        .forEach(task => {

            const li = document.createElement("li");

            if (task.due && task.due < today && !task.completed) {
                li.style.background = "#fee2e2";
            }

            li.className = `priority-${task.priority} ${task.completed ? "checked" : ""}`;

            li.innerHTML = `
                <div class="task-text">${task.important ? "⭐ " : ""}${task.text}</div>
                <div class="task-meta">${task.priority} | ${task.tag} | ${task.due || "No date"}</div>
                <div class="task-actions">
                    <span onclick="toggleImportant(${task.id})">⭐</span>
                    <span class="edit-btn" onclick="editTask(${task.id})">✏️</span>
                    <span class="delete-btn" onclick="deleteTask(${task.id})">🗑</span>
                </div>
            `;

            li.onclick = () => toggleTask(task.id);
            taskList.appendChild(li);
        });

    if (taskList.children.length === 0) {
        taskList.innerHTML = "<p style='text-align:center'>No tasks</p>";
    }

    updateProgress();
    updateDashboard();
}

/* TOGGLE */
function toggleTask(id) {
    tasks = tasks.map(t =>
        t.id === id ? {...t, completed: !t.completed} : t
    );
    saveTasks();
    renderTasks();
}

function toggleImportant(id) {
    tasks = tasks.map(t =>
        t.id === id ? {...t, important: !t.important} : t
    );
    saveTasks();
    renderTasks();
}

/* DELETE */
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

/* EDIT */
function editTask(id) {
    const newText = prompt("Edit task:");
    if (newText) {
        tasks = tasks.map(t =>
            t.id === id ? {...t, text: newText} : t
        );
        saveTasks();
        renderTasks();
    }
}

/* STORAGE */
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* PROGRESS */
function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total ? (completed / total) * 100 : 0;

    document.getElementById("progressFill").style.width = percent + "%";
    document.getElementById("progressText").innerText = Math.round(percent) + "% completed";
}

/* DASHBOARD */
function updateDashboard() {
    const today = new Date().toISOString().split("T")[0];

    document.getElementById("totalTasks").innerText = tasks.length;
    document.getElementById("completedTasks").innerText = tasks.filter(t => t.completed).length;
    document.getElementById("overdueTasks").innerText =
        tasks.filter(t => t.due && t.due < today && !t.completed).length;
}

/* THEME */
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

/* INIT */
renderTasks();