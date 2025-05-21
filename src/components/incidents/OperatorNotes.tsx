
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Image, X } from "lucide-react";

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

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      onAddImage(imageUrl);
      setImageUrl("");
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
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="أدخل رابط الصورة"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-grow"
            />
            <Button 
              type="button" 
              onClick={handleAddImage}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Image className="h-4 w-4" />
              إضافة صورة
            </Button>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={img} 
                    alt={`صورة ${index + 1}`} 
                    className="w-full h-32 object-cover rounded-md"
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
