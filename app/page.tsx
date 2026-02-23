'use client';

import React,{useEffect } from 'react';
import {useRouter} from 'next/navigation';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      router.push(`/profile/${user.id}`);
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <h1 className="text-4xl font-bold text-gray-800">Welcome to Our Home Page</h1>
    </div>
  );
}

export default Page;