import Link from "next/link";
import type { ReactNode } from "react";

type GamePageProps = {
  title: string;
  children: ReactNode;
};

export default function GamePage({ title, children }: GamePageProps) {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-6">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wider">{title}</h1>
            <p className="text-sm text-zinc-500">SHADOW NETWORK</p>
          </div>

          <Link
            href="/"
            className="rounded border border-zinc-700 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
          >
            Main Menu
          </Link>
        </header>

        {children}
      </div>
    </main>
  );
}
