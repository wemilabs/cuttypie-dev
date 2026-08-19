import { cacheLife } from "next/cache";
import Link from "next/link";
import { Icons } from "@/components/icons";

async function getCurrentYear() {
  "use cache";
  cacheLife("max");
  return new Date().getFullYear();
}

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
] as const;

export async function Footer() {
  const year = await getCurrentYear();
  return (
    <footer className="relative overflow-hidden border-primary/30 border-t bg-card/80">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent" />
      <div className="grid-surface absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-widest"
          >
            LISHAM<span className="text-primary">_</span>
          </Link>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Full-stack developer and tech blogger building thoughtful digital
            systems.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href="https://github.com/wemilabs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex size-9 items-center justify-center rounded border border-primary/25 text-muted-foreground transition hover:border-primary/60 hover:text-primary"
            >
              <Icons.github className="size-4" />
            </a>
            <a
              href="https://x.com/mthlish"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="flex size-9 items-center justify-center rounded border border-primary/25 text-muted-foreground transition hover:border-primary/60 hover:text-primary"
            >
              <Icons.x className="size-4" />
            </a>
          </div>
        </div>
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-primary/20 border-t px-6 py-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        System online · © {year} lisham_
      </div>
    </footer>
  );
}
