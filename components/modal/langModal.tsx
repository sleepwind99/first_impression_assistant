"use client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { LangList } from "@/lang/lang";
import generateRandomId from "@/utils/idGenerator";

export function LangModal() {
  const router = useRouter();
  const path = usePathname();
  return (
    <div
      className={`absolute top-13 right-0 w-40 rounded-lg bg-white shadow-2xl`}
    >
      <div className="bg-[#00387F] text-white text-xl rounded-t-2xl p-2 text-center">
        Language
      </div>
      <div className="flex flex-col gap-2 p-2">
        {LangList.map((lang) => (
          <div
            key={generateRandomId(15)}
            className="cursor-pointer md:text-xl px-3 py-2 rounded-xl border-[#B2C7DA] border-[1px] bg-white text-center"
            onClick={() => {
              router.push(`${path}?lang=${lang.value}`);
              setTimeout(() => window.location.reload(), 100);
            }}
          >
            {lang.label}
          </div>
        ))}
      </div>
    </div>
  );
}
