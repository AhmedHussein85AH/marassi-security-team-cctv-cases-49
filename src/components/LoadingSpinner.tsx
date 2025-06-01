import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'white';
  className?: string;
  fullScreen?: boolean;
  text?: string;
}

export function LoadingSpinner({
  size = 'md',
  variant = 'default',
  className,
  fullScreen = false,
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const variantClasses = {
    default: 'text-slate-600 dark:text-slate-400',
    primary: 'text-primary',
    white: 'text-white',
  };

  const spinner = (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <Loader2
        className={cn(
          'animate-spin',
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
      {text && (
        <p className={cn(
          'mt-2 text-sm',
          variant === 'white' ? 'text-white' : 'text-slate-600 dark:text-slate-400'
        )}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
} 