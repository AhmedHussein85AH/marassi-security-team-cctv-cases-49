import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReportForm } from '../ReportForm';
import { useReports } from '@/hooks/useReports';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';

// Mock the hooks
jest.mock('@/hooks/useReports');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
      <ToastContainer />
    </QueryClientProvider>
  );
};

describe('ReportForm Integration', () => {
  beforeEach(() => {
    (useReports as jest.Mock).mockReturnValue({
      generateReport: jest.fn(),
      isLoading: false,
      error: null,
    });
  });

  it('should generate an incident report', async () => {
    const mockGenerateReport = jest.fn().mockResolvedValue({ id: 1 });
    (useReports as jest.Mock).mockReturnValue({
      generateReport: mockGenerateReport,
      isLoading: false,
      error: null,
    });

    renderWithProviders(
      <ReportForm
        onSubmit={async () => {}}
      />
    );

    // Fill form
    fireEvent.change(screen.getByLabelText('نوع التقرير'), {
      target: { value: 'incidents' },
    });
    fireEvent.change(screen.getByLabelText('الفترة الزمنية'), {
      target: { value: 'daily' },
    });
    fireEvent.change(screen.getByLabelText('التنسيق'), {
      target: { value: 'pdf' },
    });

    // Submit form
    fireEvent.click(screen.getByText('إنشاء التقرير'));

    await waitFor(() => {
      expect(mockGenerateReport).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'incidents',
          period: 'daily',
          format: 'pdf',
        })
      );
    });
  });

  it('should generate a camera report', async () => {
    const mockGenerateReport = jest.fn().mockResolvedValue({ id: 1 });
    (useReports as jest.Mock).mockReturnValue({
      generateReport: mockGenerateReport,
      isLoading: false,
      error: null,
    });

    renderWithProviders(
      <ReportForm
        onSubmit={async () => {}}
      />
    );

    // Fill form
    fireEvent.change(screen.getByLabelText('نوع التقرير'), {
      target: { value: 'cameras' },
    });
    fireEvent.change(screen.getByLabelText('الفترة الزمنية'), {
      target: { value: 'weekly' },
    });
    fireEvent.change(screen.getByLabelText('التنسيق'), {
      target: { value: 'excel' },
    });

    // Submit form
    fireEvent.click(screen.getByText('إنشاء التقرير'));

    await waitFor(() => {
      expect(mockGenerateReport).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'cameras',
          period: 'weekly',
          format: 'excel',
        })
      );
    });
  });

  it('should handle API errors', async () => {
    const mockError = new Error('API Error');
    (useReports as jest.Mock).mockReturnValue({
      generateReport: jest.fn().mockRejectedValue(mockError),
      isLoading: false,
      error: mockError,
    });

    renderWithProviders(
      <ReportForm
        onSubmit={async () => {}}
      />
    );

    // Fill form
    fireEvent.change(screen.getByLabelText('نوع التقرير'), {
      target: { value: 'incidents' },
    });
    fireEvent.change(screen.getByLabelText('الفترة الزمنية'), {
      target: { value: 'daily' },
    });
    fireEvent.change(screen.getByLabelText('التنسيق'), {
      target: { value: 'pdf' },
    });

    // Submit form
    fireEvent.click(screen.getByText('إنشاء التقرير'));

    await waitFor(() => {
      expect(screen.getByText('حدث خطأ أثناء إنشاء التقرير')).toBeInTheDocument();
    });
  });

  it('should handle loading state', async () => {
    (useReports as jest.Mock).mockReturnValue({
      generateReport: jest.fn(),
      isLoading: true,
      error: null,
    });

    renderWithProviders(
      <ReportForm
        onSubmit={async () => {}}
      />
    );

    // Fill form
    fireEvent.change(screen.getByLabelText('نوع التقرير'), {
      target: { value: 'incidents' },
    });
    fireEvent.change(screen.getByLabelText('الفترة الزمنية'), {
      target: { value: 'daily' },
    });
    fireEvent.change(screen.getByLabelText('التنسيق'), {
      target: { value: 'pdf' },
    });

    // Submit form
    fireEvent.click(screen.getByText('إنشاء التقرير'));

    expect(screen.getByText('جاري إنشاء التقرير...')).toBeInTheDocument();
  });

  it('should handle custom date range', async () => {
    const mockGenerateReport = jest.fn().mockResolvedValue({ id: 1 });
    (useReports as jest.Mock).mockReturnValue({
      generateReport: mockGenerateReport,
      isLoading: false,
      error: null,
    });

    renderWithProviders(
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

    // Fill other required fields
    fireEvent.change(screen.getByLabelText('نوع التقرير'), {
      target: { value: 'incidents' },
    });
    fireEvent.change(screen.getByLabelText('التنسيق'), {
      target: { value: 'pdf' },
    });

    // Submit form
    fireEvent.click(screen.getByText('إنشاء التقرير'));

    await waitFor(() => {
      expect(mockGenerateReport).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'incidents',
          period: 'custom',
          startDate: '2024-03-01',
          endDate: '2024-03-20',
          format: 'pdf',
        })
      );
    });
  });

  it('should handle filters', async () => {
    const mockGenerateReport = jest.fn().mockResolvedValue({ id: 1 });
    (useReports as jest.Mock).mockReturnValue({
      generateReport: mockGenerateReport,
      isLoading: false,
      error: null,
    });

    renderWithProviders(
      <ReportForm
        onSubmit={async () => {}}
      />
    );

    // Fill form
    fireEvent.change(screen.getByLabelText('نوع التقرير'), {
      target: { value: 'incidents' },
    });
    fireEvent.change(screen.getByLabelText('الفترة الزمنية'), {
      target: { value: 'daily' },
    });
    fireEvent.change(screen.getByLabelText('التنسيق'), {
      target: { value: 'pdf' },
    });

    // Add filter
    fireEvent.click(screen.getByText('إضافة فلتر'));
    fireEvent.change(screen.getByLabelText('نوع الفلتر'), {
      target: { value: 'severity' },
    });
    fireEvent.change(screen.getByLabelText('القيمة'), {
      target: { value: 'critical' },
    });

    // Submit form
    fireEvent.click(screen.getByText('إنشاء التقرير'));

    await waitFor(() => {
      expect(mockGenerateReport).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'incidents',
          period: 'daily',
          format: 'pdf',
          filters: expect.arrayContaining([
            expect.objectContaining({
              type: 'severity',
              value: 'critical',
            }),
          ]),
        })
      );
    });
  });

  it('should handle multiple filters', async () => {
    const mockGenerateReport = jest.fn().mockResolvedValue({ id: 1 });
    (useReports as jest.Mock).mockReturnValue({
      generateReport: mockGenerateReport,
      isLoading: false,
      error: null,
    });

    renderWithProviders(
      <ReportForm
        onSubmit={async () => {}}
      />
    );

    // Fill form
    fireEvent.change(screen.getByLabelText('نوع التقرير'), {
      target: { value: 'incidents' },
    });
    fireEvent.change(screen.getByLabelText('الفترة الزمنية'), {
      target: { value: 'daily' },
    });
    fireEvent.change(screen.getByLabelText('التنسيق'), {
      target: { value: 'pdf' },
    });

    // Add first filter
    fireEvent.click(screen.getByText('إضافة فلتر'));
    fireEvent.change(screen.getByLabelText('نوع الفلتر'), {
      target: { value: 'severity' },
    });
    fireEvent.change(screen.getByLabelText('القيمة'), {
      target: { value: 'critical' },
    });

    // Add second filter
    fireEvent.click(screen.getByText('إضافة فلتر'));
    fireEvent.change(screen.getByLabelText('نوع الفلتر'), {
      target: { value: 'status' },
    });
    fireEvent.change(screen.getByLabelText('القيمة'), {
      target: { value: 'resolved' },
    });

    // Submit form
    fireEvent.click(screen.getByText('إنشاء التقرير'));

    await waitFor(() => {
      expect(mockGenerateReport).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'incidents',
          period: 'daily',
          format: 'pdf',
          filters: expect.arrayContaining([
            expect.objectContaining({
              type: 'severity',
              value: 'critical',
            }),
            expect.objectContaining({
              type: 'status',
              value: 'resolved',
            }),
          ]),
        })
      );
    });
  });
}); 