import Link from "next/link";

export default function Header() {
  return (
    <header className="relative mx-auto flex w-full shrink-0 items-center justify-center py-6">
      <Link href="/" className="text-xl font-bold text-purple-400">
        AI App Builder
      </Link>
    </header>
  );
}
