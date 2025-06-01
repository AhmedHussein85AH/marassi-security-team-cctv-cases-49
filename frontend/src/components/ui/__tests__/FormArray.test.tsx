import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormArray } from '../FormArray';

describe('FormArray', () => {
  const mockItems = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ];

  const mockErrors = {
    0: 'Error in item 1',
  };

  const mockRenderItem = (item: typeof mockItems[0], index: number) => (
    <div data-testid={`item-${index}`}>{item.name}</div>
  );

  it('should render all items', () => {
    render(
      <FormArray
        items={mockItems}
        errors={mockErrors}
        onAdd={() => {}}
        onRemove={() => {}}
        onUpdate={() => {}}
        renderItem={mockRenderItem}
      />
    );

    expect(screen.getByTestId('item-0')).toBeInTheDocument();
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
  });

  it('should render error messages', () => {
    render(
      <FormArray
        items={mockItems}
        errors={mockErrors}
        onAdd={() => {}}
        onRemove={() => {}}
        onUpdate={() => {}}
        renderItem={mockRenderItem}
      />
    );

    expect(screen.getByText('Error in item 1')).toBeInTheDocument();
  });

  it('should call onAdd when add button is clicked', () => {
    const onAdd = jest.fn();
    render(
      <FormArray
        items={mockItems}
        errors={mockErrors}
        onAdd={onAdd}
        onRemove={() => {}}
        onUpdate={() => {}}
        renderItem={mockRenderItem}
      />
    );

    fireEvent.click(screen.getByText('إضافة عنصر'));
    expect(onAdd).toHaveBeenCalled();
  });

  it('should call onRemove when remove button is clicked', () => {
    const onRemove = jest.fn();
    render(
      <FormArray
        items={mockItems}
        errors={mockErrors}
        onAdd={() => {}}
        onRemove={onRemove}
        onUpdate={() => {}}
        renderItem={mockRenderItem}
      />
    );

    const removeButtons = screen.getAllByTitle('حذف');
    fireEvent.click(removeButtons[0]);
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  it('should render move buttons when onMove is provided', () => {
    render(
      <FormArray
        items={mockItems}
        errors={mockErrors}
        onAdd={() => {}}
        onRemove={() => {}}
        onUpdate={() => {}}
        onMove={() => {}}
        renderItem={mockRenderItem}
      />
    );

    expect(screen.getByTitle('نقل لأعلى')).toBeInTheDocument();
    expect(screen.getByTitle('نقل لأسفل')).toBeInTheDocument();
  });

  it('should call onMove when move buttons are clicked', () => {
    const onMove = jest.fn();
    render(
      <FormArray
        items={mockItems}
        errors={mockErrors}
        onAdd={() => {}}
        onRemove={() => {}}
        onUpdate={() => {}}
        onMove={onMove}
        renderItem={mockRenderItem}
      />
    );

    fireEvent.click(screen.getByTitle('نقل لأعلى'));
    expect(onMove).toHaveBeenCalledWith(0, -1);

    fireEvent.click(screen.getByTitle('نقل لأسفل'));
    expect(onMove).toHaveBeenCalledWith(0, 1);
  });

  it('should not show add button when maxItems is reached', () => {
    render(
      <FormArray
        items={mockItems}
        errors={mockErrors}
        onAdd={() => {}}
        onRemove={() => {}}
        onUpdate={() => {}}
        renderItem={mockRenderItem}
        maxItems={2}
      />
    );

    expect(screen.queryByText('إضافة عنصر')).not.toBeInTheDocument();
  });

  it('should not show remove buttons when minItems is reached', () => {
    render(
      <FormArray
        items={mockItems}
        errors={mockErrors}
        onAdd={() => {}}
        onRemove={() => {}}
        onUpdate={() => {}}
        renderItem={mockRenderItem}
        minItems={2}
      />
    );

    expect(screen.queryByTitle('حذف')).not.toBeInTheDocument();
  });

  it('should render custom labels', () => {
    render(
      <FormArray
        items={mockItems}
        errors={mockErrors}
        onAdd={() => {}}
        onRemove={() => {}}
        onUpdate={() => {}}
        renderItem={mockRenderItem}
        addLabel="إضافة جديد"
        removeLabel="مسح"
      />
    );

    expect(screen.getByText('إضافة جديد')).toBeInTheDocument();
    expect(screen.getAllByTitle('مسح')).toHaveLength(2);
  });

  it('should apply custom className', () => {
    const { container } = render(
      <FormArray
        items={mockItems}
        errors={mockErrors}
        onAdd={() => {}}
        onRemove={() => {}}
        onUpdate={() => {}}
        renderItem={mockRenderItem}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
}); 