import { useState, useCallback } from 'react';
import { z } from 'zod';

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>;
  initialValues: Partial<T>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function useFormValidation<T>({
  schema,
  initialValues,
  validateOnChange = true,
  validateOnBlur = true,
}: UseFormValidationOptions<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback(
    (name: string, value: any) => {
      try {
        // Create a partial schema for the field
        const fieldSchema = schema.shape[name as keyof z.infer<typeof schema>];
        if (fieldSchema) {
          fieldSchema.parse(value);
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          });
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors((prev) => ({
            ...prev,
            [name]: error.errors[0].message,
          }));
        }
      }
    },
    [schema]
  );

  const validateForm = useCallback(
    (values: Partial<T>) => {
      try {
        schema.parse(values);
        setErrors({});
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            if (err.path[0]) {
              newErrors[err.path[0].toString()] = err.message;
            }
          });
          setErrors(newErrors);
        }
        return false;
      }
    },
    [schema]
  );

  const handleChange = useCallback(
    (name: string, value: any) => {
      if (validateOnChange) {
        validateField(name, value);
      }
    },
    [validateField, validateOnChange]
  );

  const handleBlur = useCallback(
    (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      if (validateOnBlur) {
        validateField(name, initialValues[name as keyof T]);
      }
    },
    [validateField, validateOnBlur, initialValues]
  );

  const resetValidation = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  return {
    errors,
    touched,
    validateField,
    validateForm,
    handleChange,
    handleBlur,
    resetValidation,
  };
} 