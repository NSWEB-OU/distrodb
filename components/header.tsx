import Link from "next/link";
import { HeaderNav } from "./header-nav";
import { TypographyH4 } from "./text";
import Image from "next/image";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <Image src="/icon-white.svg" alt="DistroDB Logo" width={24} height={24} />
          <div className="flex items-center gap-3.5">
            <TypographyH4>DistroDB</TypographyH4>
          </div>
        </Link>
        <div>
          <HeaderNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
