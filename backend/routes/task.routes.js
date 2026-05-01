const express = require('express');
const router = express.Router();
const { getTasks, createTask, getTask, updateTask, deleteTask } = require('../controllers/task.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.get('/', authenticate, getTasks);
router.post('/', authenticate, requireAdmin, createTask);
router.get('/:id', authenticate, getTask);
router.put('/:id', authenticate, updateTask);
router.delete('/:id', authenticate, requireAdmin, deleteTask);

module.exports = router;
