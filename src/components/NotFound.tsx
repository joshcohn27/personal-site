import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function NotFound() {
    return (
        <div className="site-shell">
            <Header />

            <main className="relative overflow-hidden">
                <section className="relative mx-auto flex min-h-[75vh] w-full max-w-7xl items-center justify-center px-6 py-24 sm:px-8 lg:px-12">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
                        <div className="absolute bottom-10 left-10 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
                        <div className="absolute right-10 top-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
                    </div>

                    <div className="relative w-full max-w-3xl">
                        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-12">
                            <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
                                404 Error
                            </div>

                            <h1 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
                                Page not found
                            </h1>

                            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
                                The page you were trying to reach does not exist, may have been moved,
                                or has not been created yet.
                            </p>

                            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Link
                                    to="/"
                                    className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:-translate-y-0.5 hover:bg-white/90"
                                >
                                    Back to home
                                </Link>

                                <a
                                    href="http://joshbcohn.com/#projects"
                                    className="inline-flex min-w-[180px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                                >
                                    View projects
                                </a>
                            </div>

                            <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/45">
                                joshbcohn.com
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}