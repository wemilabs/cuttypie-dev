import Image from "next/image";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const Header = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-primary/25 border-b bg-background/90 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label="Primary navigation"
      >
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEItcjH8NfMhVmKxAzk0snGS3pR2rOLb8tZ1UHu"
            alt="cuttypie"
            width={36}
            height={36}
            className="size-9 rounded-md border border-primary/40 transition group-hover:border-primary/70"
          />
          <span className="hidden font-display text-sm font-bold tracking-[0.18em] sm:block">
            LISHAM<span className="text-primary">_</span>
          </span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/about"
            className="rounded px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
          >
            About
          </Link>
          <Link
            href="/blog"
            className="rounded px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
          >
            Blog
          </Link>
          <a
            href="https://x.com/mthlish"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X / Twitter"
            className="flex size-9 items-center justify-center rounded text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
          >
            <Icons.x className="size-4" />
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Header;
