"use client"
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


const Page = () => {

  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    password: ""
  })

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(user),
      })
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
      } else {
        toast.success(data.message);
        if (data?.user) {          
          router.push(`/profile/${data.user.id}`);
        }
      }
    } catch {
      toast.error("Something went wrong")
    }

  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-8 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/8 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="mb-5">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
            Secure sign in
          </p>

          <h1 className="text-3xl font-black tracking-tight text-white">
            Welcome back
          </h1>
        </div>

        <form className="space-y-4" onSubmit={onLogin}>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full rounded-xl border border-cyan-100/30 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/15"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full rounded-xl border border-cyan-100/30 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/15"
            />
          </div>

          <div className="flex items-center justify-between pt-1 text-sm">
            <a href="/forgotPassword" className="font-semibold text-cyan-200 transition-colors hover:text-cyan-100 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-cyan-400 py-3 font-bold text-slate-950 transition-all duration-200 hover:scale-[1.01] hover:bg-cyan-300"
          >
            Sign in
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-300">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="font-semibold text-cyan-200 transition-colors hover:text-cyan-100 hover:underline">
            Sign up for free
          </a>
        </p>
      </div>
    </div>
  );
};

export default Page;