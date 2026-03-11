"use client"

import React from 'react';
import toast from 'react-hot-toast';

const Page = () => {

    const [userEmail, setUserEmail] = React.useState("");
    const [otp, setOtp] = React.useState("");
    const [showOtp, setShowOtp] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const inputClass =
        "w-full rounded-xl border border-cyan-100/30 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/15";

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/users/forgotPassword', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: userEmail }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Something went wrong with API");
            } else {
                toast.success("OTP sent to your email");
                setShowOtp(true);
            }

        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (!otp) {
            toast.error("Please enter OTP");
            return;
        }

        try {
            const res = await fetch('/api/users/verifyOtp', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: userEmail, otp }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Invalid OTP");
            } else {
                toast.success("OTP Verified Successfully");
            }

        } catch {
            toast.error("Verification failed");
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-20 top-8 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute right-0 top-1/2 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/8 p-8 shadow-2xl backdrop-blur-xl sm:p-10">

                <div className="mb-6">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
                        Password Recovery
                    </p>

                    <h1 className="text-3xl font-black tracking-tight text-white">
                        Enter your email
                    </h1>
                </div>

                <form className="space-y-5" onSubmit={onSubmit}>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-slate-200"
                        >
                            Email address
                        </label>

                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            className={inputClass}
                            disabled={showOtp}
                            required
                        />
                    </div>

                    {!showOtp && (
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full rounded-xl bg-cyan-400 py-3 font-bold text-slate-950 transition-all duration-200 hover:scale-[1.01] hover:bg-cyan-300 disabled:opacity-70"
                        >
                            {loading ? "Sending..." : "Continue"}
                        </button>
                    )}

                    {showOtp && (
                        <>
                            <div>
                                <label
                                    htmlFor="otp"
                                    className="mb-2 block text-sm font-medium text-slate-200"
                                >
                                    Enter OTP
                                </label>

                                <input
                                    type="text"
                                    id="otp"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className={inputClass}
                                    required
                                />
                            </div>

                            <button
                                type="button"
                                onClick={verifyOtp}
                                className="mt-2 w-full rounded-xl bg-emerald-400 py-3 font-bold text-slate-950 transition-all duration-200 hover:scale-[1.01] hover:bg-emerald-300"
                            >
                                Verify OTP
                            </button>
                        </>
                    )}

                </form>

            </div>
        </div>
    );
}

export default Page;