import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  icon: Icon,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 tracking-wide flex items-center justify-between font-sans">
          <span>
            {label} {required && <span className="text-terracotta-500">*</span>}
          </span>
          {helperText && !error && (
            <span className="text-[11px] font-normal text-stone-500 dark:text-stone-400">{helperText}</span>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-stone-500 dark:text-stone-400 pointer-events-none flex items-center">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full text-xs sm:text-sm rounded-xl px-3.5 py-2.5 bg-white dark:bg-ink-900 border text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 transition-all font-sans focus:outline-none focus:ring-2 focus:ring-terracotta-500/25 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } ${isPassword ? 'pr-10' : 'pr-3.5'} ${
            error
              ? 'border-rose-500 focus:border-rose-500'
              : 'border-stone-300 dark:border-ink-700 focus:border-terracotta-500'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 focus:outline-none transition-colors cursor-pointer"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
    </div>
  );
};

export default Input;
