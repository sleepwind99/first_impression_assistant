import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/icons/logo.svg?url";

const HeaderLogo = () => {
  return (
    <Link
      href="/"
      className="h-full flex flex-col justify-center grow-0 shrink-0"
    >
      <div className="flex items-center justify-start gap-4">
        <Image
          src={Logo}
          alt="logo"
          className="w-[132px] h-[23px] md:w-[213px] md:h-[37px]"
        />
        <h1 className="text-base md:text-2xl font-[600] xl:font-[500] text-[#767575]">
          채팅 AI초진시스템
        </h1>
      </div>
    </Link>
  );
};

export default HeaderLogo;
