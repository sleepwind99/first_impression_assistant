"use client";
import { useState, useEffect } from "react";
import { Report } from "@/models/report";
import { renderToString } from "react-dom/server";
import { useRouter, useSearchParams } from "next/navigation";
import pako from "pako";

export const MailHtml = () => {
  let data: any;
  if (typeof window !== "undefined") {
    data = JSON.parse(localStorage.getItem("report") ?? "{}");
  }
  const params = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (Object.entries(data).length === 0) {
      const temp = params.get("report");
      if (temp === null) {
        alert("보고서가 없습니다.");
        router.push("/");
        return;
      }
      const decodedCompressed = Buffer.from(temp, "base64");
      const inflated = pako.ungzip(decodedCompressed, { to: "string" });
      const originalJSONData = JSON.parse(inflated);
      localStorage.setItem("report", originalJSONData);
      router.push("/result");
    }
  }, []);
  const sendMail = async () => {
    try {
      await fetch("/api/sendmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          htmlstr: renderToString(<Html data={data} />),
          sendTo: email,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="sm:w-[640px] md:w-[768px] lg:w-[1100px]">
      <Html data={data} />
      <div className="flex items-center gap-3 mt-6 px-4 mb-2">
        <input
          className="w-4/5 outline-none border border-black rounded-lg p-2"
          placeholder="이메일 주소를 입력해주세요."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="w-1/5 border-black border rounded-lg py-2"
          onClick={() => sendMail()}
        >
          공유
        </button>
      </div>
    </div>
  );
};

const Html = ({ data }: { data: Report }) => {
  return (
    <div className="mx-6">
      <h1 className="text-3xl font-bold py-2 border-b my-1">환자 정보</h1>
      <div>
        <div className="flex items-start">
          <div className="w-10 text-lg">이름:</div>
          <div className="w-full text-lg">{data.name}</div>
        </div>
        <div className="flex items-start">
          <div className="w-10 text-lg">나이:</div>
          <div className="w-full text-lg">{data.age}</div>
        </div>
        <div className="flex items-start">
          <div className="w-10 text-lg">성별:</div>
          <div className="w-full text-lg">{data.gender}</div>
        </div>
      </div>
      <h1 className="text-3xl font-bold py-2 border-b my-1">초진 정보</h1>
      <p className="text-lg">{`진료과: ${data.department}`}</p>
      <div>
        <div className="flex items-start">
          <div className="w-40 text-lg">증상:</div>
          <div className="w-full text-lg">{data.symptom}</div>
        </div>
        <div className="flex items-start">
          <div className="w-40 text-lg">증상 시작 시점:</div>
          <div className="w-full text-lg">{data.duration}</div>
        </div>
        <div className="flex items-start">
          <div className="w-40 text-lg">증상 빈도:</div>
          <div className="w-full text-lg">{data.frequency}</div>
        </div>
        <div className="flex items-start">
          <div className="w-40 text-lg">과거 처방:</div>
          <div className="w-full text-lg">{data.prescriptionOfPast}</div>
        </div>
        <div className="flex items-start">
          <div className="w-40 text-lg">과거 병력:</div>
          <div className="w-full text-lg">{data.pastHistory}</div>
        </div>
        <div className="flex items-start">
          <div className="w-40 text-lg">가족 병력:</div>
          <div className="w-full text-lg">{data.familyHistory}</div>
        </div>
        <div className="flex items-start">
          <div className="w-40 text-lg">AI 소견:</div>
          <div className="w-full text-lg">{data.opinion}</div>
        </div>
      </div>
      <h1 className="text-3xl font-bold py-2 border-b my-1">전체 문진 정보</h1>
      <div>
        {data.QA.map((qa, index) => {
          return (
            <div key={index} className="border-b py-1">
              <div className="flex items-start">
                <div className="w-40 text-lg">{`AI 질문${index + 1}`}</div>
                <div className="w-full text-lg">{qa.question}</div>
              </div>
              <div className="flex items-start">
                <div className="w-40 text-lg">{`${data.name}님의 답변${
                  index + 1
                }`}</div>
                <div className="w-full text-lg">{qa.answer}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
