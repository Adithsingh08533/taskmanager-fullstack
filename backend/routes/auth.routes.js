const express = require('express');
const router = express.Router();
const { register, login, getMe, getAllUsers } = require('../controllers/auth.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.get('/users', authenticate, requireAdmin, getAllUsers);

module.exports = router;
