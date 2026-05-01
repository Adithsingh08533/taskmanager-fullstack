const { Task, Project, ProjectMember } = require('../models');
const { Op } = require('sequelize');

// GET /api/dashboard
const getDashboard = async (req, res) => {
  try {
    const where = {};
    const today = new Date();

    // Scope tasks to user's projects if member
    if (req.user.role !== 'admin') {
      const memberProjects = await ProjectMember.findAll({ where: { user_id: req.user.id } });
      const projectIds = memberProjects.map((pm) => pm.project_id);
      where.project_id = { [Op.in]: projectIds };
    }

    const allTasks = await Task.findAll({ where });

    const total = allTasks.length;
    const completed = allTasks.filter((t) => t.status === 'completed').length;
    const inProgress = allTasks.filter((t) => t.status === 'in_progress').length;
    const pending = allTasks.filter((t) => t.status === 'pending').length;
    const overdue = allTasks.filter(
      (t) => t.deadline && t.status !== 'completed' && new Date(t.deadline) < today
    ).length;

    // Project count
    let projectCount;
    if (req.user.role === 'admin') {
      projectCount = await Project.count();
    } else {
      projectCount = await ProjectMember.count({ where: { user_id: req.user.id } });
    }

    res.json({ total, completed, inProgress, pending, overdue, projectCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboard };
