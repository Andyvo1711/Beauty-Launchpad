export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-ink-800 bg-ink-900 text-ink-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <span className="font-serif text-xl font-bold text-white">
          Beauty Launchpad
        </span>
        <p className="mt-2 max-w-md text-sm text-ink-300">
          A general guide to the nail and beauty industry across the United
          States — trends, pricing, and how to pick a salon you can trust.
        </p>
        <div className="mt-8 border-t border-ink-800 pt-6 text-xs text-ink-400">
          &copy; {year} Beauty Launchpad. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
