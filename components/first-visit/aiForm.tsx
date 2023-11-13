"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { BsFillArrowRightSquareFill } from "react-icons/bs";
import { FaUserDoctor } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import PuffLoader from "react-spinners/PuffLoader";
import { coverteReport } from "@/utils/coverte-report";
import { Report } from "@/models/report";

const loaderCss: React.CSSProperties = {
  position: "absolute",
  top: 0,
  right: 0,
};

export const AiForm = () => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat();
  const formRef = useRef<HTMLFormElement>(null);
  const [isResult, setIsResult] = useState(false);
  const [report, setReport] = useState<Report>();
  const router = useRouter();
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        id: new Date().getTime().toString(),
        content: "어디가 불편해서 방문하신건가요?",
      },
    ]);
  }, []);
  useEffect(() => {
    if (isLoading) return;
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return;
    if (lastMessage.role !== "assistant") return;
    if (lastMessage.content.includes("# 결과 보고서 #")) {
      const rawReport = lastMessage.content.split("# 결과 보고서 #")[1];
      const tempReport = coverteReport(rawReport);
      setReport(tempReport);
      setIsResult(true);
      localStorage.setItem("report", JSON.stringify(tempReport));
    }
  }, [isLoading]);
  return (
    <div className="max-w-[768px] w-full">
      <div className="flex flex-col h-[70vh] py-4">
        {messages.map((chat, index) => (
          <div
            key={`${index}_${new Date().getTime()}`}
            className={`${index === messages.length - 1 ? "pb-32" : ""}`}
          >
            {chat.role === "assistant" && (
              <div className="flex items-center justify-start">
                <FaUserDoctor className="w-5 h-5 text-yellow-400 mr-2" />
                <span>AI 문진 도우미</span>
              </div>
            )}
            <div
              className={`rounded-lg p-2 my-1 w-fit max-w-[600px] ${
                chat.role === "user"
                  ? "bg-gray-400 text-left ml-auto"
                  : "bg-blue-300 text-left mr-auto"
              }`}
            >
              {chat.content}
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 flex items-center w-full justify-center pb-10 bg-white">
        <div className="max-w-[768px] w-full flex mt-5 mx-2">
          {isResult ? (
            <div className="flex gap-2 w-full">
              <div
                onClick={() => router.refresh()}
                className="px-auto w-full py-2 rounded-lg bg-yellow-400 text-white cursor-pointer text-center"
              >
                새로 고침
              </div>
              <div
                onClick={() => router.push("/result")}
                className="px-auto w-full py-2 rounded-lg border border-yellow-400 text-yellow-400 cursor-pointer text-center"
              >
                결과 보기
              </div>
            </div>
          ) : (
            <form
              className="relative w-full"
              onSubmit={(e) => !isLoading && handleSubmit(e)}
              ref={formRef}
            >
              <input
                value={input}
                className="border border-gray-400 rounded-lg outline-none px-4 py-2 w-full"
                onChange={handleInputChange}
                placeholder={
                  isLoading
                    ? "문진을 생성중입니다. 잠시 기다려주세요."
                    : "문진에 대한 답변을 입력해주세요."
                }
              />
              {!isLoading && (
                <BsFillArrowRightSquareFill
                  onClick={(e: FormEvent) =>
                    handleSubmit(e as FormEvent<HTMLFormElement>)
                  }
                  className={`absolute top-0 right-0 w-8 h-8 pt-2 pr-2 cursor-pointer ${
                    input === "" ? "text-gray-300" : "text-yellow-400"
                  }`}
                />
              )}
              {isLoading && (
                <PuffLoader
                  loading={isLoading}
                  cssOverride={loaderCss}
                  size={40}
                  color="#FACC14"
                />
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
