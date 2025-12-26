import { type ReactNode } from 'react';
export interface DropdownOption<T extends string> {
    value: T;
    label: string;
}
export interface DropdownProps<T extends string> {
    options: DropdownOption<T>[];
    value: T;
    onChange: (value: T) => void;
    icon?: ReactNode;
    className?: string;
    triggerClassName?: string;
    menuClassName?: string;
    optionClassName?: string;
}
/**
 * Reusable Dropdown component with outside click and keyboard handling
 */
export declare function Dropdown<T extends string>({ options, value, onChange, icon, className, triggerClassName, menuClassName, optionClassName, }: DropdownProps<T>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Dropdown.d.ts.map