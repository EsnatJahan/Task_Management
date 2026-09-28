const express = require("express");
const cors = require("cors");

const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Task Management API is running" });
});

app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

module.exports = app;