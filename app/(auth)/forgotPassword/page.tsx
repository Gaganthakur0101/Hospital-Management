"use client"

import React from 'react';
import toast from 'react-hot-toast';

const Page = () => {

    const [userEmail, setUserEmail] = React.useState("");
    const [otp, setOtp] = React.useState("");
    const [showOtp, setShowOtp] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const inputClass =
        "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 text-gray-900";

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">

                <div className="mb-6">
                    <p className="text-sm font-medium text-gray-500 mb-2">
                        Password Recovery
                    </p>

                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Enter your email
                    </h1>
                </div>

                <form className="space-y-5" onSubmit={onSubmit}>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2"
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
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-2 disabled:opacity-70"
                        >
                            {loading ? "Sending..." : "Continue"}
                        </button>
                    )}

                    {showOtp && (
                        <>
                            <div>
                                <label
                                    htmlFor="otp"
                                    className="block text-sm font-medium text-gray-700 mb-2"
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
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg mt-2"
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