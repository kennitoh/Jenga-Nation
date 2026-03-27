import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/utils';

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    options?: SelectOption[];
    placeholder?: string;
    onChange?: (value: string) => void;
    children?: React.ReactNode;
}

// Simple Select implementation wrapping native select for now, 
// but styled to match the design system
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, options, placeholder, onChange, value, children, ...props }, ref) => {
        return (
            <div className="relative">
                <select
                    className={cn(
                        "flex h-12 w-full appearance-none items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800020] disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    ref={ref}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    {...props}
                >
                    {placeholder && <option value="" disabled>{placeholder}</option>}
                    {options ? (
                        options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))
                    ) : (
                        children
                    )}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
            </div>
        );
    }
);
Select.displayName = "Select";

// Helper components for compatibility with Radix-like API if needed later
export const SelectTrigger = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={className}>{children}</div>;
export const SelectValue = ({ placeholder }: { placeholder: string }) => <span>{placeholder}</span>;
export const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SelectItem = ({ value, children }: { value: string, children: React.ReactNode }) => <option value={value}>{children}</option>;

export { Select };
