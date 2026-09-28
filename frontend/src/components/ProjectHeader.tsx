import { Plus, Trash2, CheckCircle2, Clock, PlayCircle } from "lucide-react";

interface ProjectHeaderProps {
  name: string;
  description?: string | null;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  onAddTask: () => void;
  onDeleteProject?: () => void;
}

function ProjectHeader({
  name,
  description,
  totalTasks,
  completedTasks,
  inProgressTasks,
  pendingTasks,
  onAddTask,
  onDeleteProject,
}: ProjectHeaderProps) {
  const percentComplete =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="mb-6 space-y-4">
      {/* Top Bar: Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
            {name}
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-normal">
            {description || "Manage tasks and track progress for this project."}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onDeleteProject && (
            <button
              type="button"
              onClick={onDeleteProject}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition shadow-2xs"
              title="Delete this project"
            >
              <Trash2 size={15} />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}

          <button
            type="button"
            onClick={onAddTask}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition"
          >
            <Plus size={16} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards with soft colorful accents */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Total Tasks */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
          <div className="text-xs font-medium text-slate-400">Total Tasks</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-semibold text-slate-800">
              {totalTasks}
            </span>
            <span className="text-xs font-normal text-slate-400">items</span>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-xl border border-amber-200/60 bg-amber-50/40 p-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
            <Clock size={13} className="text-amber-500" />
            <span>Pending</span>
          </div>
          <div className="mt-1 text-xl font-semibold text-amber-900">
            {pendingTasks}
          </div>
        </div>

        {/* In Progress */}
        <div className="rounded-xl border border-sky-200/60 bg-sky-50/40 p-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-sky-700">
            <PlayCircle size={13} className="text-sky-500" />
            <span>In Progress</span>
          </div>
          <div className="mt-1 text-xl font-semibold text-sky-900">
            {inProgressTasks}
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/40 p-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
            <CheckCircle2 size={13} className="text-emerald-500" />
            <span>Completed</span>
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-semibold text-emerald-900">
              {completedTasks}
            </span>
            <span className="text-xs font-medium text-emerald-600">
              {percentComplete}%
            </span>
          </div>
        </div>
      </div>

      {/* Subtle Progress Bar */}
      {totalTasks > 0 && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/70">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-500 transition-all duration-500"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default ProjectHeader;