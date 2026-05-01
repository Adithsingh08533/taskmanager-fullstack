const User = require('./User');
const Project = require('./Project');
const ProjectMember = require('./ProjectMember');
const Task = require('./Task');

// User created many Projects
User.hasMany(Project, { foreignKey: 'created_by', as: 'ownedProjects' });
Project.belongsTo(User, { foreignKey: 'created_by', as: 'owner' });

// Project has many members (through ProjectMembers)
Project.belongsToMany(User, {
  through: ProjectMember,
  foreignKey: 'project_id',
  otherKey: 'user_id',
  as: 'members',
});
User.belongsToMany(Project, {
  through: ProjectMember,
  foreignKey: 'user_id',
  otherKey: 'project_id',
  as: 'projects',
});

// Project has many Tasks
Project.hasMany(Task, { foreignKey: 'project_id', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

// User assigned to Tasks
User.hasMany(Task, { foreignKey: 'assigned_to', as: 'assignedTasks' });
Task.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

module.exports = { User, Project, ProjectMember, Task };
