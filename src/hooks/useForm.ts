import { useState, useCallback } from 'react';
import { z } from 'zod';
import { validateForm, handleFormError, FormState, FieldErrors } from '@/lib/validations/form';

interface UseFormOptions<T> {
  schema: z.ZodSchema<T>;
  initialValues: T;
  onSubmit: (data: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, any>>({
  schema,
  initialValues,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [formState, setFormState] = useState<FormState<T>>({
    errors: {},
    isValid: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear error for the field when it's changed
    setFormState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: undefined },
    }));
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setIsSubmitting(true);
    const validationResult = validateForm(schema, values);

    if (!validationResult.isValid) {
      setFormState(validationResult);
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(values);
      setFormState({ errors: {}, isValid: true });
    } catch (error) {
      handleFormError(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [schema, values, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setFormState({ errors: {}, isValid: true });
  }, [initialValues]);

  const setError = useCallback((field: keyof T, message: string) => {
    setFormState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: [message] },
      isValid: false,
    }));
  }, []);

  const setErrors = useCallback((errors: FieldErrors<T>) => {
    setFormState((prev) => ({
      ...prev,
      errors,
      isValid: false,
    }));
  }, []);

  return {
    values,
    formState,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    setError,
    setErrors,
  };
} 