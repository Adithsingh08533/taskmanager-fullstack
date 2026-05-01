import { Bell, Search, Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 md:px-8">
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">
          <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search tasks, projects..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 rounded-lg text-sm transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />
        <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-px bg-slate-200 mx-1"></div>
        <div className="flex items-center gap-3">
          <span className="hidden lg:block text-sm font-medium text-slate-700">Team Workspace</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
