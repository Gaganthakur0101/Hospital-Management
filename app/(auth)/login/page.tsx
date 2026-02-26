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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 animate-slide-up">

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-500 mb-2">
            Please enter your details
          </p>

          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Welcome back
          </h1>
        </div>

        <form className="space-y-3" onSubmit={onLogin}>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 text-gray-900"
            />
          </div>

          <div className="flex items-center justify-between text-sm pt-1">
            <a href="/forgotPassword" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-3"
          >
            Sign in
          </button>

        </form>

        <p className="text-sm text-center text-gray-600 mt-8">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
            Sign up for free
          </a>
        </p>

      </div>
    </div>
  );
};

export default Page;