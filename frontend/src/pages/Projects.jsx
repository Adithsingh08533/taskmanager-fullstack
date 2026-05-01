import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  FolderPlus, 
  Search, 
  MoreVertical, 
  Users, 
  Calendar,
  ChevronRight,
  Loader2,
  Plus
} from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ title: '', description: '' });
      fetchProjects();
    } catch (err) {
      alert('Failed to create project');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Projects</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and track your team projects.</p>
        </div>
        {user.role === 'admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link 
            key={project.id} 
            to={`/projects/${project.id}`}
            className="card group hover:border-primary-200 dark:hover:border-primary-900/50 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-xl group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                <FolderPlus className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-primary-500 transition-colors" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 min-h-[2.5rem]">
              {project.description || 'No description provided.'}
            </p>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="flex -space-x-2">
                {project.members?.slice(0, 3).map((m, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                    {m.name.charAt(0)}
                  </div>
                ))}
                {project.members?.length > 3 && (
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    +{project.members.length - 3}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Create New Project</h2>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Project Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  placeholder="e.g., Marketing Q2"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                <textarea
                  rows="3"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  placeholder="What is this project about?"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
