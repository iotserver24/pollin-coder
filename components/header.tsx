import Link from "next/link";

export default function Header() {
  return (
    <header className="relative mx-auto flex w-full shrink-0 items-center justify-between px-4 py-6">
      <Link href="/" className="text-xl font-bold text-purple-400">
        AI App Builder
      </Link>
      <nav className="flex items-center gap-6">
        <Link 
          href="/projects" 
          className="text-sm text-gray-300 hover:text-purple-400 transition-colors"
        >
          Projects Gallery
        </Link>
      </nav>
    </header>
  );
}
