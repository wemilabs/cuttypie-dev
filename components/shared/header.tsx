import Link from "next/link";
import Image from "next/image";

import XformerlyTwitter from "@/components/icons/x";
import Avatar from "@/public/avatar.webp";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
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
            matheo
            <span className="text-yellow-200 text-xl font-extrabold">.</span>
          </h1>
        </Link>
        <div className="flex gap-6 text-sm font-semibold">
          <Link href="/about" className="hover:text-white/70 transition">
            About
          </Link>
          <Link href="/blog" className="hover:text-white/70 transition">
            Blog
          </Link>
          <a
            href="https://x.com/DorianTho5"
            className="hover:text-white/70 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <XformerlyTwitter />
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
