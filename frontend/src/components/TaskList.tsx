import { useState } from "react";
import { Calendar, Pencil, Trash2, Check, CheckCircle2 } from "lucide-react";
import type { Task, Priority, Status } from "../api";

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  onStatusChange?: (taskId: number, newStatus: Status) => void;
}

const priorityConfig: Record<Priority, { label: string; badge: string }> = {
  High: {
    label: "High",
    badge: "bg-rose-50 text-rose-700 border-rose-200/70",
  },
  Medium: {
    label: "Medium",
    badge: "bg-amber-50 text-amber-700 border-amber-200/70",
  },
  Low: {
    label: "Low",
    badge: "bg-teal-50 text-teal-700 border-teal-200/70",
  },
};

const statusConfig: Record<
  Status,
  { label: string; badge: string; dot: string; borderAccent: string }
> = {
  Completed: {
    label: "Completed",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
    dot: "bg-emerald-500",
    borderAccent: "border-l-emerald-500",
  },
  "In Progress": {
    label: "In Progress",
    badge: "bg-sky-50 text-sky-700 border-sky-200/70",
    dot: "bg-sky-500",
    borderAccent: "border-l-sky-500",
  },
  Pending: {
    label: "Pending",
    badge: "bg-amber-50 text-amber-700 border-amber-200/70",
    dot: "bg-amber-500",
    borderAccent: "border-l-amber-400",
  },
};

function TaskList({
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange,
}: TaskListProps) {
  const [filter, setFilter] = useState<"All" | Status>("All");

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    return task.status === filter;
  });

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const counts = {
    All: tasks.length,
    Pending: tasks.filter((t) => t.status === "Pending").length,
    "In Progress": tasks.filter((t) => t.status === "In Progress").length,
    Completed: tasks.filter((t) => t.status === "Completed").length,
  };

  return (
    <div className="space-y-4">
      {/* Soft Filter Tabs */}
      {tasks.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200/70 pb-3">
          {(["All", "Pending", "In Progress", "Completed"] as const).map((tab) => {
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "bg-white text-slate-600 border border-slate-200/70 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {counts[tab]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Task List / Empty States */}
      {filteredTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300/80 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <CheckCircle2 size={24} />
          </div>
          <p className="mt-3 text-sm font-medium text-slate-700">
            {filter === "All"
              ? "No tasks yet in this project"
              : `No ${filter} tasks`}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {filter === "All"
              ? "Create a task above to start organizing your work."
              : "Try switching to another filter tab or create a new task."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === "Completed";
            const currentStatus = statusConfig[task.status] || statusConfig.Pending;
            const currentPriority =
              priorityConfig[task.priority] || priorityConfig.Medium;

            return (
              <div
                key={task.id}
                className={`group rounded-xl border border-slate-200/80 border-l-4 bg-white p-4.5 shadow-2xs transition hover:shadow-sm hover:border-slate-300 ${currentStatus.borderAccent}`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Checkmark & Title & Description */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {onStatusChange && (
                      <button
                        type="button"
                        onClick={() =>
                          onStatusChange(
                            task.id,
                            isCompleted ? "Pending" : "Completed"
                          )
                        }
                        title={
                          isCompleted
                            ? "Mark as Pending"
                            : "Mark as Completed"
                        }
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                          isCompleted
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-slate-300 bg-white text-transparent hover:border-indigo-400"
                        }`}
                      >
                        <Check size={13} strokeWidth={2.5} />
                      </button>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3
                        className={`text-sm font-medium transition ${
                          isCompleted
                            ? "text-slate-400 line-through"
                            : "text-slate-800"
                        }`}
                      >
                        {task.title}
                      </h3>

                      {task.description && (
                        <p
                          className={`mt-1 text-xs leading-relaxed font-normal ${
                            isCompleted ? "text-slate-300" : "text-slate-500"
                          }`}
                        >
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Priority Badge */}
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${currentPriority.badge}`}
                  >
                    {currentPriority.label}
                  </span>
                </div>

                {/* Footer Metadata & Actions */}
                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-3 text-xs">
                    {/* Status Pill with colored dot */}
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${currentStatus.badge}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${currentStatus.dot}`}
                      />
                      {currentStatus.label}
                    </span>

                    {/* Date */}
                    <span className="flex items-center gap-1 text-slate-400 text-xs">
                      <Calendar size={13} />
                      {formatDate(task.createdAt)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition"
                      onClick={() => onEditTask(task)}
                      title="Edit task"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                      onClick={() => onDeleteTask(task.id)}
                      title="Delete task"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TaskList;