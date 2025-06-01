import { renderHook, act } from '@testing-library/react';
import { useFormArray } from '../useFormArray';
import { z } from 'zod';

describe('useFormArray', () => {
  const testSchema = z.object({
    name: z.string().min(1, 'الاسم مطلوب'),
    value: z.number().min(0, 'القيمة يجب أن تكون موجبة'),
  });

  const initialItems = [
    { name: 'Item 1', value: 10 },
    { name: 'Item 2', value: 20 },
  ];

  it('should initialize with provided values', () => {
    const { result } = renderHook(() =>
      useFormArray({
        name: 'test',
        initialValues: initialItems,
        schema: testSchema,
      })
    );

    expect(result.current.items).toEqual(initialItems);
    expect(result.current.errors).toEqual({});
  });

  it('should add new items', () => {
    const { result } = renderHook(() =>
      useFormArray({
        name: 'test',
        initialValues: initialItems,
        schema: testSchema,
      })
    );

    act(() => {
      result.current.addItem({ name: 'Item 3', value: 30 });
    });

    expect(result.current.items).toHaveLength(3);
    expect(result.current.items[2]).toEqual({ name: 'Item 3', value: 30 });
  });

  it('should remove items', () => {
    const { result } = renderHook(() =>
      useFormArray({
        name: 'test',
        initialValues: initialItems,
        schema: testSchema,
      })
    );

    act(() => {
      result.current.removeItem(0);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual(initialItems[1]);
  });

  it('should update items', () => {
    const { result } = renderHook(() =>
      useFormArray({
        name: 'test',
        initialValues: initialItems,
        schema: testSchema,
      })
    );

    act(() => {
      result.current.updateItem(0, { name: 'Updated Item', value: 15 });
    });

    expect(result.current.items[0]).toEqual({ name: 'Updated Item', value: 15 });
  });

  it('should validate items on add', () => {
    const { result } = renderHook(() =>
      useFormArray({
        name: 'test',
        initialValues: initialItems,
        schema: testSchema,
      })
    );

    act(() => {
      result.current.addItem({ name: '', value: -1 });
    });

    expect(result.current.errors[2]).toBeDefined();
    expect(result.current.items).toHaveLength(2);
  });

  it('should validate items on update', () => {
    const { result } = renderHook(() =>
      useFormArray({
        name: 'test',
        initialValues: initialItems,
        schema: testSchema,
      })
    );

    act(() => {
      result.current.updateItem(0, { name: '', value: -1 });
    });

    expect(result.current.errors[0]).toBeDefined();
  });

  it('should respect maxItems limit', () => {
    const { result } = renderHook(() =>
      useFormArray({
        name: 'test',
        initialValues: initialItems,
        schema: testSchema,
        maxItems: 2,
      })
    );

    act(() => {
      result.current.addItem({ name: 'Item 3', value: 30 });
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.canAdd).toBe(false);
  });

  it('should respect minItems limit', () => {
    const { result } = renderHook(() =>
      useFormArray({
        name: 'test',
        initialValues: initialItems,
        schema: testSchema,
        minItems: 2,
      })
    );

    act(() => {
      result.current.removeItem(0);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.canRemove).toBe(false);
  });

  it('should move items', () => {
    const { result } = renderHook(() =>
      useFormArray({
        name: 'test',
        initialValues: initialItems,
        schema: testSchema,
      })
    );

    act(() => {
      result.current.moveItem(0, 1);
    });

    expect(result.current.items[0]).toEqual(initialItems[1]);
    expect(result.current.items[1]).toEqual(initialItems[0]);
  });

  it('should validate all items', () => {
    const { result } = renderHook(() =>
      useFormArray({
        name: 'test',
        initialValues: [
          { name: '', value: -1 },
          { name: 'Item 2', value: 20 },
        ],
        schema: testSchema,
      })
    );

    expect(result.current.validateAll()).toBe(false);
    expect(result.current.errors[0]).toBeDefined();
  });

  it('should reset to initial values', () => {
    const { result } = renderHook(() =>
      useFormArray({
        name: 'test',
        initialValues: initialItems,
        schema: testSchema,
      })
    );

    act(() => {
      result.current.addItem({ name: 'Item 3', value: 30 });
      result.current.reset();
    });

    expect(result.current.items).toEqual(initialItems);
    expect(result.current.errors).toEqual({});
  });
}); 