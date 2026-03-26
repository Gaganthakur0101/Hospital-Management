import React from "react";

interface AuthCardProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, children }) => {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/8 p-7 shadow-2xl backdrop-blur-xl sm:p-10">
                <div className="mb-4">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
                        {subtitle}
                    </p>

                    <h1 className="text-3xl font-black tracking-tight text-white">
                        {title}
                    </h1>
                </div>

                {children}
            </div>
        </div>
    );
};

export default AuthCard;
