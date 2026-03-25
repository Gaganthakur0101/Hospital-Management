import Link from 'next/link';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'doctor' | 'patient';
}

interface NavLinksProps {
    user: User | null;
}

export const NavLinks = ({ user }: NavLinksProps) => {
    return (
        <div className="hidden md:flex space-x-8 items-center">
            <Link 
                href={user ? `/profile/${user.id}` : "/"} 
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-white/10 hover:text-cyan-200"
            >
                Home
            </Link>
            <Link 
                href="/hospitalList" 
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-white/10 hover:text-cyan-200"
            >
                Hospitals List
            </Link>
            
            {user && (
                <>
                    <Link 
                        href="/doctors" 
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-white/10 hover:text-cyan-200"
                    >
                        Doctors List
                    </Link>
                    <Link 
                        href="/nearbyHospitals" 
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-white/10 hover:text-cyan-200"
                    >
                        Near Hospitals
                    </Link>
                    <Link 
                        href="/appointments" 
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-white/10 hover:text-cyan-200"
                    >
                        Appointments
                    </Link>
                </>
            )}
        </div>
    );
};
