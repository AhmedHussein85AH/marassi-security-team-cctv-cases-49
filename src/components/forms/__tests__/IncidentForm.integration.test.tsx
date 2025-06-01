import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IncidentForm } from '../IncidentForm';
import { useIncidents } from '@/hooks/useIncidents';
import { useCameras } from '@/hooks/useCameras';
import { useUsers } from '@/hooks/useUsers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';

// Mock the hooks
jest.mock('@/hooks/useIncidents');
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

describe('IncidentForm Integration', () => {
  beforeEach(() => {
    (useCameras as jest.Mock).mockReturnValue({ cameras: mockCameras });
    (useUsers as jest.Mock).mockReturnValue({ users: mockUsers });
    (useIncidents as jest.Mock).mockReturnValue({
      createIncident: jest.fn(),
      updateIncident: jest.fn(),
      isLoading: false,
      error: null,
    });
  });

  it('should create a new incident', async () => {
    const mockCreateIncident = jest.fn().mockResolvedValue({ id: 1 });
    (useIncidents as jest.Mock).mockReturnValue({
      createIncident: mockCreateIncident,
      isLoading: false,
      error: null,
    });

    renderWithProviders(
      <IncidentForm
        onSubmit={async () => {}}
      />
    );

    // Fill form
    fireEvent.change(screen.getByLabelText('العنوان'), {
      target: { value: 'Test Incident' },
    });
    fireEvent.change(screen.getByLabelText('الموقع'), {
      target: { value: 'Test Location' },
    });
    fireEvent.change(screen.getByLabelText('الوصف'), {
      target: { value: 'Test Description' },
    });

    // Submit form
    fireEvent.click(screen.getByText('حفظ البلاغ'));

    await waitFor(() => {
      expect(mockCreateIncident).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Incident',
          location: 'Test Location',
          description: 'Test Description',
        })
      );
    });
  });

  it('should update an existing incident', async () => {
    const mockUpdateIncident = jest.fn().mockResolvedValue({ id: 1 });
    (useIncidents as jest.Mock).mockReturnValue({
      updateIncident: mockUpdateIncident,
      isLoading: false,
      error: null,
    });

    const existingIncident = {
      id: 1,
      title: 'Existing Incident',
      location: 'Existing Location',
      description: 'Existing Description',
    };

    renderWithProviders(
      <IncidentForm
        initialData={existingIncident}
        onSubmit={async () => {}}
      />
    );

    // Update form
    fireEvent.change(screen.getByLabelText('العنوان'), {
      target: { value: 'Updated Incident' },
    });

    // Submit form
    fireEvent.click(screen.getByText('حفظ البلاغ'));

    await waitFor(() => {
      expect(mockUpdateIncident).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          title: 'Updated Incident',
          location: 'Existing Location',
          description: 'Existing Description',
        })
      );
    });
  });

  it('should handle API errors', async () => {
    const mockError = new Error('API Error');
    (useIncidents as jest.Mock).mockReturnValue({
      createIncident: jest.fn().mockRejectedValue(mockError),
      isLoading: false,
      error: mockError,
    });

    renderWithProviders(
      <IncidentForm
        onSubmit={async () => {}}
      />
    );

    // Fill form
    fireEvent.change(screen.getByLabelText('العنوان'), {
      target: { value: 'Test Incident' },
    });
    fireEvent.change(screen.getByLabelText('الموقع'), {
      target: { value: 'Test Location' },
    });
    fireEvent.change(screen.getByLabelText('الوصف'), {
      target: { value: 'Test Description' },
    });

    // Submit form
    fireEvent.click(screen.getByText('حفظ البلاغ'));

    await waitFor(() => {
      expect(screen.getByText('حدث خطأ أثناء حفظ البلاغ')).toBeInTheDocument();
    });
  });

  it('should handle loading state', async () => {
    (useIncidents as jest.Mock).mockReturnValue({
      createIncident: jest.fn(),
      isLoading: true,
      error: null,
    });

    renderWithProviders(
      <IncidentForm
        onSubmit={async () => {}}
      />
    );

    // Fill form
    fireEvent.change(screen.getByLabelText('العنوان'), {
      target: { value: 'Test Incident' },
    });
    fireEvent.change(screen.getByLabelText('الموقع'), {
      target: { value: 'Test Location' },
    });
    fireEvent.change(screen.getByLabelText('الوصف'), {
      target: { value: 'Test Description' },
    });

    // Submit form
    fireEvent.click(screen.getByText('حفظ البلاغ'));

    expect(screen.getByText('جاري الحفظ...')).toBeInTheDocument();
  });

  it('should handle file upload', async () => {
    const mockCreateIncident = jest.fn().mockResolvedValue({ id: 1 });
    (useIncidents as jest.Mock).mockReturnValue({
      createIncident: mockCreateIncident,
      isLoading: false,
      error: null,
    });

    renderWithProviders(
      <IncidentForm
        onSubmit={async () => {}}
      />
    );

    // Add attachment
    fireEvent.click(screen.getByText('إضافة مرفق'));

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText('الملف');
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.change(screen.getByLabelText('اسم الملف'), {
      target: { value: 'Test File' },
    });

    // Fill required fields
    fireEvent.change(screen.getByLabelText('العنوان'), {
      target: { value: 'Test Incident' },
    });
    fireEvent.change(screen.getByLabelText('الموقع'), {
      target: { value: 'Test Location' },
    });
    fireEvent.change(screen.getByLabelText('الوصف'), {
      target: { value: 'Test Description' },
    });

    // Submit form
    fireEvent.click(screen.getByText('حفظ البلاغ'));

    await waitFor(() => {
      expect(mockCreateIncident).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Incident',
          location: 'Test Location',
          description: 'Test Description',
          attachments: expect.arrayContaining([
            expect.objectContaining({
              name: 'Test File',
              file: expect.any(File),
            }),
          ]),
        })
      );
    });
  });

  it('should handle witness statements', async () => {
    const mockCreateIncident = jest.fn().mockResolvedValue({ id: 1 });
    (useIncidents as jest.Mock).mockReturnValue({
      createIncident: mockCreateIncident,
      isLoading: false,
      error: null,
    });

    renderWithProviders(
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

    // Fill required fields
    fireEvent.change(screen.getByLabelText('العنوان'), {
      target: { value: 'Test Incident' },
    });
    fireEvent.change(screen.getByLabelText('الموقع'), {
      target: { value: 'Test Location' },
    });
    fireEvent.change(screen.getByLabelText('الوصف'), {
      target: { value: 'Test Description' },
    });

    // Submit form
    fireEvent.click(screen.getByText('حفظ البلاغ'));

    await waitFor(() => {
      expect(mockCreateIncident).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Incident',
          location: 'Test Location',
          description: 'Test Description',
          witnesses: expect.arrayContaining([
            expect.objectContaining({
              name: 'Test Witness',
              contact: 'test@example.com',
              statement: 'Test Statement',
            }),
          ]),
        })
      );
    });
  });
}); 