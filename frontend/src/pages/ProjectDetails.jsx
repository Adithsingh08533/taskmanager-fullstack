import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import { 
  Plus, 
  Users, 
  Settings, 
  ArrowLeft,
  Loader2,
  X,
  UserPlus
} from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  
  const [newTask, setNewTask] = useState({ title: '', description: '', assigned_to: '', deadline: '' });
  const [selectedUserId, setSelectedUserId] = useState('');
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    fetchProject();
    if (isAdmin) fetchUsers();
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
    } catch (err) {
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (err) {}
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, project_id: id });
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', assigned_to: '', deadline: '' });
      fetchProject();
    } catch (err) {
      alert('Failed to create task');
    }
  };

  const handleUpdateStatus = async (task) => {
    const nextStatus = task.status === 'pending' ? 'in_progress' : 
                     task.status === 'in_progress' ? 'completed' : 'pending';
    try {
      await api.put(`/tasks/${task.id}`, { status: nextStatus });
      fetchProject();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/members`, { user_id: selectedUserId });
      setShowMemberModal(false);
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      fetchProject();
    } catch (err) {
      alert('Failed to remove member');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/projects')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{project.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Created by {project.owner?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tasks</h2>
            {isAdmin && (
              <button onClick={() => setShowTaskModal(true)} className="btn btn-primary btn-sm flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Task
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.tasks?.length > 0 ? (
              project.tasks.map(task => (
                <TaskCard key={task.id} task={task} onStatusUpdate={handleUpdateStatus} />
              ))
            ) : (
              <div className="col-span-2 py-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-slate-400 dark:text-slate-600">No tasks assigned yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4" /> Members
              </h2>
              {isAdmin && (
                <button onClick={() => setShowMemberModal(true)} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-700 rounded transition-colors">
                  <Plus className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </button>
              )}
            </div>
            <div className="space-y-3">
              {project.members?.map(m => (
                <div key={m.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-xs uppercase">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{m.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">{m.email}</p>
                    </div>
                  </div>
                  {isAdmin && m.id !== project.created_by && (
                    <button 
                      onClick={() => handleRemoveMember(m.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Assign New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <input
                type="text" required placeholder="Task Title"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
              />
              <textarea
                placeholder="Task Description"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}
              />
              <select
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
                value={newTask.assigned_to} onChange={e => setNewTask({...newTask, assigned_to: e.target.value})}
              >
                <option value="">Assign to member</option>
                {project.members?.map(m => <option key={m.id} value={m.id} className="bg-white dark:bg-slate-800">{m.name}</option>)}
              </select>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
                value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})}
              />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowTaskModal(false)} className="flex-1 btn btn-secondary">Cancel</button>
                <button type="submit" className="flex-1 btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Add Team Member</h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <select
                required
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
                value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}
              >
                <option value="" className="bg-white dark:bg-slate-800">Select User</option>
                {users.filter(u => !project.members?.some(m => m.id === u.id)).map(u => (
                  <option key={u.id} value={u.id} className="bg-white dark:bg-slate-800">{u.name} ({u.email})</option>
                ))}
              </select>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowMemberModal(false)} className="flex-1 btn btn-secondary">Cancel</button>
                <button type="submit" className="flex-1 btn btn-primary">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
