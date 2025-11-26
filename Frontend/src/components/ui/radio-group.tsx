import React, { createContext, useContext, useId } from 'react';
import { cn } from '@/lib/utils';

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({
    className,
    children,
    value,
    defaultValue,
    onValueChange,
    name,
    ...props
  }, ref) => {
    const fallbackName = useId();
    const currentValue = value ?? defaultValue;

    return (
      <RadioGroupContext.Provider
        value={{ name: name ?? fallbackName, value: currentValue, onValueChange }}
      >
        <div
          ref={ref}
          role="radiogroup"
          className={cn('grid gap-2', className)}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = 'RadioGroup';

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, onChange, name, ...props }, ref) => {
    const context = useContext(RadioGroupContext);
    const checked = context ? context.value === value : props.checked;

    return (
      <input
        ref={ref}
        type="radio"
        name={context?.name ?? name}
        value={value}
        checked={checked}
        onChange={(event) => {
          context?.onValueChange?.(value);
          onChange?.(event);
        }}
        className={cn(
          'h-4 w-4 shrink-0 rounded-full border border-primary text-primary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);
RadioGroupItem.displayName = 'RadioGroupItem';

