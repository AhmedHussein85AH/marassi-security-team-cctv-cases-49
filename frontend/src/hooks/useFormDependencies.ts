import { useCallback, useMemo } from 'react';
import { z } from 'zod';

type DependencyRule = {
  field: string;
  condition: (value: any) => boolean;
  action: 'show' | 'hide' | 'enable' | 'disable' | 'validate';
  target: string;
  validationRule?: (value: any, dependentValue: any) => boolean;
  errorMessage?: string;
};

interface UseFormDependenciesOptions {
  rules: DependencyRule[];
  values: Record<string, any>;
}

export function useFormDependencies({ rules, values }: UseFormDependenciesOptions) {
  const evaluateRules = useCallback(
    (fieldName: string) => {
      return rules
        .filter((rule) => rule.target === fieldName)
        .map((rule) => {
          const dependentValue = values[rule.field];
          const isConditionMet = rule.condition(dependentValue);
          return {
            ...rule,
            isActive: isConditionMet,
          };
        });
    },
    [rules, values]
  );

  const getFieldState = useCallback(
    (fieldName: string) => {
      const fieldRules = evaluateRules(fieldName);
      const isVisible = fieldRules.every(
        (rule) => rule.action !== 'hide' || !rule.isActive
      );
      const isEnabled = fieldRules.every(
        (rule) => rule.action !== 'disable' || !rule.isActive
      );
      const validationRules = fieldRules.filter(
        (rule) => rule.action === 'validate' && rule.isActive
      );

      return {
        isVisible,
        isEnabled,
        validationRules,
      };
    },
    [evaluateRules]
  );

  const validateDependentField = useCallback(
    (fieldName: string, value: any) => {
      const fieldRules = evaluateRules(fieldName);
      const validationRules = fieldRules.filter(
        (rule) => rule.action === 'validate' && rule.isActive
      );

      for (const rule of validationRules) {
        const dependentValue = values[rule.field];
        if (rule.validationRule && !rule.validationRule(value, dependentValue)) {
          return {
            isValid: false,
            error: rule.errorMessage,
          };
        }
      }

      return { isValid: true };
    },
    [evaluateRules, values]
  );

  const getDependentSchema = useCallback(
    (fieldName: string, baseSchema: z.ZodTypeAny) => {
      const fieldRules = evaluateRules(fieldName);
      const validationRules = fieldRules.filter(
        (rule) => rule.action === 'validate' && rule.isActive
      );

      if (validationRules.length === 0) {
        return baseSchema;
      }

      return baseSchema.refine(
        (value) => {
          for (const rule of validationRules) {
            const dependentValue = values[rule.field];
            if (rule.validationRule && !rule.validationRule(value, dependentValue)) {
              return false;
            }
          }
          return true;
        },
        {
          message: validationRules[0].errorMessage || 'قيمة غير صالحة',
        }
      );
    },
    [evaluateRules, values]
  );

  return {
    getFieldState,
    validateDependentField,
    getDependentSchema,
  };
} 