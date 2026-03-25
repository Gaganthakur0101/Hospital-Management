import Link from 'next/link';
import Image from 'next/image';
import Logo from "../../assets/Gemini_Generated_Image_853s5w853s5w853s.png";

interface NavLogoProps {
    userId?: string;
}

export const NavLogo = ({ userId }: NavLogoProps) => {
    return (
        <div className="shrink-0 flex items-center">
            <Link href={userId ? `/profile/${userId}` : "/"} className="flex items-center space-x-2">
                <Image 
                    src={Logo} 
                    alt="Hospital Management Logo" 
                    width={40} 
                    height={40}
                    className="rounded-lg"
                />
                <span className="hidden text-xl font-extrabold text-cyan-200 sm:block">
                    MediCare
                </span>
            </Link>
        </div>
    );
};
