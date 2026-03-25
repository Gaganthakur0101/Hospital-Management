'use client';

import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useNavbarVisibility } from './hooks/useNavbarVisibility';
import { NavLogo } from './navbar/NavLogo';
import { NavLinks } from './navbar/NavLinks';
import { RegisterDropdown } from './navbar/RegisterDropdown';
import { NotificationButton } from './navbar/NotificationButton';
import { ProfileMenu } from './navbar/ProfileMenu';
import { AuthButtons } from './navbar/AuthButtons';
import { MobileMenuButton } from './navbar/MobileMenuButton';
import { MobileMenu } from './navbar/MobileMenu';

const Navbar = () => {
    const { user, setUser } = useAuth();
    const isVisible = useNavbarVisibility();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (!isVisible) {
        return null;
    }

    const handleLogout = () => {
        setUser(null);
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 shadow-[0_10px_35px_rgba(6,182,212,0.12)] backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <NavLogo userId={user?.id} />
                    
                    <NavLinks user={user} />

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                {user.role === 'doctor' && <RegisterDropdown />}
                                <NotificationButton userId={user.id} />
                                <ProfileMenu user={user} onLogout={handleLogout} />
                            </>
                        ) : (
                            <AuthButtons />
                        )}

                        <MobileMenuButton 
                            isOpen={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        />
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <MobileMenu 
                        user={user} 
                        onClose={() => setIsMobileMenuOpen(false)} 
                    />
                )}
            </div>
        </nav>
    );
};

export default Navbar;

    