import HeaderLogo from "@/components/header/header-logo";
import Image from "next/image";
import Menu from "@/public/icons/menu.svg?url";

export function Header() {
  return (
    <header className="z-10 fixed w-screen bg-white top-0 h-[70px] md:h-[100px]">
      <div className="px-3 w-full md:px-9 h-full gap-12 shadow-sm">
        <div className="flex flex-row justify-between w-full h-full max-w-[1400px] items-center mx-auto">
          <HeaderLogo />
          <Image src={Menu} alt="menu" className="h-6 w-6 md:h-11 md:w-11" />
        </div>
      </div>
    </header>
  );
}
