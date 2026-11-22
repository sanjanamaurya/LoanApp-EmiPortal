import React from 'react';
import { Input, InputProps } from './Input';
import { formatCurrency } from '../../utils/format';

export interface NumberFieldProps extends Omit<InputProps, 'type' | 'onChange' | 'value'> {
  value?: number;
  onChange?: (val: number) => void;
  showCurrencyHelper?: boolean;
}

export const NumberField = React.forwardRef<HTMLInputElement, NumberFieldProps>(
  ({ value, onChange, showCurrencyHelper = true, onBlur, ...props }, ref) => {
    // Allows empty/intermediate typing
    const [textValue, setTextValue] = React.useState<string>(
      value !== undefined && !isNaN(value) ? String(value) : ''
    );

    React.useEffect(() => {
      setTextValue(value !== undefined && !isNaN(value) ? String(value) : '');
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Disallow exponential 'e', '+', '-'
      const raw = e.target.value.replace(/[^0-9]/g, '');
      setTextValue(raw);

      if (raw === '') {
        onChange?.(0);
      } else {
        const num = parseInt(raw, 10);
        if (!isNaN(num)) {
          onChange?.(num);
        }
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (['e', 'E', '+', '-'].includes(e.key)) {
        e.preventDefault();
      }
    };

    const numVal = parseInt(textValue, 10);
    const helperText =
      showCurrencyHelper && !isNaN(numVal) && numVal > 0 ? `${formatCurrency(numVal)}` : undefined;

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={textValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        hint={helperText || props.hint}
        onBlur={(e) => {
          if (textValue === '' || isNaN(numVal)) {
            setTextValue('0');
            onChange?.(0);
          }
          onBlur?.(e);
        }}
        {...props}
      />
    );
  }
);

NumberField.displayName = 'NumberField';
