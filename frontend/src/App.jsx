import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden text-slate-900 dark:text-slate-100">
        {token && <Sidebar />}
        <div className="flex-1 flex flex-col overflow-hidden">
          {token && <Navbar />}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-900">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
              <Route path="/projects/:id" element={<PrivateRoute><ProjectDetails /></PrivateRoute>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
