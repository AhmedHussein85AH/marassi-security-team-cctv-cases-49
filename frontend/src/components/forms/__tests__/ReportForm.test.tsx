import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReportForm } from '../ReportForm';

describe('ReportForm', () => {
  it('should render all form fields', () => {
    render(
      <ReportForm
        onSubmit={async () => {}}
      />
    );

    expect(screen.getByLabelText('نوع التقرير')).toBeInTheDocument();
    expect(screen.getByLabelText('الفترة الزمنية')).toBeInTheDocument();
    expect(screen.getByLabelText('التنسيق')).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    const onSubmit = jest.fn();
    render(
      <ReportForm
        onSubmit={onSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText('نوع التقرير'), {
      target: { value: 'incidents' },
    });
    fireEvent.change(screen.getByLabelText('الفترة الزمنية'), {
      target: { value: 'daily' },
    });
    fireEvent.change(screen.getByLabelText('التنسيق'), {
      target: { value: 'pdf' },
    });

    fireEvent.click(screen.getByText('إنشاء التقرير'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'incidents',
          period: 'daily',
          format: 'pdf',
        })
      );
    });
  });

  it('should show validation errors', async () => {
    render(
      <ReportForm
        onSubmit={async () => {}}
      />
    );

    fireEvent.click(screen.getByText('إنشاء التقرير'));

    await waitFor(() => {
      expect(screen.getByText('نوع التقرير مطلوب')).toBeInTheDocument();
      expect(screen.getByText('الفترة الزمنية مطلوبة')).toBeInTheDocument();
      expect(screen.getByText('التنسيق مطلوب')).toBeInTheDocument();
    });
  });

  it('should handle custom date range', async () => {
    render(
      <ReportForm
        onSubmit={async () => {}}
      />
    );

    // Select custom period
    fireEvent.change(screen.getByLabelText('الفترة الزمنية'), {
      target: { value: 'custom' },
    });

    // Fill date range
    fireEvent.change(screen.getByLabelText('تاريخ البدء'), {
      target: { value: '2024-03-01' },
    });
    fireEvent.change(screen.getByLabelText('تاريخ الانتهاء'), {
      target: { value: '2024-03-20' },
    });

    fireEvent.click(screen.getByText('إنشاء التقرير'));

    await waitFor(() => {
      expect(screen.getByText('يجب تحديد نطاق تاريخ صالح')).toBeInTheDocument();
    });
  });

  it('should handle incident report filters', async () => {
    render(
      <ReportForm
        onSubmit={async () => {}}
      />
    );

    // Select incident report type
    fireEvent.change(screen.getByLabelText('نوع التقرير'), {
      target: { value: 'incidents' },
    });

    // Add severity filter
    fireEvent.click(screen.getByText('إضافة فلتر'));
    fireEvent.change(screen.getByLabelText('نوع الفلتر'), {
      target: { value: 'severity' },
    });
    fireEvent.change(screen.getByLabelText('القيمة'), {
      target: { value: 'critical' },
    });

    expect(screen.getByText('حرج')).toBeInTheDocument();
  });

  it('should handle camera report filters', async () => {
    render(
      <ReportForm
        onSubmit={async () => {}}
      />
    );

    // Select camera report type
    fireEvent.change(screen.getByLabelText('نوع التقرير'), {
      target: { value: 'cameras' },
    });

    // Add status filter
    fireEvent.click(screen.getByText('إضافة فلتر'));
    fireEvent.change(screen.getByLabelText('نوع الفلتر'), {
      target: { value: 'status' },
    });
    fireEvent.change(screen.getByLabelText('القيمة'), {
      target: { value: 'active' },
    });

    expect(screen.getByText('نشط')).toBeInTheDocument();
  });

  it('should handle maintenance report filters', async () => {
    render(
      <ReportForm
        onSubmit={async () => {}}
      />
    );

    // Select maintenance report type
    fireEvent.change(screen.getByLabelText('نوع التقرير'), {
      target: { value: 'maintenance' },
    });

    // Add maintenance type filter
    fireEvent.click(screen.getByText('إضافة فلتر'));
    fireEvent.change(screen.getByLabelText('نوع الفلتر'), {
      target: { value: 'maintenanceType' },
    });
    fireEvent.change(screen.getByLabelText('القيمة'), {
      target: { value: 'preventive' },
    });

    expect(screen.getByText('وقائي')).toBeInTheDocument();
  });

  it('should handle form reset', async () => {
    render(
      <ReportForm
        onSubmit={async () => {}}
      />
    );

    // Fill form
    fireEvent.change(screen.getByLabelText('نوع التقرير'), {
      target: { value: 'incidents' },
    });

    // Add filter
    fireEvent.click(screen.getByText('إضافة فلتر'));
    fireEvent.change(screen.getByLabelText('نوع الفلتر'), {
      target: { value: 'severity' },
    });
    fireEvent.change(screen.getByLabelText('القيمة'), {
      target: { value: 'critical' },
    });

    // Reset form
    fireEvent.click(screen.getByText('إعادة تعيين'));

    await waitFor(() => {
      expect(screen.getByLabelText('نوع التقرير')).toHaveValue('');
      expect(screen.queryByText('حرج')).not.toBeInTheDocument();
    });
  });

  it('should validate date range', async () => {
    render(
      <ReportForm
        onSubmit={async () => {}}
      />
    );

    // Select custom period
    fireEvent.change(screen.getByLabelText('الفترة الزمنية'), {
      target: { value: 'custom' },
    });

    // Set invalid date range
    fireEvent.change(screen.getByLabelText('تاريخ البدء'), {
      target: { value: '2024-03-20' },
    });
    fireEvent.change(screen.getByLabelText('تاريخ الانتهاء'), {
      target: { value: '2024-03-01' },
    });

    fireEvent.click(screen.getByText('إنشاء التقرير'));

    await waitFor(() => {
      expect(screen.getByText('تاريخ البدء يجب أن يكون قبل تاريخ الانتهاء')).toBeInTheDocument();
    });
  });

  it('should handle export format changes', async () => {
    render(
      <ReportForm
        onSubmit={async () => {}}
      />
    );

    // Select Excel format
    fireEvent.change(screen.getByLabelText('التنسيق'), {
      target: { value: 'excel' },
    });

    // Add multiple filters
    fireEvent.click(screen.getByText('إضافة فلتر'));
    fireEvent.change(screen.getByLabelText('نوع الفلتر'), {
      target: { value: 'severity' },
    });
    fireEvent.change(screen.getByLabelText('القيمة'), {
      target: { value: 'critical' },
    });

    fireEvent.click(screen.getByText('إضافة فلتر'));
    fireEvent.change(screen.getByLabelText('نوع الفلتر'), {
      target: { value: 'status' },
    });
    fireEvent.change(screen.getByLabelText('القيمة'), {
      target: { value: 'resolved' },
    });

    fireEvent.click(screen.getByText('إنشاء التقرير'));

    await waitFor(() => {
      expect(screen.getByText('يمكن إضافة 3 فلاتر كحد أقصى')).toBeInTheDocument();
    });
  });
}); 