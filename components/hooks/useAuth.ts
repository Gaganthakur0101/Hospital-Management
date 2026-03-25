'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'doctor' | 'patient';
}

export const useAuth = () => {
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await fetch('/api/users/me', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                setUser(null);
            }
        };

        checkUser();
    }, [pathname]);

    return { user, setUser };
};
