import React from 'react';
import { Button } from './button';
import { Card } from './card';
import { Icon } from './icon';

interface FormArrayProps<T> {
  items: T[];
  errors: Record<number, string>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, item: T) => void;
  onMove?: (fromIndex: number, toIndex: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  addLabel?: string;
  removeLabel?: string;
  maxItems?: number;
  minItems?: number;
  className?: string;
}

export function FormArray<T>({
  items,
  errors,
  onAdd,
  onRemove,
  onUpdate,
  onMove,
  renderItem,
  addLabel = 'إضافة عنصر',
  removeLabel = 'حذف',
  maxItems,
  minItems = 0,
  className = '',
}: FormArrayProps<T>) {
  const canAdd = !maxItems || items.length < maxItems;
  const canRemove = items.length > minItems;

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              {renderItem(item, index)}
              {errors[index] && (
                <p className="mt-1 text-sm text-red-500">{errors[index]}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {onMove && index > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onMove(index, index - 1)}
                  title="نقل لأعلى"
                >
                  <Icon name="arrow-up" />
                </Button>
              )}
              {onMove && index < items.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onMove(index, index + 1)}
                  title="نقل لأسفل"
                >
                  <Icon name="arrow-down" />
                </Button>
              )}
              {canRemove && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(index)}
                  title={removeLabel}
                >
                  <Icon name="trash" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}

      {canAdd && (
        <Button
          variant="outline"
          onClick={onAdd}
          className="w-full"
        >
          <Icon name="plus" className="ml-2" />
          {addLabel}
        </Button>
      )}
    </div>
  );
} 