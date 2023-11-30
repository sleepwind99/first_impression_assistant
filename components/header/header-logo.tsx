"use client";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/icons/logo.svg?url";
import { Lang } from "@/lang/lang";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const HeaderLogo = () => {
  const param = useSearchParams();
  const [lang, setLang] = useState<keyof typeof Lang>("ko");
  useEffect(() => {
    const lang = (param.get("lang") as keyof typeof Lang) ?? "ko";
    setLang(lang);
  }, []);
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
          {Lang[lang].logo}
        </h1>
      </div>
    </Link>
  );
};

export default HeaderLogo;
