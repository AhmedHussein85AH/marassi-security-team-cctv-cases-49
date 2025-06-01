import React from 'react';
import { Form, FormField, FormActions } from '@/components/ui/form';
import { reportDateRangeSchema, reportScheduleSchema } from '@/lib/validations/schemas';

interface ReportFormProps {
  type: 'incident' | 'camera' | 'maintenance' | 'performance';
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isScheduled?: boolean;
}

const frequencyOptions = [
  { label: 'يومي', value: 'daily' },
  { label: 'أسبوعي', value: 'weekly' },
  { label: 'شهري', value: 'monthly' },
];

const dayOptions = [
  { label: 'السبت', value: 'saturday' },
  { label: 'الأحد', value: 'sunday' },
  { label: 'الاثنين', value: 'monday' },
  { label: 'الثلاثاء', value: 'tuesday' },
  { label: 'الأربعاء', value: 'wednesday' },
  { label: 'الخميس', value: 'thursday' },
  { label: 'الجمعة', value: 'friday' },
];

const reportTypeLabels = {
  incident: 'تقرير الحوادث',
  camera: 'تقرير الكاميرات',
  maintenance: 'تقرير الصيانة',
  performance: 'تقرير الأداء',
};

export function ReportForm({
  type,
  onSubmit,
  onCancel,
  submitLabel = 'إنشاء التقرير',
  isScheduled = false,
}: ReportFormProps) {
  const schema = isScheduled ? reportScheduleSchema : reportDateRangeSchema;

  const defaultValues = isScheduled
    ? {
        frequency: 'daily',
        time: '09:00',
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        recipients: [],
      }
    : {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        filters: {},
      };

  return (
    <Form
      schema={schema}
      initialValues={defaultValues}
      onSubmit={onSubmit}
    >
      {({ values, formState, isSubmitting, handleChange, reset }) => (
        <>
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">{reportTypeLabels[type]}</h2>

            {isScheduled ? (
              <>
                <FormField
                  label="تكرار التقرير"
                  name="frequency"
                  type="select"
                  value={values.frequency}
                  onChange={(value) => handleChange('frequency', value)}
                  error={formState.errors.frequency}
                  options={frequencyOptions}
                  required
                />

                <FormField
                  label="وقت التقرير"
                  name="time"
                  type="time"
                  value={values.time}
                  onChange={(value) => handleChange('time', value)}
                  error={formState.errors.time}
                  required
                />

                {values.frequency === 'weekly' && (
                  <FormField
                    label="أيام الأسبوع"
                    name="days"
                    type="select"
                    value={values.days}
                    onChange={(value) => handleChange('days', value)}
                    error={formState.errors.days}
                    options={dayOptions}
                    required
                    multiple
                  />
                )}

                <FormField
                  label="البريد الإلكتروني للمستلمين"
                  name="recipients"
                  type="email"
                  value={values.recipients}
                  onChange={(value) => handleChange('recipients', value.split(',').map(e => e.trim()))}
                  error={formState.errors.recipients}
                  placeholder="أدخل عناوين البريد الإلكتروني مفصولة بفواصل"
                  required
                />
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="تاريخ البداية"
                    name="startDate"
                    type="date"
                    value={values.startDate}
                    onChange={(value) => handleChange('startDate', value)}
                    error={formState.errors.startDate}
                    required
                  />

                  <FormField
                    label="تاريخ النهاية"
                    name="endDate"
                    type="date"
                    value={values.endDate}
                    onChange={(value) => handleChange('endDate', value)}
                    error={formState.errors.endDate}
                    required
                  />
                </div>

                <FormField
                  label="خيارات التصفية"
                  name="filters"
                  type="textarea"
                  value={JSON.stringify(values.filters, null, 2)}
                  onChange={(value) => {
                    try {
                      const parsed = JSON.parse(value);
                      handleChange('filters', parsed);
                    } catch (e) {
                      // Invalid JSON, keep the string value
                      handleChange('filters', value);
                    }
                  }}
                  error={formState.errors.filters}
                  placeholder="أدخل خيارات التصفية بتنسيق JSON"
                />
              </>
            )}
          </div>

          <FormActions
            isSubmitting={isSubmitting}
            onReset={onCancel || reset}
            submitLabel={submitLabel}
          />
        </>
      )}
    </Form>
  );
} 