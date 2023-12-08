"use client";
import { useState, useEffect, Fragment, Dispatch } from "react";
import { Report } from "@/models/report";
import { useRouter, useSearchParams } from "next/navigation";
import pako from "pako";
import generateRandomId from "@/utils/idGenerator";

type MailHtmlProps = {
  setShare?: Dispatch<ShareData>;
};

export const MailHtml = ({ setShare }: MailHtmlProps) => {
  const [data, setData] = useState<Report>();
  const params = useSearchParams();
  const router = useRouter();

  // 최초 렌더링 시 query string에 report가 없으면 localStorage에서 가져온다.
  useEffect(() => {
    const reportFromQuery = params.get("report");
    if (!reportFromQuery) {
      const report = JSON.parse(localStorage.getItem("report") ?? "{}");
      if (Object.entries(report).length === 0) {
        alert("결과 보고서가 없습니다.");
        router.push("/");
        return;
      }
      setData(report);
      // 결과 보고서를 공유할 수 있도록 encode하여 url을 생성한다.
      const jsonString = JSON.stringify(report);
      const compressed = pako.deflate(jsonString);
      const base64Encoded = Buffer.from(compressed).toString("base64");
      const urlSafeEncoded = encodeURIComponent(base64Encoded);
      const url = `${new URL(window.location.href)}?report=${urlSafeEncoded}`;
      if (setShare)
        setShare({
          title: "AI 초진 시스템",
          text: `${report.name}님의 AI 초진 보고서입니다.`,
          url,
        });
      return;
    }
    // query string에 report가 있으면 decode하여 localStorage에 저장하고
    // /shared-result로 이동한다.
    const urlSafeDecoded = decodeURIComponent(reportFromQuery);
    const decodedCompressed = Buffer.from(urlSafeDecoded, "base64");
    const inflated = pako.inflate(decodedCompressed, { to: "string" });
    localStorage.removeItem("report");
    localStorage.setItem("report", inflated);
    router.push("/shared-result");
  }, []);

  return (
    <div className="w-full md:w-[1200px]">
      {data && <NewTable data={data} />}
    </div>
  );
};

// 환자의 정보를 테이블로 보여주는 컴포넌트
export const NewTable = ({ data }: { data: Report }) => {
  return (
    <div id="report" className="p-4 md:p-12">
      <h2 className="px-2 text-base md:text-2xl border-l-4 border-l-[#000D47] font-[500] mb-4 md:mb-5">
        환자 정보
      </h2>
      <div className="grid grid-cols-12 text-xs md:text-base text-[#333] font-[400] mb-4 md:mb-10">
        <TalbeEl
          label="이름"
          value={data.name}
          labelClass="border-t-[1px]"
          valueClass="border-t-[1px] md:border-r-[1px]"
        />
        <TalbeEl
          label="나이"
          value={data.age}
          labelClass="md:border-t-[1px]"
          valueClass="md:border-t-[1px]"
        />
        <TalbeEl label="성별" value={data.gender} valueClass="md:col-span-9" />
      </div>
      <h2 className="px-2 text-base md:text-2xl border-l-4 border-l-[#000D47] font-[500] mb-4 md:mb-5">
        초진 정보
      </h2>
      <div className="grid grid-cols-12 text-xs md:text-base text-[#333] font-[400] mb-4 md:mb-10">
        <TalbeEl
          label="진료과"
          value={data.department}
          labelClass="border-t-[1px]"
          valueClass=" border-t-[1px] md:border-r-[1px]"
        />
        <TalbeEl
          label="증상"
          value={data.symptom}
          labelClass="md:border-t-[1px]"
          valueClass="md:border-t-[1px]"
        />
        <TalbeEl
          label="증상 시작"
          value={data.duration}
          valueClass="md:border-r-[1px]"
        />
        <TalbeEl label="최근 병원 방문일" value={data.dayOfVisit} />
        <TalbeEl
          label="증상 빈도"
          value={data.frequency}
          valueClass="md:border-r-[1px]"
        />
        <TalbeEl label="과거 처방" value={data.prescriptionOfPast} />
        <TalbeEl
          label="과거 병력"
          value={data.pastHistory}
          valueClass="md:border-r-[1px]"
        />
        <TalbeEl label="가족 병력" value={data.familyHistory} />
        <TalbeEl
          label="AI 소견"
          value={data.opinion}
          valueClass="md:col-span-9 text-start"
        />
      </div>
      <h2 className="px-2 text-base md:text-2xl border-l-4 border-l-[#000D47] font-[500] mb-4 md:mb-5">
        전체 문진 정보
      </h2>
      <div className="grid grid-cols-12 text-xs md:text-base text-[#333] font-[400]">
        {data.QA.map((qa, index) => {
          return (
            <Fragment key={generateRandomId(15)}>
              <TalbeEl
                label={`AI 질문 ${index + 1}`}
                value={qa.question}
                labelClass={index === 0 ? "border-t-[1px]" : ""}
                valueClass={`md:col-span-9 text-start ${
                  index === 0 ? "border-t-[1px]" : ""
                }`}
              />
              <TalbeEl
                label={`${data.name}님의 답변 ${index + 1}`}
                value={qa.answer}
                labelClass="text-[#00387F]"
                valueClass={"md:col-span-9 text-start text-[#00387F]"}
              />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

type TableElProps = {
  label: string;
  value: string | number;
  labelClass?: string;
  valueClass?: string;
};

// 각 테이블의 엘리먼트
const TalbeEl = ({
  label,
  value,
  labelClass = "",
  valueClass = "",
}: TableElProps) => {
  return (
    <>
      <div
        className={`bg-[#EAF1F8] border-b-[1px] border-r-[1px] flex border-[#ACACAC] items-center justify-center py-[14px] md:py-[18px] px-1 md:px-12 text-center col-span-3 ${labelClass}`}
      >
        <span>{label}</span>
      </div>
      <div
        className={`col-span-9 md:col-span-3 border-b-[1px] border-[#ACACAC] py-[14px] md:py-[18px] px-8 md:px-12 text-center ${valueClass}`}
      >
        {value}
      </div>
    </>
  );
};
