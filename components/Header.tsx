import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-rose-200 bg-rose-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            Beauty Launchpad
          </span>
          <span className="hidden text-xs font-medium uppercase tracking-widest text-rose-600 sm:inline">
            Nail & Beauty, USA
          </span>
        </Link>
        <a
          href="#salon-tips"
          className="whitespace-nowrap rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
        >
          Salon Safety Tips
        </a>
      </div>
    </header>
  );
}
