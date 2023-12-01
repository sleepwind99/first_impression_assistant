"use client";
import { useState } from "react";
import Image from "next/image";
import Menu from "@/public/icons/menu.svg?url";
import { LangModal } from "@/components/modal/langModal";
import { LangList } from "@/lang/lang";
import { useRouter, usePathname } from "next/navigation";
import generateRandomId from "@/utils/idGenerator";

export function MenuIcon() {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const [onMenu, setOnMenu] = useState(false);
  const router = useRouter();
  const path = usePathname();
  return isMobile ? (
    <select className="outline-none border-[1px] border-[#777] pr-5 pl-2 py-1 rounded-lg">
      {LangList.map((lang) => (
        <option
          key={generateRandomId(15)}
          value={lang.value}
          onClick={() => {
            router.push(`${path}?lang=${lang.value}`);
            setTimeout(() => window.location.reload(), 100);
          }}
        >
          {lang.label}
        </option>
      ))}
    </select>
  ) : (
    <div className="relative">
      <Image
        onClick={() => setOnMenu(!onMenu)}
        src={Menu}
        alt="menu"
        className="h-6 w-6 md:h-11 md:w-11 cursor-pointer"
      />
      {onMenu && <LangModal />}
    </div>
  );
}
