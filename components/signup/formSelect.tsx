import React from "react";

interface FormSelectProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
}

const FormSelect: React.FC<FormSelectProps> = ({
    id,
    label,
    value,
    onChange,
    options,
}) => {
    return (
        <div>
            <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-200">
                {label}
            </label>
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-cyan-100/30 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/15"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FormSelect;
