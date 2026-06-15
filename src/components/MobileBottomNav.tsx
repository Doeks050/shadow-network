"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  icon: string;
  match: (pathname: string) => boolean;
};

const navItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: "⌂",
    match: (pathname) => pathname === "/",
  },
  {
    label: "Loadout",
    href: "/loadout",
    icon: "▰",
    match: (pathname) => pathname.startsWith("/loadout"),
  },
  {
    label: "Stash",
    href: "/stash",
    icon: "▣",
    match: (pathname) => pathname.startsWith("/stash"),
  },
  {
    label: "Market",
    href: "/market",
    icon: "⇄",
    match: (pathname) => pathname.startsWith("/market"),
  },
  {
    label: "Raid",
    href: "/raid",
    icon: "⌖",
    match: (pathname) => pathname.startsWith("/raid"),
  },
  {
    label: "More",
    href: "/",
    icon: "•••",
    match: () => false,
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-800 bg-black/95 backdrop-blur">
      <div className="grid grid-cols-6">
        {navItems.map((item) => {
          const active = item.match(pathname);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex min-h-[70px] flex-col items-center justify-center gap-1 border-r border-zinc-900 px-1 text-center last:border-r-0 ${
                active
                  ? "bg-lime-950/25 text-lime-400 shadow-[inset_0_2px_0_rgba(132,204,22,0.7)]"
                  : "text-zinc-500 active:bg-zinc-900"
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
