import Link from 'next/link';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'doctor' | 'patient';
}

interface MobileMenuProps {
    user: User | null;
    onClose: () => void;
}

export const MobileMenu = ({ user, onClose }: MobileMenuProps) => {
    return (
        <div className="border-t border-white/10 bg-slate-900/95 md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                    href={user ? `/profile/${user.id}` : "/"}
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-100 transition-colors hover:bg-white/10"
                    onClick={onClose}
                >
                    Home
                </Link>
                <Link
                    href="/hospitalList"
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-100 transition-colors hover:bg-white/10"
                    onClick={onClose}
                >
                    Hospitals List
                </Link>
                
                {user && (
                    <>
                        <Link
                            href="/hospitals/popular"
                            className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-100 transition-colors hover:bg-white/10"
                            onClick={onClose}
                        >
                            Popular Hospitals
                        </Link>
                        <Link
                            href="/about"
                            className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-100 transition-colors hover:bg-white/10"
                            onClick={onClose}
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-100 transition-colors hover:bg-white/10"
                            onClick={onClose}
                        >
                            Contact
                        </Link>
                        <Link
                            href="/appointments"
                            className="block rounded-lg border border-cyan-200/30 bg-cyan-400/10 px-3 py-2 text-base font-semibold text-cyan-100 transition-colors hover:bg-cyan-300/20"
                            onClick={onClose}
                        >
                            Notifications
                        </Link>
                    </>
                )}
                
                {user && user.role === 'doctor' && (
                    <div className="space-y-1 pt-1">
                        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-emerald-300">Doctor Tools</p>
                        <Link
                            href="/doctors/manage-hospitals"
                            className="block rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-base font-semibold text-cyan-100 transition-colors hover:bg-cyan-300/20"
                            onClick={onClose}
                        >
                            My Hospitals
                        </Link>
                        <Link
                            href="/register/registerHospital"
                            className="block rounded-lg bg-emerald-400 px-3 py-2 text-base font-bold text-slate-950 transition-colors hover:bg-emerald-300"
                            onClick={onClose}
                        >
                            Register your hospital
                        </Link>
                        <Link
                            href="/signup"
                            className="block rounded-lg border border-cyan-200/40 px-3 py-2 text-base font-semibold text-cyan-100 transition-colors hover:bg-cyan-300/10"
                            onClick={onClose}
                        >
                            Register as a Doctor
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
