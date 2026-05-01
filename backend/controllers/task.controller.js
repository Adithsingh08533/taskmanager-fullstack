const { body, validationResult } = require('express-validator');
const { Task, User, Project, ProjectMember } = require('../models');
const { Op } = require('sequelize');

const isOverdue = (task) => {
  if (!task.deadline || task.status === 'completed') return false;
  return new Date(task.deadline) < new Date();
};

const formatTask = (task) => ({
  ...task.toJSON(),
  isOverdue: isOverdue(task),
  displayStatus: isOverdue(task) ? 'overdue' : task.status,
});

// GET /api/tasks?project_id=&assigned_to=
const getTasks = async (req, res) => {
  try {
    const where = {};
    if (req.query.project_id) where.project_id = req.query.project_id;
    if (req.query.assigned_to) where.assigned_to = req.query.assigned_to;

    // Members see only tasks in their projects
    if (req.user.role !== 'admin') {
      const memberProjects = await ProjectMember.findAll({ where: { user_id: req.user.id } });
      const projectIds = memberProjects.map((pm) => pm.project_id);
      where.project_id = { [Op.in]: projectIds };
    }

    const tasks = await Task.findAll({
      where,
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'title'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(tasks.map(formatTask));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tasks (admin only)
const createTask = [
  body('title').notEmpty().withMessage('Title required'),
  body('project_id').isInt().withMessage('Valid project_id required'),
  body('status').optional().isIn(['pending', 'in_progress', 'completed']),
  body('deadline').optional().isDate(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description, status, assigned_to, project_id, deadline } = req.body;
    try {
      const project = await Project.findByPk(project_id);
      if (!project) return res.status(404).json({ message: 'Project not found' });

      const task = await Task.create({ title, description, status, assigned_to, project_id, deadline });
      const full = await Task.findByPk(task.id, {
        include: [
          { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
          { model: Project, as: 'project', attributes: ['id', 'title'] },
        ],
      });
      res.status(201).json(formatTask(full));
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
];

// GET /api/tasks/:id
const getTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'title'] },
      ],
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(formatTask(task));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/tasks/:id
const updateTask = [
  body('status').optional().isIn(['pending', 'in_progress', 'completed']),
  body('deadline').optional().isDate(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const task = await Task.findByPk(req.params.id);
      if (!task) return res.status(404).json({ message: 'Task not found' });

      // Members can only update status of their assigned tasks
      if (req.user.role !== 'admin') {
        if (task.assigned_to !== req.user.id) {
          return res.status(403).json({ message: 'Not authorized to update this task' });
        }
        const allowed = ['status'];
        const updates = {};
        allowed.forEach((key) => { if (req.body[key]) updates[key] = req.body[key]; });
        await task.update(updates);
      } else {
        await task.update(req.body);
      }

      const updated = await Task.findByPk(task.id, {
        include: [
          { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
          { model: Project, as: 'project', attributes: ['id', 'title'] },
        ],
      });
      res.json(formatTask(updated));
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
];

// DELETE /api/tasks/:id (admin only)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTasks, createTask, getTask, updateTask, deleteTask };
