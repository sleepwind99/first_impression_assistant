"use client";
import { useRef } from "react";
import { useChat } from "ai/react";
import { BsFillArrowRightSquareFill } from "react-icons/bs";
import { FaUserDoctor } from "react-icons/fa6";
import PuffLoader from "react-spinners/PuffLoader";

const loaderCss: React.CSSProperties = {
  position: "absolute",
  top: 0,
  right: 0,
};

export const AiForm = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();
  const formRef = useRef<HTMLFormElement>(null);

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
                <span>{`${messages[0].content} 문진 도우미`}</span>
              </div>
            )}
            <div
              className={`rounded-lg p-2 my-1 w-fit max-w-[600px] ${
                chat.role === "user"
                  ? "bg-gray-400 text-right ml-auto"
                  : "bg-blue-300 text-left mr-auto"
              }`}
            >
              {chat.content}
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 flex items-center w-full justify-center pb-10 bg-white">
        <div className="max-w-[768px] w-full flex mt-5">
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
                onClick={() => formRef.current && formRef.current.submit()}
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
        </div>
      </div>
    </div>
  );
};
