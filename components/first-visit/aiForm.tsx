"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import React from "react";
import { useChat } from "ai/react";
import { useRouter } from "next/navigation";
import PuffLoader from "react-spinners/PuffLoader";
import { coverteReport } from "@/utils/coverte-report";
import Yonsei from "@/public/icons/yonsei.svg?url";
import Image from "next/image";
import { CiUser } from "react-icons/ci";
import Send from "@/public/icons/send.svg?url";
import generateRandomId from "@/utils/idGenergator";
import Robot from "@/public/svgs/Robot";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatbgRef = useRef<HTMLDivElement>(null);
  const [isResult, setIsResult] = useState(false);
  const router = useRouter();

  function resizeTextarea() {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    if (textareaRef.current.scrollHeight > 200)
      textareaRef.current.style.height = "208px";
  }

  function formatTime(date: Date) {
    let hours: string | number = date.getHours();
    let minutes: string | number = date.getMinutes();
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return hours + ":" + minutes;
  }
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        id: new Date().getTime().toString(),
        content: "어디가 불편해서 방문하신건가요?",
        createdAt: new Date(),
      },
    ]);
  }, []);
  useEffect(() => {
    if (!chatbgRef.current) return;
    if (chatbgRef.current.scrollHeight + 20 > chatbgRef.current.clientHeight) {
      const { scrollHeight, clientHeight } = chatbgRef.current;
      chatbgRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [messages]);
  useEffect(() => {
    if (isLoading) return;
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return;
    if (lastMessage.role !== "assistant") return;
    if (lastMessage.content.includes("# 결과 보고서 #")) {
      const rawReport = lastMessage.content.split("# 결과 보고서 #")[1];
      localStorage.setItem("report", JSON.stringify(coverteReport(rawReport)));
      setIsResult(true);
    }
  }, [isLoading]);
  return (
    <div className="max-w-[1400px] h-full w-full rounded-xl md:rounded-3xl bg-white mt-7 shadow-lg px-3 xl:px-auto mx-auto">
      <div className="w-full h-full pt-2 pb-4 md:pt-4 md:pb-8 flex flex-col max-w-[1200px] mx-auto">
        <div className="flex-1 overflow-hidden px-3">
          <div
            ref={chatbgRef}
            className="flex flex-col gap-4 py-4 overflow-auto h-full"
          >
            <div className="fixed top-1/2 left-1/2 z-1 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <Image src={Yonsei} alt="yonsei" />
            </div>
            {messages.map((chat) => (
              <div key={generateRandomId(15)} className={`flex items-start`}>
                {chat.role === "assistant" && (
                  <div className="flex items-center justify-center rounded-full bg-[#F2F6FA] w-9 h-9 md:w-[85px] md:h-[85px] z-[1] shadow-md">
                    <Robot className="w-[22px] h-[17px] md:w-[52px] md:h-[42px]" />
                  </div>
                )}
                <div className="flex items-end w-full">
                  {chat.role === "user" && (
                    <div className="text-xs md:text-xl font-[500] text-[#C0C0C0] ml-auto">
                      {chat.createdAt && formatTime(chat.createdAt)}
                    </div>
                  )}
                  <div
                    className={`rounded-xl md:rounded-3xl px-4 py-3 md:px-7 md:py-4 shadow-lg w-fit max-w-[600px] whitespace-pre-line z-[1] text-xs md:text-xl text-left mx-2 md:mx-5 font-[600] ${
                      chat.role === "user"
                        ? "bg-[#EEF7FF] text-[#333]"
                        : "bg-[#00387F] text-white"
                    }`}
                  >
                    {chat.content}
                  </div>
                  {chat.role === "assistant" && (
                    <div className="text-xs md:text-xl font-[500] text-[#C0C0C0]">
                      {chat.createdAt && formatTime(chat.createdAt)}
                    </div>
                  )}
                </div>
                {chat.role === "user" && (
                  <div className="flex items-center justify-center rounded-full bg-[#D9D9D9] w-9 h-9 md:w-[85px] md:h-[85px] z-[1] shadow-md">
                    <CiUser className="w-6 h-6 md:w-10 md:h-10" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full px-1 md:px-10">
          {isResult ? (
            <div className="w-full flex items-center flex-row gap-2 md:gap-4">
              <div
                onClick={() => router.replace("/")}
                className="rounded-lg md:rounded-xl cursor-pointer text-center w-full font-[400] text-xs md:text-2xl shadow-md py-4 bg-[#D9D9D9]"
              >
                새로 고침
              </div>
              <div
                onClick={() => router.push("/result")}
                className="bg-[#00387F] rounded-lg md:rounded-xl text-xs font-[400] md:text-2xl cursor-pointer shadow-md py-4 text-white text-center w-full"
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
              <textarea
                ref={textareaRef}
                value={input}
                className="w-full text-xs md:text-2xl font-[400] rounded-xl shadow-md pl-3 pr-8 py-4 md:pl-7 md:pr-16 md:py-6 outline-none row-auto resize-none"
                rows={1}
                onChange={(e) => {
                  if (e.target.value[e.target.value.length - 1] === "\n")
                    return;
                  handleInputChange(e);
                  resizeTextarea();
                }}
                placeholder={
                  isLoading
                    ? "문진을 생성중입니다. 잠시 기다려주세요."
                    : "문진에 대한 답변을 입력해주세요."
                }
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  !isLoading &&
                  formRef.current?.requestSubmit()
                }
              />
              {!isLoading && (
                <Image
                  src={Send}
                  alt="send"
                  loading="eager"
                  onClick={(e: FormEvent) =>
                    handleSubmit(e as FormEvent<HTMLFormElement>)
                  }
                  className="absolute right-3 md:right-5 bottom-[22px] md:bottom-7 cursor-pointer w-4 h-4 md:w-10 md:h-10"
                />
              )}
              {isLoading && (
                <div className="absolute w-8 h-8 right-3 bottom-4 md:right-5 md:bottom-6 md:w-12 md:h-12">
                  <PuffLoader loading={isLoading} size="100%" color="#9F9F9F" />
                </div>
              )}
            </form>
          )}
        </div>
      </div>
      <div className="z-1 w-full text-xs md:text-xl text-[#777] font-[300] text-center mt-4">
        ※정확한 진단은 내방하셔서 의사의 처방을 받으시길 바랍니다.
      </div>
    </div>
  );
};
