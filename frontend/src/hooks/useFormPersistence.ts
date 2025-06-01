import { useEffect, useState } from 'react';

interface UseFormPersistenceOptions {
  formId: string;
  initialValues: any;
  onRestore?: (values: any) => void;
}

export function useFormPersistence({
  formId,
  initialValues,
  onRestore,
}: UseFormPersistenceOptions) {
  const [isRestored, setIsRestored] = useState(false);

  // Restore form data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(`form_${formId}`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        onRestore?.(parsedData);
      } catch (error) {
        console.error('Error restoring form data:', error);
      }
    }
    setIsRestored(true);
  }, [formId, onRestore]);

  // Save form data when it changes
  const saveFormData = (values: any) => {
    try {
      localStorage.setItem(`form_${formId}`, JSON.stringify(values));
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  // Clear saved form data
  const clearFormData = () => {
    localStorage.removeItem(`form_${formId}`);
  };

  return {
    isRestored,
    saveFormData,
    clearFormData,
  };
} 