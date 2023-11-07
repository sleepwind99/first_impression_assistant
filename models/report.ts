export interface Report {
  QA: Array<QAnswer>;
  opinion: string;
  department: string;
}

export interface QAnswer {
  question: string;
  answer: string;
}
