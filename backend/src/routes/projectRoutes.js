const express = require("express");

const {
  createProject,
  getProjects,
  deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

router.post("/", createProject);
router.get("/", getProjects);
router.delete("/:id", deleteProject);

module.exports = router;