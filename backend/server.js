import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import caseRoutes from './routes/cases.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cases', caseRoutes);

// في أعلى الملف
const incidents = [
  {
    id: "1",
    type: "سرقة",
    status: "جديد",
    date: "2024-06-01",
    location: "فيلا 10",
    reporter: "أحمد",
    description: "تمت سرقة بعض الأغراض.",
  },
  {
    id: "2",
    type: "تخريب",
    status: "جاري المعالجة",
    date: "2024-06-02",
    location: "موقف السيارات",
    reporter: "سارة",
    description: "تخريب سيارة.",
  }
];

// هذا هو الـ endpoint المطلوب
app.get('/api/incidents', (req, res) => {
  res.json(incidents);
});

// Error handling middleware
app.use(errorHandler);

// MongoDB Connection with retry logic
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/security-management-system';
    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Don't exit the process, let the server continue running
    // The connection will be retried automatically
  }
};

// Initial connection
connectDB();

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  connectDB();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 