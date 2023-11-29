import { AiForm } from "@/components/first-visit/aiForm";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-between py-14 md:py-24 px-4 bg-[#F2F6FA]">
      <p className="z-1 w-full mt-5 text-xs md:text-base md:leading-5 text-[#777] font-[300] text-center md:mt-4">
        {`성명에는 가명(김모씨 등)을 써도 괜찮습니다. `}
        <br />
        {`통증 정도는 0(약)부터 10(강)까지로 기입해 주시기 바랍니다.`}
        <br />
        {`날짜, 위치, 갯수 등의 정보는 숫자로 표현해주시기 바랍니다. `}
      </p>
      <AiForm />
    </main>
  );
}
