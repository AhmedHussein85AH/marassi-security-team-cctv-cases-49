
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { MessageSquare, Send } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";

interface Comment {
  id: string;
  text: string;
  userName: string;
  userRole: string;
  timestamp: string;
}

interface IncidentCommentsProps {
  incidentId: string;
  comments: Comment[];
  onAddComment: (text: string) => void;
}

const IncidentComments: React.FC<IncidentCommentsProps> = ({
  incidentId,
  comments,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
      toast({
        title: "تم إضافة تعليق",
        description: "تم إضافة التعليق بنجاح",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">التعليقات</h3>

      <div className="border rounded-md p-4 space-y-4 max-h-[400px] overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 flex flex-col items-center">
            <MessageSquare className="h-12 w-12 mb-2 opacity-20" />
            <p>لا توجد تعليقات بعد</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 pb-4 border-b last:border-0">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{getInitials(comment.userName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{comment.userName}</span>
                    <span className="text-sm text-gray-500 mr-2">
                      ({comment.userRole})
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.timestamp), {
                      addSuffix: true,
                      locale: ar,
                    })}
                  </span>
                </div>
                <p className="text-sm mt-1">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1">
          <Textarea
            placeholder="أضف تعليق..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="resize-none min-h-[80px]"
          />
        </div>
        <Button type="submit" className="flex items-center gap-1">
          <Send className="h-4 w-4" />
          <span>إرسال</span>
        </Button>
      </form>
    </div>
  );
};

export default IncidentComments;
