const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, "tasks.json");

function readTasks() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

app.get("/api/tasks", (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const { title } = req.body;
  if (!title.trim()) return res.status(400).json({ error: "Title required" });
  const tasks = readTasks();
  const newTask = { id: Date.now(), title, completed: false };
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

app.put("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id == id);
  if (index == -1) return res.status(404).json({ error: "Not Found" });
  tasks[index].completed = !tasks[index].completed;
  writeTasks(tasks);
  res.json(tasks[index]);
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  let tasks = readTasks();
  const newTasks = tasks.filter((t) => t.id != id);
  writeTasks(newTasks);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log("server running on port");
});
