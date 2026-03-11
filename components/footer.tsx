import Link from "next/link";

const Footer = () => {
	return (
		<footer className="border-t border-white/10 bg-slate-950/90 px-4 py-8">
			<div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">MediCare</p>
					<p className="mt-1 text-sm text-slate-300">Smarter appointments, better healthcare journeys.</p>
				</div>

				<div className="flex items-center gap-5 text-sm text-slate-300">
					<Link href="/" className="transition-colors hover:text-cyan-200">Home</Link>
					<Link href="/hospitalList" className="transition-colors hover:text-cyan-200">Hospitals</Link>
					<Link href="/login" className="transition-colors hover:text-cyan-200">Login</Link>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
