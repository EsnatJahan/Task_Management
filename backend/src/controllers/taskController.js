const prisma = require("../config/database");

const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;

    const whereClause = {};
    if (projectId) {
      const parsedProjectId = parseInt(projectId, 10);
      if (isNaN(parsedProjectId)) {
        return res.status(400).json({ message: "Invalid projectId query parameter" });
      }
      whereClause.projectId = parsedProjectId;
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, projectId } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const parsedProjectId = parseInt(projectId, 10);
    if (!parsedProjectId || isNaN(parsedProjectId)) {
      return res.status(400).json({ message: "Valid projectId is required" });
    }

    const projectExists = await prisma.project.findUnique({
      where: { id: parsedProjectId },
    });

    if (!projectExists) {
      return res.status(404).json({ message: "Project not found" });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority || "Medium",
        status: status || "Pending",
        projectId: parsedProjectId,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id, 10);

    if (isNaN(taskId)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const { title, description, priority, status } = req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ message: "Task title cannot be empty" });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(500).json({ message: "Failed to update task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id, 10);

    if (isNaN(taskId)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(500).json({ message: "Failed to delete task" });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
