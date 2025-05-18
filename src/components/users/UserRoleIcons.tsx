
import React from "react";
import { Shield, User, Camera } from "lucide-react";

interface UserRoleIconProps {
  role: string;
  className?: string;
}

export const UserRoleIcon: React.FC<UserRoleIconProps> = ({ role, className = "w-4 h-4" }) => {
  switch (role) {
    case "أدمن":
      return <Shield className={`${className} text-red-500`} />;
    case "مدير":
      return <User className={`${className} text-blue-500`} />;
    case "مشغل كاميرات":
      return <Camera className={`${className} text-green-500`} />;
    default:
      return <User className={`${className} text-gray-500`} />;
  }
};

export default UserRoleIcon;
