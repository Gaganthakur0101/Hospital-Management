import React from 'react';

type PageProps = {
    params: {
        id: string;
    };
};

const Page = async ({ params }: PageProps) => {
    const { id } = params;
    return (
        <main className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-slate-950 px-4 py-14 sm:px-8">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />
            </div>

            <section className="relative mx-auto w-full max-w-4xl rounded-3xl border border-white/15 bg-white/8 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Profile Space</p>
                <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Your personal dashboard</h1>
                <p className="mt-4 text-slate-200">
                    This profile page is loaded using your route parameter.
                </p>
                <div className="mt-6 rounded-xl border border-cyan-100/25 bg-slate-900/40 px-4 py-3 text-slate-100">
                    Profile ID: <span className="font-semibold text-cyan-100">{id}</span>
                </div>
            </section>
        </main>
    );
}

export default Page;
