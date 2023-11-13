export interface Report {
  QA: Array<QAnswer>;
  opinion: string;
  department: string;
  name: string;
  symptom: string;
  frequency: string;
  duration: string;
  dayOfVisit: string;
  prescriptionOfPast: string;
  pastHistory: string;
  familyHistory: string;
  age: number;
  gender: string;
}

export interface QAnswer {
  question: string;
  answer: string;
}
