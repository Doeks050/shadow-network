import Link from "next/link";

type GamePageProps = {
  title: string;
  children?: React.ReactNode;
};

export default function GamePage({ title, children }: GamePageProps) {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-md px-6 py-10">
        <Link href="/" className="mb-6 inline-block text-sm text-zinc-400 hover:text-zinc-100">
          ← HOME
        </Link>

        <h1 className="mb-8 text-2xl font-bold tracking-widest">{title}</h1>

        <section className="border border-zinc-800 bg-zinc-900/60 p-5">
          {children}
        </section>
      </div>
    </main>
  );
}
