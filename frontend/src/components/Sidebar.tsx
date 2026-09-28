import { Folder, Plus, CheckSquare } from "lucide-react";
import type { Project } from "../api";

interface SidebarProps {
  projects: Project[];
  selectedProjectId: number | null;
  onSelectProject: (id: number) => void;
  onCreateProject: () => void;
}

// Gentle pastel folder color cycle
const folderColors = [
  "text-indigo-500",
  "text-violet-500",
  "text-sky-500",
  "text-teal-500",
  "text-amber-500",
  "text-rose-500",
];

function Sidebar({
  projects,
  selectedProjectId,
  onSelectProject,
  onCreateProject,
}: SidebarProps) {
  return (
    <aside className="flex w-64 flex-col border-r border-slate-200/80 bg-white">
      {/* Brand Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 p-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-sm shadow-indigo-200">
          <CheckSquare size={19} />
        </div>
        <div>
          <h1 className="text-base font-semibold text-slate-800 tracking-tight">
            Task Management
          </h1>
          <p className="text-xs text-slate-400">Workspace</p>
        </div>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-2.5 flex items-center justify-between px-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Projects
          </h2>

          <button
            onClick={onCreateProject}
            className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition"
            title="Create project"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-1">
          {projects.map((project, idx) => {
            const isSelected = selectedProjectId === project.id;
            const folderColor = folderColors[idx % folderColors.length];

            return (
              <button
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                  isSelected
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <Folder
                    size={16}
                    className={`shrink-0 transition ${
                      isSelected ? "text-indigo-600" : folderColor
                    }`}
                  />
                  <span className="truncate">{project.name}</span>
                </div>

                {project._count !== undefined && (
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs font-normal transition ${
                      isSelected
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/80"
                    }`}
                  >
                    {project._count.tasks}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {projects.length === 0 && (
          <div className="px-3 py-6 text-center text-xs text-slate-400">
            No projects yet.
          </div>
        )}
      </div>

      {/* Footer Create Action */}
      <div className="border-t border-slate-100 p-4">
        <button
          onClick={onCreateProject}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;