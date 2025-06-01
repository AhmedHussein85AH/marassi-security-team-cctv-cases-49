
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Image, X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OperatorNotesProps {
  notes: string;
  images: string[];
  onNotesChange: (value: string) => void;
  onSaveNotes: () => void;
  onAddImage: (image: string) => void;
  onRemoveImage: (index: number) => void;
}

const OperatorNotes: React.FC<OperatorNotesProps> = ({ 
  notes, 
  images = [],
  onNotesChange,
  onSaveNotes,
  onAddImage,
  onRemoveImage
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const { toast } = useToast();

  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (imageUrl.trim()) {
      onAddImage(imageUrl);
      setImageUrl("");
      
      toast({
        title: "تمت الإضافة",
        description: "تم إضافة الصورة بنجاح",
      });
    } else {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رابط صورة صحيح",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        toast({
          title: "خطأ",
          description: "يرجى اختيار ملف صورة صحيح",
          variant: "destructive"
        });
        return;
      }

      // التحقق من حجم الملف (5MB كحد أقصى)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "خطأ",
          description: "حجم الملف كبير جداً. الحد الأقصى 5MB",
          variant: "destructive"
        });
        return;
      }

      // تحويل الصورة إلى Base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onAddImage(result);
        
        toast({
          title: "تمت الإضافة",
          description: "تم رفع الصورة بنجاح",
        });
      };
      
      reader.onerror = () => {
        toast({
          title: "خطأ",
          description: "حدث خطأ في رفع الصورة",
          variant: "destructive"
        });
      };
      
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ملاحظات المشغل</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="أضف ملاحظاتك هنا..."
          className="min-h-[100px] text-right mb-4"
        />

        <div className="space-y-4">
          {/* رفع الصورة من الجهاز */}
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="flex-grow"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <Upload className="h-4 w-4" />
              رفع صورة
            </label>
          </div>

          {/* إضافة رابط صورة */}
          <form onSubmit={handleAddImageUrl} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="أدخل رابط الصورة"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-grow"
            />
            <Button 
              type="submit"
              variant="outline"
              className="flex items-center gap-2"
            >
              <Image className="h-4 w-4" />
              إضافة رابط
            </Button>
          </form>

          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={img} 
                    alt={`صورة ${index + 1}`} 
                    className="w-full h-32 object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=صورة+غير+متوفرة";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSaveNotes}>حفظ الملاحظات</Button>
      </CardFooter>
    </Card>
  );
};

export default OperatorNotes;
