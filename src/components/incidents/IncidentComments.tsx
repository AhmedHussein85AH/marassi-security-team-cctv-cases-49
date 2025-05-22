
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format, isValid, parseISO } from 'date-fns';
import { ar } from "date-fns/locale";
import { Send } from "lucide-react";

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

  const formatTimestamp = (timestamp: string) => {
    try {
      // First try to parse as ISO date
      const date = parseISO(timestamp);
      if (isValid(date)) {
        return format(date, 'PPp', { locale: ar });
      }
      
      // If not ISO, try to create date from timestamp
      const dateFromTimestamp = new Date(timestamp);
      if (isValid(dateFromTimestamp)) {
        return format(dateFromTimestamp, 'PPp', { locale: ar });
      }
      
      // If all fails, return the original timestamp
      return timestamp;
    } catch (error) {
      return timestamp;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment("");
      toast({
        title: "تم إضافة تعليق",
        description: "تم إضافة التعليق بنجاح",
      });
    } else {
      toast({
        title: "خطأ",
        description: "لا يمكن إضافة تعليق فارغ",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">التعليقات</h3>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-center">
            <p className="text-gray-500">لا توجد تعليقات حتى الآن</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">{comment.userName}</p>
                  <p className="text-sm text-gray-500">{comment.userRole}</p>
                </div>
                <time className="text-sm text-gray-500">
                  {formatTimestamp(comment.timestamp)}
                </time>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="اكتب تعليقك هنا..."
          className="min-h-[100px]"
        />
        <Button type="submit" className="gap-2">
          <Send className="h-4 w-4" />
          إرسال التعليق
        </Button>
      </form>
    </div>
  );
};

export default IncidentComments;
