import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

async function main() {
  await mongoose.connect('mongodb://localhost:27017/security-management-system');

  const email = 'AhmedHusseinElsayed@outlook.com';
  const password = 'StrongPass@123$';
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('المستخدم موجود بالفعل');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name: 'Admin',
    email,
    password: hashedPassword,
    role: 'أدمن',
    department: 'الإدارة',
    phoneNumber: '0500000000',
    status: 'نشط'
  });

  await user.save();
  console.log('تم إضافة الأدمن بنجاح');
  process.exit(0);
}

main();