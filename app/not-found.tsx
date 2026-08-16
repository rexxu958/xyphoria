import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-6xl font-bold text-gradient">404</p>
      <h1 className="mt-4 font-display text-xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-text-muted">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
      >
        Back to Home
      </Link>
    </div>
  );
}
