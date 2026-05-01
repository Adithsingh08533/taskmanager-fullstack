const bcrypt = require('bcryptjs');
const { User } = require('./models');

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Super Admin',
        email: 'admin@taskmanager.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('✅ Default admin user created: admin@taskmanager.com / admin123');
    }
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  }
};

module.exports = { seedAdmin };
