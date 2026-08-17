import Image from "next/image";
import Link from "next/link";

import { Icons } from "@/components/icons";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-md border-b border-border">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex gap-2 items-center">
          <Image
            src={
              "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEItcjH8NfMhVmKxAzk0snGS3pR2rOLb8tZ1UHu"
            }
            alt="cuttypie"
            width={36}
            height={36}
            className="rounded-md"
          />
          <h1 className="font-bold">
            lisham
            <span className="text-brand text-xl font-extrabold">_</span>
          </h1>
        </Link>
        <div className="flex gap-6 text-sm font-semibold items-center">
          <Link
            href="/about"
            className="hover:text-muted-foreground transition"
          >
            About
          </Link>
          <Link href="/blog" className="hover:text-muted-foreground transition">
            Blog
          </Link>
          <a
            href="https://x.com/mthlish"
            className="hover:text-muted-foreground transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icons.x />
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Header;
