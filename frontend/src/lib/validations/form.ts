import { z } from 'zod';
import { toast } from '@/hooks/use-toast';

export type FieldErrors<T> = {
  [K in keyof T]?: string[];
};

export type FormState<T> = {
  errors: FieldErrors<T>;
  isValid: boolean;
};

export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): FormState<T> {
  try {
    schema.parse(data);
    return { errors: {}, isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: FieldErrors<T> = {};
      error.errors.forEach((err) => {
        const field = err.path[0] as keyof T;
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field]?.push(err.message);
      });
      return { errors, isValid: false };
    }
    return { errors: {}, isValid: false };
  }
}

export function handleFormError(error: unknown) {
  if (error instanceof z.ZodError) {
    const firstError = error.errors[0];
    toast({
      variant: "destructive",
      title: "خطأ في التحقق",
      description: firstError.message,
    });
  } else {
    toast({
      variant: "destructive",
      title: "خطأ",
      description: "حدث خطأ غير متوقع",
    });
  }
}

export function formatFieldErrors(errors: FieldErrors<any>): string[] {
  return Object.entries(errors)
    .map(([field, messages]) => messages?.map(msg => `${field}: ${msg}`))
    .flat()
    .filter(Boolean) as string[];
} 