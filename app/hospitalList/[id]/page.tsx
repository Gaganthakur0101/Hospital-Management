import React from 'react';

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

const Page = async ({ params }: PageProps) => {
    const { id } = await params;
    return (
        <main className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-slate-950 px-4 py-14 sm:px-8">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-12 top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute right-0 top-1/2 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
            </div>

            <section className="relative mx-auto w-full max-w-4xl rounded-3xl border border-white/15 bg-white/8 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Hospital Details</p>
                <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Hospital profile</h1>
                <p className="mt-4 text-slate-200">
                    You are viewing details for the selected hospital route.
                </p>
                <div className="mt-6 rounded-xl border border-cyan-100/25 bg-slate-900/40 px-4 py-3 text-slate-100">
                    Hospital ID: <span className="font-semibold text-cyan-100">{id}</span>
                </div>
            </section>
        </main>
    );
}

export default Page;
