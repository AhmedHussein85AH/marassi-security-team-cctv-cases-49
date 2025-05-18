import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { authService } from "@/services/authService";
import { User } from "@/types/user";

interface PermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  onSave: (permissions: string[]) => void;
}

const PermissionsDialog: React.FC<PermissionsDialogProps> = ({
  open,
  onOpenChange,
  selectedUser,
  onSave,
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const permissionsList = authService.getAllPermissions();

  useEffect(() => {
    if (selectedUser) {
      setSelectedPermissions(selectedUser.permissions || []);
    }
  }, [selectedUser]);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setSelectedPermissions(prev => {
      if (checked) {
        return [...prev, permissionId];
      } else {
        return prev.filter(p => p !== permissionId);
      }
    });
  };

  const handleGroupChange = (groupPermissions: string[], checked: boolean) => {
    setSelectedPermissions(prev => {
      if (checked) {
        return [...new Set([...prev, ...groupPermissions])];
      } else {
        return prev.filter(p => !groupPermissions.includes(p));
      }
    });
  };

  const isGroupChecked = (groupPermissions: string[]) => {
    return groupPermissions.every(p => selectedPermissions.includes(p));
  };

  const isGroupIndeterminate = (groupPermissions: string[]) => {
    const checkedCount = groupPermissions.filter(p => selectedPermissions.includes(p)).length;
    return checkedCount > 0 && checkedCount < groupPermissions.length;
  };

  const handleSave = () => {
    onSave(selectedPermissions);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>إدارة صلاحيات المستخدم</DialogTitle>
          <DialogDescription>
            {selectedUser ? `تعديل صلاحيات ${selectedUser.name}` : 'تحديد الصلاحيات'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {permissionsList.map((group) => (
            <div key={group.group} className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`group-${group.group}`}
                  checked={isGroupChecked(group.permissions.map(p => p.id))}
                  onCheckedChange={(checked) => 
                    handleGroupChange(
                      group.permissions.map(p => p.id),
                      checked as boolean
                    )
                  }
                  indeterminate={isGroupIndeterminate(group.permissions.map(p => p.id))}
                />
                <label
                  htmlFor={`group-${group.group}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {group.group}
                </label>
              </div>

              <div className="mr-6 space-y-2">
                {group.permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission.id}
                      checked={selectedPermissions.includes(permission.id)}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(permission.id, checked as boolean)
                      }
                    />
                    <div>
                      <label
                        htmlFor={permission.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {permission.label}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={handleSave}>
            حفظ التغييرات
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionsDialog; 