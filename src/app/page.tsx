import Link from "next/link";

const menuItems = [
  { label: "RAID", href: "/raid" },
  { label: "STASH", href: "/stash" },
  { label: "MARKET", href: "/market" },
  { label: "FOB", href: "/fob" },
  { label: "MISSIONS", href: "/missions" },
  { label: "LEADERBOARD", href: "/leaderboard" },
  { label: "PROFILE", href: "/profile" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-md px-6 py-10">
        <h1 className="mb-8 text-center text-3xl font-bold tracking-widest">
          SHADOW NETWORK
        </h1>

        <section className="mb-8 border border-zinc-800 bg-zinc-900/60 p-5">
          <p>PMC: Rookie</p>
          <p>Level: 1</p>
          <p>Cash: $1,000</p>
          <p>Income/hr: $0</p>
        </section>

        <nav className="grid gap-3">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border border-zinc-800 bg-zinc-900 px-4 py-3 text-center font-semibold tracking-wider transition hover:border-zinc-500 hover:bg-zinc-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}