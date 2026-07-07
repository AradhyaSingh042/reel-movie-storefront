import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-marquee text-ink font-semibold hover:brightness-110 active:brightness-95',
  ghost:
    'bg-transparent border border-line text-text hover:border-muted',
  danger: 'bg-transparent border border-danger text-danger hover:bg-danger/10',
};

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
