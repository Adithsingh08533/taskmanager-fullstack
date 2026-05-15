require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db');
require('./models');
const { seedAdmin } = require('./seed');

// Routes
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

// ✅ CORS (Allow the Railway frontend domain)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://taskmanager-frontend-production-5fa1.up.railway.app',
  'https://taskmanager-fullstack-roan.vercel.app',
  'https://taskmanager-fullstack-i8f539oth-adithsingh08533s-projects.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS Blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
console.log('Mounting routes...');
app.use('/api/auth', authRoutes);
console.log('Auth routes mounted at /api/auth');
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/', (req, res) => {
  console.log('Root health check hit');
  res.json({
    message: 'Task Manager API Running 🚀',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;

// Start server immediately to pass Railway health checks
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Listening on 0.0.0.0:${PORT}`);

  // Now sync database in the background
  sequelize.sync()
    .then(async () => {
      console.log('✅ Database synced successfully');
      await seedAdmin();
    })
    .catch((err) => {
      console.error('❌ DB Sync failed:', err.message);
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});