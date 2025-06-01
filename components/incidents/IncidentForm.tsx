
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from "@/components/ui/form";
import { AlertTriangle, Clock, MapPin, FileText, Image, Car, User, Upload } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  type: z.string().min(1, "نوع البلاغ مطلوب"),
  location: z.string().min(1, "موقع الحادث مطلوب"),
  date: z.string().min(1, "تاريخ الحادث مطلوب"),
  time: z.string().min(1, "وقت الحادث مطلوب"),
  propertyId: z.string().min(1, "معرف العقار مطلوب"),
  reporter: z.string().min(1, "اسم المبلغ مطلوب"),
  receiver: z.string().min(1, "مستلم البلاغ مطلوب"),
  description: z.string().min(5, "تفاصيل الحادث مطلوبة"),
  personDetails: z.string().optional(),
  vehicleDetails: z.string().optional(),
  notes: z.string().optional(),
  videoPath: z.string().optional(),
  imagePath: z.string().optional(),
});

const incidentTypes = [
  "سرقة",
  "حادث", 
  "تحرش",
  "مشاجرة",
  "اختراق بوابة",
  "مخالفة تعليمات المجتمع السكني",
  "فعل فاضح",
  "سرعة زائدة",
  "قيادة عكس الاتجاه",
  "ركن مخالف",
  "تلف حوض زراعة",
  "احتباس في المصعد",
  "تعاطي مخدرات",
  "إزعاج",
  "عمل بدون تصريح",
  "مخالفة تصريح العمل",
  "سوء استخدام الأماكن العامة",
  "أخرى"
];

const IncidentForm = ({ onSubmit }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      location: "",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
      propertyId: "",
      reporter: "",
      receiver: "",
      description: "",
      personDetails: "",
      vehicleDetails: "",
      notes: "",
      videoPath: "",
      imagePath: "",
    },
  });

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedVideo(file);
      form.setValue("videoPath", file.name);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      form.setValue("imagePath", file.name);
    }
  };

  const handleSubmit = (values) => {
    const formData = {
      ...values,
      videoFile: selectedVideo,
      imageFile: selectedImage,
    };
    onSubmit(formData);
    form.reset();
    setSelectedVideo(null);
    setSelectedImage(null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  نوع البلاغ
                </FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    {...field}
                  >
                    <option value="">اختر نوع البلاغ</option>
                    {incidentTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  موقع الحادث
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="أدخل موقع الحادث" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  تاريخ الحادث
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  وقت الحادث
                </FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="propertyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  رقم الفيلا/الشقة
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="أدخل رقم العقار" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reporter"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  اسم المبلغ
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="أدخل اسم المبلغ" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="receiver"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  مستلم البلاغ
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="أدخل اسم مستلم البلاغ" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                تفاصيل الحادث
              </FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="أدخل تفاصيل الحادث" rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="personDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  بيانات الأشخاص
                </FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="أدخل بيانات الأشخاص المعنيين" rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicleDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  بيانات المركبات
                </FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="أدخل بيانات المركبات" rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="videoPath"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  مسار الفيديو
                </FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="cursor-pointer"
                    />
                    {selectedVideo && (
                      <p className="text-sm text-muted-foreground">
                        تم اختيار: {selectedVideo.name}
                      </p>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imagePath"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  إضافة صورة
                </FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    {selectedImage && (
                      <p className="text-sm text-muted-foreground">
                        تم اختيار: {selectedImage.name}
                      </p>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                ملاحظات إضافية
              </FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="أدخل أي ملاحظات إضافية" rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="submit">إضافة البلاغ</Button>
        </div>
      </form>
    </Form>
  );
};

export default IncidentForm;
