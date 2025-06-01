import { useState, useCallback } from 'react';
import { z } from 'zod';

interface UseFormArrayOptions<T> {
  name: string;
  initialValues?: T[];
  schema?: z.ZodSchema<T>;
  maxItems?: number;
  minItems?: number;
  onAdd?: (item: T) => void;
  onRemove?: (index: number) => void;
  onUpdate?: (index: number, item: T) => void;
}

export function useFormArray<T>({
  name,
  initialValues = [],
  schema,
  maxItems,
  minItems = 0,
  onAdd,
  onRemove,
  onUpdate,
}: UseFormArrayOptions<T>) {
  const [items, setItems] = useState<T[]>(initialValues);
  const [errors, setErrors] = useState<Record<number, string>>({});

  const validateItem = useCallback(
    (item: T, index: number) => {
      if (!schema) return true;

      try {
        schema.parse(item);
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[index];
          return newErrors;
        });
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors((prev) => ({
            ...prev,
            [index]: error.errors[0].message,
          }));
        }
        return false;
      }
    },
    [schema]
  );

  const addItem = useCallback(
    (item: T) => {
      if (maxItems && items.length >= maxItems) {
        return false;
      }

      if (validateItem(item, items.length)) {
        setItems((prev) => [...prev, item]);
        onAdd?.(item);
        return true;
      }
      return false;
    },
    [items.length, maxItems, onAdd, validateItem]
  );

  const removeItem = useCallback(
    (index: number) => {
      if (items.length <= minItems) {
        return false;
      }

      setItems((prev) => prev.filter((_, i) => i !== index));
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
      onRemove?.(index);
      return true;
    },
    [items.length, minItems, onRemove]
  );

  const updateItem = useCallback(
    (index: number, item: T) => {
      if (validateItem(item, index)) {
        setItems((prev) =>
          prev.map((existingItem, i) => (i === index ? item : existingItem))
        );
        onUpdate?.(index, item);
        return true;
      }
      return false;
    },
    [onUpdate, validateItem]
  );

  const moveItem = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (
        fromIndex < 0 ||
        fromIndex >= items.length ||
        toIndex < 0 ||
        toIndex >= items.length
      ) {
        return false;
      }

      setItems((prev) => {
        const newItems = [...prev];
        const [movedItem] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, movedItem);
        return newItems;
      });

      return true;
    },
    [items.length]
  );

  const validateAll = useCallback(() => {
    if (!schema) return true;

    let isValid = true;
    items.forEach((item, index) => {
      if (!validateItem(item, index)) {
        isValid = false;
      }
    });
    return isValid;
  }, [items, schema, validateItem]);

  const reset = useCallback(() => {
    setItems(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    items,
    errors,
    addItem,
    removeItem,
    updateItem,
    moveItem,
    validateAll,
    reset,
    canAdd: !maxItems || items.length < maxItems,
    canRemove: items.length > minItems,
  };
} 