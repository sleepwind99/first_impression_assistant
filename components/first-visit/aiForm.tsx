"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import React from "react";
import { useChat } from "ai/react";
import { useRouter, useSearchParams } from "next/navigation";
import PuffLoader from "react-spinners/PuffLoader";
import { coverteReport } from "@/utils/coverte-report";
import Yonsei from "@/public/icons/yonsei.svg?url";
import Image from "next/image";
import { CiUser } from "react-icons/ci";
import Send from "@/public/icons/send.svg?url";
import generateRandomId from "@/utils/idGenergator";
import Robot from "@/public/svgs/Robot";
import { Lang } from "@/lang/lang";

// AI와 대화할 수 있는 form
export const AiForm = () => {
  // ai/react 라이브러리에서 제공하는 ai와 대화할 수 있는 hook
  const {
    messages, // 대화 내용/기록
    input, // 사용자가 입력한 내용
    handleInputChange, // 사용자가 입력한 내용을 업데이트하는 함수
    handleSubmit, // 사용자가 입력한 내용을 서버로 전송하는 함수
    isLoading, // 서버로 전송하는 중인지 여부
    setMessages, // 대화 내용/기록을 업데이트하는 함수
  } = useChat();
  const param = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null); // form element
  const textareaRef = useRef<HTMLTextAreaElement>(null); // textarea element
  const chatbgRef = useRef<HTMLDivElement>(null); // 대화 내용/기록을 감싸는 div element
  const [isResult, setIsResult] = useState(false); // 결과 보고서를 받았는지 여부
  const [isAutoScroll, setIsAutoScroll] = useState(true); // 대화 내용/기록이 업데이트 될 때마다 자동으로 스크롤을 내릴지 여부
  const [lang, setLang] = useState<keyof typeof Lang>("ko"); // 언어 설정
  const router = useRouter();

  // textarea의 높이를 자동으로 조절하는 함수
  function resizeTextarea() {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    if (textareaRef.current.scrollHeight > 200)
      textareaRef.current.style.height = "208px";
  }

  // 대화 내용/기록의 시간을 포맷팅하는 함수
  function formatTime(date: Date) {
    let hours: string | number = date.getHours();
    let minutes: string | number = date.getMinutes();
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return hours + ":" + minutes;
  }

  // 최초 렌더링 시 대화 내용/기록에 "어디가 불편해서 방문하신건가요?"를 추가
  useEffect(() => {
    const tempLang = (param.get("lang") as keyof typeof Lang) ?? "ko";
    setLang(tempLang);
    setMessages([
      {
        role: "assistant",
        id: new Date().getTime().toString(),
        content: Lang[tempLang].firstQuestion,
        createdAt: new Date(),
      },
    ]);
  }, []);

  // 대화 내용/기록이 업데이트 될 때마다 textarea의 높이를 조절
  useEffect(() => {
    if (!chatbgRef.current || !isAutoScroll) return;
    const { scrollHeight, clientHeight } = chatbgRef.current;
    chatbgRef.current.scrollTop = scrollHeight - clientHeight;
  }, [messages]);

  // 대화 내용/기록이 업데이트 될 때마다 스크롤을 내릴지 여부를 결정
  const autoScroll = () => {
    if (!chatbgRef.current) return;
    const { scrollHeight, clientHeight, scrollTop } = chatbgRef.current;
    if (scrollHeight < scrollTop + clientHeight + 100) setIsAutoScroll(true);
    else setIsAutoScroll(false);
  };

  // 대화 내용/기록이 업데이트 될 때마다 결과 보고서를 받았는지 확인
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
    <div className="flex flex-col w-full h-full">
      {/* <p className="z-1 w-full mt-5 text-xs md:text-base md:leading-5 text-[#777] font-[300] text-center md:mt-4">
        {`성명에는 가명(김모씨 등)을 써도 괜찮습니다. `}
        <br />
        {`통증 정도는 0(약)부터 10(강)까지로 기입해 주시기 바랍니다.`}
        <br />
        {`날짜, 위치, 갯수 등의 정보는 숫자로 표현해주시기 바랍니다. `}
      </p> */}
      <div className="max-w-[1400px] flex-1 overflow-hidden w-full rounded-xl md:rounded-3xl bg-white mt-2 pt-4 md:mt-3 shadow-lg px-3 xl:px-auto mx-auto">
        <div className="w-full h-full pt-2 pb-4 md:pt-4 md:pb-8 flex flex-col max-w-[1200px] mx-auto">
          <div className="flex-1 overflow-hidden px-3">
            <div
              ref={chatbgRef}
              onScroll={() => autoScroll()}
              className="flex flex-col gap-4 py-4 overflow-auto h-full"
            >
              {/* 배경 로고 */}
              <div className="fixed top-1/2 left-1/2 z-1 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <Image src={Yonsei} alt="yonsei" />
              </div>
              {/* 대화 내용 / 기록 */}
              {messages.map((chat) => (
                <div key={generateRandomId(15)} className={`flex items-start`}>
                  {chat.role === "assistant" && (
                    <div className="flex items-center justify-center rounded-full bg-[#F2F6FA] w-9 h-9 md:w-[85px] md:h-[85px] z-[1] shadow-md">
                      <Robot className="w-[22px] h-[17px] md:w-[52px] md:h-[42px]" />
                    </div>
                  )}
                  <div className="w-full">
                    {chat.role === "assistant" && (
                      <p className="text-xs md:text-xl ml-5 mb-2">
                        {Lang[lang].assistant}
                      </p>
                    )}
                    <div className="flex items-end w-full">
                      {chat.role === "user" && (
                        <div className="text-xs md:text-xl font-[500] text-[#C0C0C0] ml-auto">
                          {chat.createdAt && formatTime(chat.createdAt)}
                        </div>
                      )}
                      <div
                        className={`rounded-xl md:rounded-3xl px-4 py-3 md:px-7 md:py-4 shadow-lg w-fit max-w-[600px] whitespace-pre-line z-[1] text-xs md:text-xl text-left mx-2 md:mx-5 font-[600] xl:font-[500] ${
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
          {/* 입력창 */}
          <div className="w-full px-1 md:px-10">
            {isResult ? (
              <div className="w-full flex items-center flex-row gap-2 md:gap-4">
                <div
                  onClick={() => window.location.reload()}
                  className="rounded-lg md:rounded-xl cursor-pointer text-center w-full font-[400] text-xs md:text-2xl shadow-md py-4 bg-[#D9D9D9]"
                >
                  {Lang[lang].refresh}
                </div>
                <div
                  onClick={() => router.push(`/result?lang=${lang ?? "ko"}`)}
                  className="bg-[#00387F] rounded-lg md:rounded-xl text-xs font-[400] md:text-2xl cursor-pointer shadow-md py-4 text-white text-center w-full"
                >
                  {Lang[lang].viewResult}
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
                    isLoading ? Lang[lang].genMedical : Lang[lang].input
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
                {/* 로딩중 */}
                {isLoading && (
                  <div className="absolute w-8 h-8 right-3 bottom-4 md:right-5 md:bottom-6 md:w-12 md:h-12">
                    <PuffLoader
                      loading={isLoading}
                      size="100%"
                      color="#9F9F9F"
                    />
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
      <div className="z-1 w-full text-xs md:text-xl text-[#777] font-[300] text-center mt-4">
        ※{Lang[lang].precautions}
      </div>
    </div>
  );
};
