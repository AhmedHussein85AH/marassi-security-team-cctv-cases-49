import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createInitialAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@security.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@security.com',
      password: 'Security@2024',
      name: 'Admin User',
      role: 'admin',
      isActive: true,
      permissions: ['*'], // All permissions
      department: 'إدارة الأمن',
      phoneNumber: '0555555555'
    });

    await adminUser.save();
    console.log('Admin user created successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createInitialAdmin(); 