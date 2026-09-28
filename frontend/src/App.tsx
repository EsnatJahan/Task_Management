import { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import CreateProjectModal from "./components/CreateProjectModal";
import ProjectHeader from "./components/ProjectHeader";
import TaskList from "./components/TaskList";
import CreateTaskModal from "./components/CreateTaskModal";
import EditTaskModal from "./components/EditTaskModal";
import { api, type Project, type Task, type Priority, type Status } from "./api";
import { FolderPlus, Loader2, AlertCircle } from "lucide-react";

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Load all projects
  const loadProjects = useCallback(async (selectIdAfterLoad?: number) => {
    try {
      setError(null);
      const data = await api.getProjects();
      setProjects(data);

      setSelectedProjectId((currentId) => {
        if (selectIdAfterLoad !== undefined) {
          return selectIdAfterLoad;
        }
        if (currentId && data.some((p) => p.id === currentId)) {
          return currentId;
        }
        return data.length > 0 ? data[0].id : null;
      });
    } catch (err: unknown) {
      console.error("Error loading projects:", err);
      setError("Unable to connect to the server. Please check that the backend is running.");
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  // Load tasks for current project
  const loadTasks = useCallback(async (projectId: number) => {
    try {
      setIsLoadingTasks(true);
      setError(null);
      const data = await api.getTasks(projectId);
      setTasks(data);
    } catch (err: unknown) {
      console.error("Error loading tasks:", err);
      setError("Failed to load tasks for this project.");
    } finally {
      setIsLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    if (selectedProjectId !== null) {
      loadTasks(selectedProjectId);
    } else {
      setTasks([]);
    }
  }, [selectedProjectId, loadTasks]);

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );

  // Handlers for Projects
  const handleCreateProject = async (name: string, description: string) => {
    try {
      const newProject = await api.createProject(name, description);
      await loadProjects(newProject.id);
      setIsCreateProjectOpen(false);
    } catch (err: unknown) {
      console.error("Error creating project:", err);
      alert("Failed to create project. Please try again.");
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete project "${selectedProject.name}" and all its tasks?`
    );
    if (!confirmDelete) return;

    try {
      await api.deleteProject(selectedProject.id);
      await loadProjects();
    } catch (err: unknown) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project. Please try again.");
    }
  };

  // Handlers for Tasks
  const handleCreateTask = async (
    title: string,
    description: string,
    priority: Priority,
    status: Status
  ) => {
    if (!selectedProjectId) return;
    try {
      await api.createTask({
        title,
        description,
        priority,
        status,
        projectId: selectedProjectId,
      });
      setIsCreateTaskOpen(false);
      await loadTasks(selectedProjectId);
      await loadProjects(selectedProjectId);
    } catch (err: unknown) {
      console.error("Error creating task:", err);
      alert("Failed to create task. Please try again.");
    }
  };

  const handleUpdateTask = async (
    id: number,
    title: string,
    description: string,
    priority: Priority,
    status: Status
  ) => {
    try {
      await api.updateTask(id, {
        title,
        description,
        priority,
        status,
      });
      setEditingTask(null);
      if (selectedProjectId) {
        await loadTasks(selectedProjectId);
      }
    } catch (err: unknown) {
      console.error("Error updating task:", err);
      alert("Failed to update task. Please try again.");
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: Status) => {
    try {
      // Optimistic update
      setTasks((current) =>
        current.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      await api.updateTask(taskId, { status: newStatus });
      if (selectedProjectId) {
        await loadProjects(selectedProjectId);
      }
    } catch (err: unknown) {
      console.error("Error toggling task status:", err);
      if (selectedProjectId) {
        await loadTasks(selectedProjectId);
      }
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    try {
      await api.deleteTask(taskId);
      if (selectedProjectId) {
        await loadTasks(selectedProjectId);
        await loadProjects(selectedProjectId);
      }
    } catch (err: unknown) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task. Please try again.");
    }
  };

  // Metrics for ProjectHeader
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;

  return (
    <div className="flex min-h-screen bg-slate-50/70 font-sans text-slate-800 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        onCreateProject={() => setIsCreateProjectOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-6 py-7 md:px-10">
        <div className="mx-auto max-w-5xl">
          {error && (
            <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm text-rose-700">
              <AlertCircle size={17} className="shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {isLoadingProjects ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-indigo-600" size={28} />
              <p className="text-sm font-medium text-slate-400">
                Loading workspace...
              </p>
            </div>
          ) : selectedProject ? (
            <div className="space-y-6">
              <ProjectHeader
                name={selectedProject.name}
                description={selectedProject.description}
                totalTasks={totalTasks}
                completedTasks={completedTasks}
                inProgressTasks={inProgressTasks}
                pendingTasks={pendingTasks}
                onAddTask={() => setIsCreateTaskOpen(true)}
                onDeleteProject={handleDeleteProject}
              />

              {isLoadingTasks ? (
                <div className="flex min-h-[30vh] items-center justify-center">
                  <Loader2 className="animate-spin text-indigo-500" size={24} />
                </div>
              ) : (
                <TaskList
                  tasks={tasks}
                  onEditTask={(task) => setEditingTask(task)}
                  onDeleteTask={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              )}
            </div>
          ) : (
            <div className="flex min-h-[65vh] flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-2xs">
                <FolderPlus size={28} />
              </div>
              <h2 className="mt-4 text-base font-semibold text-slate-800">
                No project selected
              </h2>
              <p className="mt-1 text-xs text-slate-400 max-w-sm">
                Get started by creating your first project to organize and track tasks.
              </p>
              <button
                onClick={() => setIsCreateProjectOpen(true)}
                className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-600 px-4.5 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition"
              >
                Create First Project
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onCreate={handleCreateProject}
      />

      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onCreate={handleCreateTask}
      />

      <EditTaskModal
        isOpen={editingTask !== null}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onUpdate={handleUpdateTask}
      />
    </div>
  );
}

export default App;