import React, { useEffect } from 'react';
import { Form, FormField, FormActions } from '@/components/ui/form';
import { FormArray } from '@/components/ui/FormArray';
import { incidentSchema, attachmentSchema, witnessSchema } from '@/lib/validations/schemas';
import { useIncidents } from '@/hooks/useIncidents';
import { useCameras } from '@/hooks/useCameras';
import { useUsers } from '@/hooks/useUsers';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useFormDependencies } from '@/hooks/useFormDependencies';
import { useFormArray } from '@/hooks/useFormArray';
import { Incident, Attachment, Witness } from '@/types/incident';

interface IncidentFormProps {
  initialValues?: Partial<Incident>;
  onSubmit: (data: Partial<Incident>) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

const severityOptions = [
  { label: 'منخفض', value: 'low' },
  { label: 'متوسط', value: 'medium' },
  { label: 'مرتفع', value: 'high' },
  { label: 'حرج', value: 'critical' },
];

const statusOptions = [
  { label: 'قيد الانتظار', value: 'pending' },
  { label: 'قيد التنفيذ', value: 'in_progress' },
  { label: 'تم الحل', value: 'resolved' },
  { label: 'مغلق', value: 'closed' },
];

export function IncidentForm({
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel = 'حفظ البلاغ',
}: IncidentFormProps) {
  const { cameras } = useCameras();
  const { users } = useUsers();

  const defaultValues: Partial<Incident> = {
    title: '',
    description: '',
    location: '',
    severity: 'low',
    status: 'pending',
    attachments: [],
    witnesses: [],
    ...initialValues,
  };

  const {
    isRestored,
    saveFormData,
    clearFormData,
  } = useFormPersistence({
    formId: 'incident-form',
    initialValues: defaultValues,
    onRestore: (values) => {
      Object.entries(values).forEach(([key, value]) => {
        handleChange(key, value);
      });
    },
  });

  const {
    errors,
    touched,
    validateForm,
    handleChange: validateField,
    handleBlur,
    resetValidation,
  } = useFormValidation({
    schema: incidentSchema,
    initialValues: defaultValues,
  });

  // Define field dependencies
  const dependencyRules = [
    {
      field: 'severity',
      condition: (value) => value === 'critical',
      action: 'validate',
      target: 'description',
      validationRule: (value, severity) => 
        severity === 'critical' ? value.length >= 100 : true,
      errorMessage: 'يجب أن يكون الوصف أكثر تفصيلاً للحوادث الحرجة',
    },
    {
      field: 'status',
      condition: (value) => value === 'in_progress',
      action: 'show',
      target: 'assignedTo',
    },
    {
      field: 'status',
      condition: (value) => value === 'resolved',
      action: 'validate',
      target: 'description',
      validationRule: (value) => value.includes('حل'),
      errorMessage: 'يجب أن يتضمن الوصف تفاصيل الحل',
    },
  ];

  const {
    getFieldState,
    validateDependentField,
    getDependentSchema,
  } = useFormDependencies({
    rules: dependencyRules,
    values: defaultValues,
  });

  // Field array for attachments
  const {
    items: attachments,
    errors: attachmentErrors,
    addItem: addAttachment,
    removeItem: removeAttachment,
    updateItem: updateAttachment,
    validateAll: validateAttachments,
  } = useFormArray<Attachment>({
    name: 'attachments',
    initialValues: defaultValues.attachments || [],
    schema: attachmentSchema,
    maxItems: 5,
  });

  // Field array for witnesses
  const {
    items: witnesses,
    errors: witnessErrors,
    addItem: addWitness,
    removeItem: removeWitness,
    updateItem: updateWitness,
    validateAll: validateWitnesses,
  } = useFormArray<Witness>({
    name: 'witnesses',
    initialValues: defaultValues.witnesses || [],
    schema: witnessSchema,
  });

  // Combine form persistence with validation
  const handleChange = (name: string, value: any) => {
    validateField(name, value);
    const dependentValidation = validateDependentField(name, value);
    if (!dependentValidation.isValid) {
      setErrors((prev) => ({
        ...prev,
        [name]: dependentValidation.error,
      }));
    }
    saveFormData({ ...values, [name]: value });
  };

  const handleSubmit = async (formData: Partial<Incident>) => {
    if (
      validateForm(formData) &&
      validateAttachments() &&
      validateWitnesses()
    ) {
      await onSubmit({
        ...formData,
        attachments,
        witnesses,
      });
      clearFormData();
      resetValidation();
    }
  };

  if (!isRestored) {
    return <div>جاري تحميل النموذج...</div>;
  }

  return (
    <Form
      schema={incidentSchema}
      initialValues={defaultValues}
      onSubmit={handleSubmit}
    >
      {({ values, formState, isSubmitting, reset }) => {
        const descriptionState = getFieldState('description');
        const assignedToState = getFieldState('assignedTo');

        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="العنوان"
                name="title"
                value={values.title}
                onChange={(value) => handleChange('title', value)}
                onBlur={() => handleBlur('title')}
                error={errors.title || formState.errors.title}
                required
                touched={touched.title}
              />

              <FormField
                label="الموقع"
                name="location"
                value={values.location}
                onChange={(value) => handleChange('location', value)}
                onBlur={() => handleBlur('location')}
                error={errors.location || formState.errors.location}
                required
                touched={touched.location}
              />

              <FormField
                label="مستوى الخطورة"
                name="severity"
                type="select"
                value={values.severity}
                onChange={(value) => handleChange('severity', value)}
                onBlur={() => handleBlur('severity')}
                error={errors.severity || formState.errors.severity}
                options={severityOptions}
                required
                touched={touched.severity}
              />

              <FormField
                label="الحالة"
                name="status"
                type="select"
                value={values.status}
                onChange={(value) => handleChange('status', value)}
                onBlur={() => handleBlur('status')}
                error={errors.status || formState.errors.status}
                options={statusOptions}
                required
                touched={touched.status}
              />

              {cameras && cameras.length > 0 && (
                <FormField
                  label="الكاميرا"
                  name="cameraId"
                  type="select"
                  value={values.cameraId}
                  onChange={(value) => handleChange('cameraId', value)}
                  onBlur={() => handleBlur('cameraId')}
                  error={errors.cameraId || formState.errors.cameraId}
                  options={cameras.map(camera => ({
                    label: camera.name,
                    value: camera.id,
                  }))}
                  touched={touched.cameraId}
                />
              )}

              {users && users.length > 0 && assignedToState.isVisible && (
                <FormField
                  label="تعيين إلى"
                  name="assignedTo"
                  type="select"
                  value={values.assignedTo}
                  onChange={(value) => handleChange('assignedTo', Number(value))}
                  onBlur={() => handleBlur('assignedTo')}
                  error={errors.assignedTo || formState.errors.assignedTo}
                  options={users.map(user => ({
                    label: user.name,
                    value: user.id.toString(),
                  }))}
                  touched={touched.assignedTo}
                  disabled={!assignedToState.isEnabled}
                />
              )}
            </div>

            <FormField
              label="الوصف"
              name="description"
              type="textarea"
              value={values.description}
              onChange={(value) => handleChange('description', value)}
              onBlur={() => handleBlur('description')}
              error={errors.description || formState.errors.description}
              required
              touched={touched.description}
              disabled={!descriptionState.isEnabled}
              placeholder={
                values.severity === 'critical'
                  ? 'يرجى تقديم وصف مفصل للحادث (100 حرف على الأقل)'
                  : values.status === 'resolved'
                  ? 'يرجى تضمين تفاصيل الحل في الوصف'
                  : undefined
              }
            />

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">المرفقات</h3>
                <FormArray
                  items={attachments}
                  errors={attachmentErrors}
                  onAdd={() => addAttachment({ name: '', file: null })}
                  onRemove={removeAttachment}
                  onUpdate={updateAttachment}
                  addLabel="إضافة مرفق"
                  maxItems={5}
                  renderItem={(attachment, index) => (
                    <div className="space-y-4">
                      <FormField
                        label="اسم الملف"
                        name={`attachments.${index}.name`}
                        value={attachment.name}
                        onChange={(value) =>
                          updateAttachment(index, { ...attachment, name: value })
                        }
                        required
                      />
                      <FormField
                        label="الملف"
                        name={`attachments.${index}.file`}
                        type="file"
                        value={attachment.file}
                        onChange={(value) =>
                          updateAttachment(index, { ...attachment, file: value })
                        }
                        required
                      />
                    </div>
                  )}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">الشهود</h3>
                <FormArray
                  items={witnesses}
                  errors={witnessErrors}
                  onAdd={() =>
                    addWitness({
                      name: '',
                      contact: '',
                      statement: '',
                    })
                  }
                  onRemove={removeWitness}
                  onUpdate={updateWitness}
                  addLabel="إضافة شاهد"
                  renderItem={(witness, index) => (
                    <div className="space-y-4">
                      <FormField
                        label="اسم الشاهد"
                        name={`witnesses.${index}.name`}
                        value={witness.name}
                        onChange={(value) =>
                          updateWitness(index, { ...witness, name: value })
                        }
                        required
                      />
                      <FormField
                        label="معلومات الاتصال"
                        name={`witnesses.${index}.contact`}
                        value={witness.contact}
                        onChange={(value) =>
                          updateWitness(index, { ...witness, contact: value })
                        }
                        required
                      />
                      <FormField
                        label="البيان"
                        name={`witnesses.${index}.statement`}
                        type="textarea"
                        value={witness.statement}
                        onChange={(value) =>
                          updateWitness(index, { ...witness, statement: value })
                        }
                        required
                      />
                    </div>
                  )}
                />
              </div>
            </div>

            <FormActions
              isSubmitting={isSubmitting}
              onReset={() => {
                reset();
                clearFormData();
                resetValidation();
              }}
              submitLabel={submitLabel}
            />
          </>
        );
      }}
    </Form>
  );
} 