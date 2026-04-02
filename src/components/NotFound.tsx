import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-400 mb-4">
          404
        </p>

        <h1 className="text-4xl sm:text-5xl font-semibold mb-4">
          Page not found
        </h1>

        <p className="text-white/70 text-base mb-8">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-medium transition hover:bg-white/20"
        >
          Go to homepage
        </Link>
      </div>
    </main>
  );
}