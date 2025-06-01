import bcryptjs from 'bcryptjs';
import { jwtDecode } from 'jwt-decode';

// تشفير كلمة المرور
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcryptjs.genSalt(12);
  return bcryptjs.hash(password, salt);
};

// التحقق من كلمة المرور
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcryptjs.compare(password, hashedPassword);
};

// التحقق من قوة كلمة المرور
export const isStrongPassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};

// تنظيف البيانات المدخلة
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // منع HTML tags
    .trim(); // إزالة المسافات الزائدة
};

// التحقق من صلاحية التوكن
export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return (decoded.exp || 0) > currentTime;
  } catch {
    return false;
  }
};

// قائمة محاولات تسجيل الدخول الفاشلة
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

// التحقق من محاولات تسجيل الدخول
export const checkLoginAttempts = (email: string): boolean => {
  const attempts = loginAttempts.get(email);
  const now = Date.now();
  
  if (!attempts) {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
    return true;
  }

  // إعادة تعيين العداد بعد 30 دقيقة
  if (now - attempts.lastAttempt > 30 * 60 * 1000) {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
    return true;
  }

  // منع تسجيل الدخول بعد 5 محاولات فاشلة
  if (attempts.count >= 5) {
    return false;
  }

  loginAttempts.set(email, { 
    count: attempts.count + 1, 
    lastAttempt: now 
  });
  return true;
};

// تنظيف محاولات تسجيل الدخول القديمة
setInterval(() => {
  const now = Date.now();
  loginAttempts.forEach((value, key) => {
    if (now - value.lastAttempt > 30 * 60 * 1000) {
      loginAttempts.delete(key);
    }
  });
}, 5 * 60 * 1000); // كل 5 دقائق 