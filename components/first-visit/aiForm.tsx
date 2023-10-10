"use client";
import { useState } from "react";
import { Select } from "@mui/base/Select";
import { Option } from "@mui/base/Option";
import axios from "axios";
import { OpenAI } from "openai";
import { BsFillArrowRightSquareFill } from "react-icons/bs";
import { FaUserDoctor } from "react-icons/fa6";
import PuffLoader from "react-spinners/PuffLoader";

type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

const departments = [
  {
    value: "Internal Medicine",
    label: "내과",
  },
  {
    value: "Surgery",
    label: "외과",
  },
  {
    value: "Pediatrics",
    label: "소아과",
  },
  {
    value: "Orthopedics",
    label: "정형외과",
  },
  {
    value: "Dermatology",
    label: "피부과",
  },
  {
    value: "Otolaryngology",
    label: "이비인후과",
  },
  {
    value: "Ophthalmology",
    label: "안과",
  },
  {
    value: "Dentistry",
    label: "치과",
  },
  {
    value: "Neurology",
    label: "신경과",
  },
  {
    value: "Neurosurgery",
    label: "신경외과",
  },
];

const loaderCss: React.CSSProperties = {
  position: "absolute",
  top: 0,
  right: 0,
};

export const AiForm = () => {
  const [department, setDepartment] = useState("Surgery");
  const [ans, setAns] = useState("");
  const [chats, setChats] = useState([] as ChatMessage[]);
  const [disableInput, setDisableInput] = useState(false);
  const request = async () => {
    const reqData = [...chats, { role: "user", content: ans } as ChatMessage];
    setChats(reqData);
    try {
      setAns("");
      setDisableInput(true);
      const res = await axios.post("./api/chatgpt", { reqData });
      if (res.data.content.split(" ")[0] === "result") {
        console.log(res.data.content.split("result = ")[1]);
        const result = JSON.parse(res.data.content.split("result = ")[1]);
        const { QA, opinion, department } = result;
        setChats([
          ...reqData,
          { role: "assistant", content: opinion } as ChatMessage,
        ]);
      } else setChats([...reqData, res.data]);
    } catch (e) {
      console.log(e);
    } finally {
      setDisableInput(false);
    }
  };
  return (
    <div className="max-w-[768px] w-full">
      {/* <div className="flex justify-start items-center gap-3">
        <div>진료과를 선택해주세요</div>
        <Select
          onChange={(_, value) => setDepartment(value ?? "")}
          value={department}
          slotProps={{
            root: {
              className:
                "py-2 px-3 min-w-[120px] border min-h-[41px] rounded-lg border-gray-500 text-base outline-none hover:bg-gray-50",
            },
            listbox: {
              className:
                "my-3 p-2 min-w-[120px] max-h-[300px] overflow-auto outline-none border border-gray-500 bg-white rounded-lg shadow-lg",
            },
          }}
        >
          {departments.map((dep, index) => (
            <Option
              key={index}
              value={dep.value}
              label={dep.label}
              className="list-none p-2 rounded-lg cursor-default last-of-type:border-b-0 hover:bg-gray-100 flex justify-start items-center"
            >
              {`${dep.label}`}
            </Option>
          ))}
        </Select>
      </div> */}
      <div className="flex flex-col h-[70vh] py-4">
        {chats.map((chat, index) => (
          <div
            key={`${index}_${new Date().getTime()}`}
            className={`${index === chats.length - 1 ? "pb-32" : ""}`}
          >
            {chat.role === "assistant" && (
              <div className="flex items-center justify-start">
                <FaUserDoctor className="w-5 h-5 text-yellow-400 mr-2" />
                <span>{`${chats[0].content} 문진 도우미`}</span>
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
            {disableInput && index === chats.length - 1 && (
              <div>
                <div className="flex items-center justify-start">
                  <FaUserDoctor className="w-5 h-5 text-yellow-400 mr-2" />
                  <span>{`${chats[0].content} 문진 도우미`}</span>
                </div>
                <div
                  className={`rounded-lg p-2 my-1 w-[600px] bg-blue-300 text-left mr-auto`}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 flex items-center w-full justify-center pb-10 bg-white">
        <div className="max-w-[768px] w-full flex mt-5">
          <div className="relative w-full">
            <input
              value={ans}
              className="border border-gray-400 rounded-lg outline-none px-4 py-2 w-full"
              onChange={(e) => setAns(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && request()}
              placeholder={
                disableInput
                  ? "문진을 생성중입니다. 잠시 기다려주세요."
                  : "문진에 대한 답변을 입력해주세요."
              }
              disabled={disableInput}
            />
            {!disableInput && (
              <BsFillArrowRightSquareFill
                onClick={request}
                className={`absolute top-0 right-0 w-8 h-8 pt-2 pr-2 cursor-pointer ${
                  ans === "" ? "text-gray-300" : "text-yellow-400"
                }`}
              />
            )}
            {disableInput && (
              <PuffLoader
                loading={disableInput}
                cssOverride={loaderCss}
                size={40}
                color="#FACC14"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
