import { Report } from "@/models/report";

export const coverteReport = (data: string): Report => {
  const report: Report = {
    QA: [],
    opinion: "",
    department: "",
    name: "",
    symptom: "",
    frequency: "",
    duration: "",
    dayOfVisit: "",
    prescriptionOfPast: "",
    pastHistory: "",
    familyHistory: "",
    age: 0,
    gender: "",
  };

  const lines = data.split("\n");

  for (const line of lines) {
    const [key, value] = line.split(": ");
    switch (key) {
      case "진료과":
        report.department = value;
        break;
      case "이름":
        report.name = value;
        break;
      case "나이":
        report.age = parseInt(value, 10);
        break;
      case "성별":
        report.gender = value;
        break;
      case "증상":
        report.symptom = value;
        break;
      case "증상 빈도":
        report.frequency = value;
        break;
      case "증상 시작 시점":
        report.duration = value;
        break;
      case "최근 병원 방문일":
        report.dayOfVisit = value;
        break;
      case "과거 병력":
        report.pastHistory = value;
        break;
      case "과거 처방":
        report.prescriptionOfPast = value;
        break;
      case "가족력":
        report.familyHistory = value;
        break;
      case "AI 소견":
        report.opinion = value;
        break;
      case "AI 질문":
        report.QA.push({ question: value, answer: "" });
        break;
      case `${report.name}님의 답변`:
        report.QA[report.QA.length - 1].answer = value;
        break;
      default:
        break;
    }
  }

  return report;
};
