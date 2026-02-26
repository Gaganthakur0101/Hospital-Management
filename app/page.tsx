'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user?.id) {
            router.push(`/profile/${user.id}`);
          }
        } catch (error) {
          console.error('Failed to parse user data:', error);
        }
      }
    }
  }, [router]);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
        <h1 className="text-4xl font-bold text-gray-800">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <h1 className="text-4xl font-bold text-gray-800">Welcome to Our Home Page</h1>
    </div>
  );
}

export default Page;