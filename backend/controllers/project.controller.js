const { body, validationResult } = require('express-validator');
const { Project, User, ProjectMember, Task } = require('../models');
const { Op } = require('sequelize');

// GET /api/projects
const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.findAll({
        include: [
          { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
          { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } },
        ],
        order: [['createdAt', 'DESC']],
      });
    } else {
      // Member sees only projects they belong to
      const memberProjects = await ProjectMember.findAll({ where: { user_id: req.user.id } });
      const projectIds = memberProjects.map((pm) => pm.project_id);
      projects = await Project.findAll({
        where: { id: { [Op.in]: projectIds } },
        include: [
          { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
          { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } },
        ],
        order: [['createdAt', 'DESC']],
      });
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/projects (admin only)
const createProject = [
  body('title').notEmpty().withMessage('Title is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description } = req.body;
    try {
      const project = await Project.create({ title, description, created_by: req.user.id });
      // Add creator as member
      await ProjectMember.create({ user_id: req.user.id, project_id: project.id });
      res.status(201).json(project);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
];

// GET /api/projects/:id
const getProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } },
        {
          model: Task, as: 'tasks',
          include: [{ model: User, as: 'assignee', attributes: ['id', 'name'] }],
        },
      ],
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/projects/:id (admin only)
const updateProject = [
  body('title').optional().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const project = await Project.findByPk(req.params.id);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      await project.update(req.body);
      res.json(project);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
];

// DELETE /api/projects/:id (admin only)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await project.destroy();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/projects/:id/members (admin only)
const addMember = [
  body('user_id').isInt().withMessage('Valid user_id required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { user_id } = req.body;
    try {
      const project = await Project.findByPk(req.params.id);
      if (!project) return res.status(404).json({ message: 'Project not found' });

      const user = await User.findByPk(user_id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const existing = await ProjectMember.findOne({
        where: { user_id, project_id: req.params.id },
      });
      if (existing) return res.status(409).json({ message: 'User already a member' });

      await ProjectMember.create({ user_id, project_id: req.params.id });
      res.status(201).json({ message: 'Member added successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
];

// DELETE /api/projects/:id/members/:userId (admin only)
const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const member = await ProjectMember.findOne({ where: { project_id: id, user_id: userId } });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    await member.destroy();
    res.json({ message: 'Member removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProjects, createProject, getProject, updateProject, deleteProject, addMember, removeMember };
