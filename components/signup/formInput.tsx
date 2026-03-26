import React from "react";

interface FormInputProps {
    id: string;
    label: string;
    type: "text" | "email" | "password";
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}

const FormInput: React.FC<FormInputProps> = ({
    id,
    label,
    type,
    placeholder,
    value,
    onChange,
}) => {
    return (
        <div>
            <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-200">
                {label}
            </label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-cyan-100/30 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/15"
            />
        </div>
    );
};

export default FormInput;
