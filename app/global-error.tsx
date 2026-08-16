"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-background text-text">
        <div className="mx-auto max-w-md px-6 text-center">
          <p className="font-display text-6xl font-bold text-gradient">500</p>
          <h1 className="mt-4 font-display text-xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-sm text-text-muted">{error.message || "An unexpected error occurred."}</p>
          <button
            onClick={reset}
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
