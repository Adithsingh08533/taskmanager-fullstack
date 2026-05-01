import { Calendar, User, Clock, CheckCircle2, Circle } from 'lucide-react';

const TaskCard = ({ task, onStatusUpdate }) => {
  const status = task?.status || "pending";

  const isOverdue =
    task?.deadline &&
    new Date(task.deadline) < new Date() &&
    status !== "completed";

  const displayStatus = isOverdue ? "overdue" : status;

  const getStatusBadge = (status, displayStatus) => {
    if (displayStatus === 'overdue') return 'badge badge-overdue';
    switch (status) {
      case 'completed': return 'badge badge-completed';
      case 'in_progress': return 'badge badge-progress';
      default: return 'badge badge-pending';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    return <Circle className="w-5 h-5 text-slate-300" />;
  };

  return (
    <div className="card hover:shadow-md transition-shadow group dark:hover:border-slate-600">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <h4 className={`font-semibold text-slate-800 dark:text-slate-200 ${status === 'completed' ? 'line-through opacity-60' : ''}`}>
            {task?.title}
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {task?.description}
          </p>
        </div>

        <button
          onClick={() => onStatusUpdate(task)}
          className="mt-0.5 hover:scale-110 transition-transform"
        >
          {getStatusIcon(status)}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">

        {/* Status Badge */}
        <div className={`flex items-center gap-1.5 ${getStatusBadge(status, displayStatus)}`}>
          {displayStatus === 'overdue' && <Clock className="w-3 h-3" />}
          {displayStatus.replace('_', ' ')}
        </div>

        {/* Deadline */}
        {task?.deadline && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(task.deadline).toLocaleDateString()}
          </div>
        )}

        {/* Assignee */}
        {task?.assignee && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-auto">
            <User className="w-3.5 h-3.5" />
            {task.assignee.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;