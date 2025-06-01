import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IncidentForm } from '../IncidentForm';
import { useCameras } from '@/hooks/useCameras';
import { useUsers } from '@/hooks/useUsers';

// Mock the hooks
jest.mock('@/hooks/useCameras');
jest.mock('@/hooks/useUsers');

const mockCameras = [
  { id: 1, name: 'Camera 1' },
  { id: 2, name: 'Camera 2' },
];

const mockUsers = [
  { id: 1, name: 'User 1' },
  { id: 2, name: 'User 2' },
];

describe('IncidentForm', () => {
  beforeEach(() => {
    (useCameras as jest.Mock).mockReturnValue({ cameras: mockCameras });
    (useUsers as jest.Mock).mockReturnValue({ users: mockUsers });
  });

  it('should render all form fields', () => {
    render(
      <IncidentForm
        onSubmit={async () => {}}
      />
    );

    expect(screen.getByLabelText('العنوان')).toBeInTheDocument();
    expect(screen.getByLabelText('الموقع')).toBeInTheDocument();
    expect(screen.getByLabelText('مستوى الخطورة')).toBeInTheDocument();
    expect(screen.getByLabelText('الحالة')).toBeInTheDocument();
    expect(screen.getByLabelText('الكاميرا')).toBeInTheDocument();
    expect(screen.getByLabelText('الوصف')).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    const onSubmit = jest.fn();
    render(
      <IncidentForm
        onSubmit={onSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText('العنوان'), {
      target: { value: 'Test Incident' },
    });
    fireEvent.change(screen.getByLabelText('الموقع'), {
      target: { value: 'Test Location' },
    });
    fireEvent.change(screen.getByLabelText('الوصف'), {
      target: { value: 'Test Description' },
    });

    fireEvent.click(screen.getByText('حفظ البلاغ'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Incident',
          location: 'Test Location',
          description: 'Test Description',
        })
      );
    });
  });

  it('should show validation errors', async () => {
    render(
      <IncidentForm
        onSubmit={async () => {}}
      />
    );

    fireEvent.click(screen.getByText('حفظ البلاغ'));

    await waitFor(() => {
      expect(screen.getByText('العنوان مطلوب')).toBeInTheDocument();
      expect(screen.getByText('الموقع مطلوب')).toBeInTheDocument();
      expect(screen.getByText('الوصف مطلوب')).toBeInTheDocument();
    });
  });

  it('should handle attachments', async () => {
    render(
      <IncidentForm
        onSubmit={async () => {}}
      />
    );

    // Add attachment
    fireEvent.click(screen.getByText('إضافة مرفق'));

    const fileInput = screen.getByLabelText('الملف');
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.change(screen.getByLabelText('اسم الملف'), {
      target: { value: 'Test File' },
    });

    expect(screen.getByText('Test File')).toBeInTheDocument();
  });

  it('should handle witness statements', async () => {
    render(
      <IncidentForm
        onSubmit={async () => {}}
      />
    );

    // Add witness
    fireEvent.click(screen.getByText('إضافة شاهد'));

    fireEvent.change(screen.getByLabelText('اسم الشاهد'), {
      target: { value: 'Test Witness' },
    });
    fireEvent.change(screen.getByLabelText('معلومات الاتصال'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('البيان'), {
      target: { value: 'Test Statement' },
    });

    expect(screen.getByText('Test Witness')).toBeInTheDocument();
  });

  it('should show critical incident validation', async () => {
    render(
      <IncidentForm
        onSubmit={async () => {}}
      />
    );

    // Set severity to critical
    fireEvent.change(screen.getByLabelText('مستوى الخطورة'), {
      target: { value: 'critical' },
    });

    // Add short description
    fireEvent.change(screen.getByLabelText('الوصف'), {
      target: { value: 'Short' },
    });

    fireEvent.click(screen.getByText('حفظ البلاغ'));

    await waitFor(() => {
      expect(screen.getByText('يجب أن يكون الوصف أكثر تفصيلاً للحوادث الحرجة')).toBeInTheDocument();
    });
  });

  it('should show resolved incident validation', async () => {
    render(
      <IncidentForm
        onSubmit={async () => {}}
      />
    );

    // Set status to resolved
    fireEvent.change(screen.getByLabelText('الحالة'), {
      target: { value: 'resolved' },
    });

    // Add description without solution
    fireEvent.change(screen.getByLabelText('الوصف'), {
      target: { value: 'Test Description' },
    });

    fireEvent.click(screen.getByText('حفظ البلاغ'));

    await waitFor(() => {
      expect(screen.getByText('يجب أن يتضمن الوصف تفاصيل الحل')).toBeInTheDocument();
    });
  });

  it('should show assignment field when status is in progress', async () => {
    render(
      <IncidentForm
        onSubmit={async () => {}}
      />
    );

    // Set status to in progress
    fireEvent.change(screen.getByLabelText('الحالة'), {
      target: { value: 'in_progress' },
    });

    expect(screen.getByLabelText('تعيين إلى')).toBeInTheDocument();
  });

  it('should handle form reset', async () => {
    render(
      <IncidentForm
        onSubmit={async () => {}}
      />
    );

    // Fill form
    fireEvent.change(screen.getByLabelText('العنوان'), {
      target: { value: 'Test Incident' },
    });

    // Add attachment
    fireEvent.click(screen.getByText('إضافة مرفق'));
    fireEvent.change(screen.getByLabelText('اسم الملف'), {
      target: { value: 'Test File' },
    });

    // Reset form
    fireEvent.click(screen.getByText('إعادة تعيين'));

    await waitFor(() => {
      expect(screen.getByLabelText('العنوان')).toHaveValue('');
      expect(screen.queryByText('Test File')).not.toBeInTheDocument();
    });
  });
}); 