import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/security-management-system');
    console.log('Connected to MongoDB');

    // Delete existing user if exists
    await User.deleteOne({ email: 'AhmedHusseinElsayed@outlook.com' });
    console.log('Deleted existing test user if any');

    // Create test user
    const testUser = new User({
      username: 'ahmed',
      email: 'AhmedHusseinElsayed@outlook.com',
      password: 'StrongPass@123$',
      role: 'أدمن',
      name: 'أحمد حسين',
      permissions: ['all'],
      department: 'إدارة الأمن',
      phoneNumber: '0500000000',
      status: 'نشط'
    });

    await testUser.save();
    console.log('Test user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

createTestUser(); 