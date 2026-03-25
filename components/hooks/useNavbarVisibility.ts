'use client';

import { usePathname } from 'next/navigation';

export const useNavbarVisibility = (): boolean => {
    const pathname = usePathname();
    
    const isAuthPage = pathname?.startsWith('/login') || 
                       pathname?.startsWith('/signup') || 
                       pathname?.startsWith('/forgotPassword');
    
    return !isAuthPage;
};
