import { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ListTodo,
  TrendingUp,
  Briefcase,
  Loader2
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/dashboard');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
    </div>
  );

  const statCards = [
    { title: 'Total Tasks', value: stats.total, icon: ListTodo, color: 'bg-blue-500', bg: 'bg-blue-50' },
    { title: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'bg-emerald-500', bg: 'bg-emerald-50' },
    { title: 'In Progress', value: stats.inProgress, icon: TrendingUp, color: 'bg-indigo-500', bg: 'bg-indigo-50' },
    { title: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'bg-rose-500', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome back to your workspace overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="card flex items-center gap-5">
            <div className={`p-3 rounded-xl ${stat.bg} dark:bg-opacity-10`}>
              <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Project Overview</h2>
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-sm cursor-pointer hover:underline">
              View All Projects
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 text-center border border-transparent dark:border-slate-700">
            <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stats.projectCount}</h3>
            <p className="text-slate-500 dark:text-slate-400">Active Projects Managed</p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Team Productivity</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Task Completion Rate</span>
                <span className="text-slate-900 dark:text-white font-bold">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 shadow-sm shadow-emerald-500/20" 
                  style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
              <h4 className="text-primary-800 dark:text-primary-300 font-semibold text-sm mb-1">Weekly Tip</h4>
              <p className="text-primary-700 dark:text-primary-400 text-xs leading-relaxed">
                Break down large projects into smaller tasks to improve completion rates and team morale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
