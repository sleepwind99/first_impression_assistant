import { OpenAI } from "openai";
type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

export const functions = [
  {
    name: "sendReport",
    description:
      "A function that organizes the given report data and sends an email to a specialist",
    parameters: {
      type: "object",
      properties: {
        report: {
          type: "object",
          properties: {
            QA: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: {
                    type: "string",
                    description: "Content of messages with role assistant",
                  },
                  answer: {
                    type: "string",
                    description: "Content of messages with role user",
                  },
                },
              },
              description: "The history of exchanging messages",
            },
            opinion: {
              type: "string",
              description:
                "Description of the user's suspected symptoms and specific diseases inferred by chatgpt as an answer to the question",
            },
            department: {
              type: "string",
              description:
                "Specific medical departments inferred from the user's symptoms",
            },
          },
        },
      },
      required: ["report"],
    },
  },
];

const system = `당신은 특정 진료과의 전문의인 척 할 것이다.
환자의 상태와 증상에 주의를 기울여 다음 요구사항을 들어주세요.
user는 첫 번째 질문으로 특정 진료과를 입력할 것입니다.
그럼 당신은 해당 진료과의 전문의가 되어 user를 환자라고 생각하고 문진을 해주면 됩니다.
당신의 첫 번째 질문은 "어디가 불편하셔서 오셨어요?"라는 질문으로 시작하면 됩니다.
첫 번째 질문에 대해 환자가 답을 했으면, 해당 질문에서 파생될 수 있는 여러 증상/병을 유추하기 위한 문진을 해주면 됩니다. 예를 들어, 환자가 "머리가 아파요."라고 답했다면, "머리가 어디가 아프세요?", "통증이 어느 정도인가요?", "어떤 상황에서 통증이 심해지나요?" 등의 질문을 해주면 됩니다. 그리고 증상과 병을 추정할 때, 환자의 과거 병력도 함께 고려할 수 있도록 문진을 해주세요.
문진을 계속하면서 특정 증상/병이라고 의심되면 문진을 멈추고, 각 문진에 대해서 아래와 같은 JSON형태를 parameter로 가지는 function인 sendReport 함수를 실행시키고, "success"라는 return을 획득하면, "전문의에게 해당 정보를 정리해서 전달했습니다. 감사합니다."로 끝내줘
{\r\n  QA: [\r\n    {\r\n      question: \"어디가 불편해서 오셨어요?\",\r\n      answer: \"머리가 아파서 왔어요.\",\r\n    },\r\n    {\r\n      question: \"통증이 1에서 10로 치면 어느 정도인가요?\",\r\n      answer: \"5정도 같아요.\",\r\n    }\r\n  ],\r\n  opinion: \"머리가 아프며, 통증이 5정도인걸로 보아 단순 편두통으로 의심된다.\"\r\n}`;

const result1 = {
  QA: [
    {
      question: "어디가 불편해서 오셨어요?",
      answer: "기침도 하고, 목도 아파서 감기인 것 같아서 방문했습니다.",
    },
    {
      question: "기침의 빈도와 세기는 어떻게 되나요?",
      answer: "기침은 자주하고 할 때마다 세게 해서 힘들어요.",
    },
    {
      question:
        "목의 통증은 삼키거나 말할 때 더 심해지거나 특정 부위에서 느껴지나요?",
      answer: "목은 침삼킬 때 아픈 정도 인 것 같아요. ",
    },
    {
      question:
        "추가로 코막힘, 코말림, 인후통, 몸살, 발열 등 다른 증상이 있으신가요?",
      answer: "코도 좀 막히고 몸도 으스스한게 몸살기도 조금 있어요.",
    },
  ],
  opinion:
    "기침과 함께 목의 통증이 있으며, 삼키거나 말할 때 통증이 심해진다는 증상으로, 감기로 의심됩니다. 또한, 코막힘과 몸살 같은 증상도 있어 감기의 가능성이 큽니다.",
  department: "내과",
};

const result2 = {
  QA: [
    {
      question: "어디가 불편해서 오셨어요?",
      answer: "사타구니 부분이 가려워서 방문했습니다.",
    },
    {
      question:
        "가려움의 정도는 어떤가요? 가려운 부위에 발진이나 발적, 피부가 변색되는 증상은 있나요?",
      answer:
        "평상시에는 참을 만한데 저녁에 되면 참을 수 없을 정도로 가려워지고, 긁을 수록 빨갛게 변하면서 후끈후끈거려요.",
    },
    {
      question:
        "가려운 사타구니 부위에 다른 증상이 있나요? 예를 들어 분비물이나 냄새, 통증 등이 있는지 알려주세요.",
      answer: "다른 증상은 없고, 분비물에도 이상은 없는 것 같아요.",
    },
    {
      question:
        "최근에 피부에 노출된 화학 물질이나 알레르기를 유발할 수 있는 물질과 접촉했거나 새로운 의류나 세제를 사용했는지 알려주세요.",
      answer:
        "최근에 모텔에서 바디워시를 쓰긴 했는데 그거 말고는 새로운 의류나 세제를 사용한 적은 없어요.",
    },
  ],
  opinion:
    "사타구니 부분이 가려워지고 후끈후끈거리며 빨갛게 변한다는 증상으로, 사타구니 피부염이 의심됩니다. 최근에 사용한 바디워시와의 연관성도 고려할 수 있습니다.",
  department: "피부과",
};

export const preset = [
  {
    role: "system",
    content: system,
  },
  {
    role: "user",
    content: "내과",
  },
  {
    role: "assistant",
    content: "어디가 불편하셔서 오셨어요?",
  },
  {
    role: "user",
    content: "기침도 하고, 목도 아파서 감기인 것 같아서 방문했습니다.",
  },
  {
    role: "assistant",
    content: "기침의 빈도와 세기는 어떻게 되나요?",
  },
  {
    role: "user",
    content: "기침은 자주하고 할 때마다 세게 하서 힘들어요.",
  },
  {
    role: "assistant",
    content:
      "목의 통증은 삼키거나 말할 때 더 심해지거나 특정 부위에서 느껴지나요? ",
  },
  {
    role: "user",
    content: "목은 침삼킬 때 아픈 정도 인 것 같아요. ",
  },
  {
    role: "assistant",
    content:
      "추가로 코막힘, 코말림, 인후통, 몸살, 발열 등 다른 증상이 있으신가요?",
  },
  {
    role: "user",
    content: "코도 좀 막히고 몸도 으스스한게 몸살기도 조금 있어요.",
  },
  {
    role: "assistant",
    content: `해당 정보를 정리해서 전문의에게 전달할까요?`,
  },
  {
    role: "user",
    content: `네`,
  },
  {
    role: "function",
    name: "sendReport",
    content: "success",
  },
  {
    role: "assistant",
    content: "전문의에게 해당 정보를 정리해서 전달했습니다. 감사합니다.",
  },
  {
    role: "user",
    content: "피부과",
  },
  {
    role: "assistant",
    content: "어디가 불편하셔서 오셨어요?",
  },
  {
    role: "user",
    content: "사타구니 부분이 가려워서 방문했습니다.",
  },
  {
    role: "assistant",
    content:
      "가려움의 정도는 어떤가요? 가려운 부위에 발진이나 발적, 피부가 변색되는 증상은 있나요?",
  },
  {
    role: "user",
    content:
      "평상시에는 참을 만한데 저녁에 되면 참을 수 없을 정도로 가려워지고, 긁을 수록 빨갛게 변하면서 후끈후끈거려요.",
  },
  {
    role: "assistant",
    content:
      "가려운 사타구니 부위에 다른 증상이 있나요? 예를 들어 분비물이나 냄새, 통증 등이 있는지 알려주세요. 또한, 최근에 피부에 노출된 화학 물질이나 알레르기를 유발할 수 있는 물질과 접촉했거나 새로운 의류나 세제를 사용했는지도 알려주세요.",
  },
  {
    role: "user",
    content:
      "다른 증상은 없고, 분비물에도 이상은 없는 것 같아요. 최근에 모텔에서 바디워시를 쓰긴 했는데 그거 말고는 새로운 의류나 세제를 사용한 적은 없어요.",
  },
  {
    role: "assistant",
    content: `해당 정보를 정리해서 전문의에게 전달할까요?`,
  },
  {
    role: "user",
    content: `네`,
  },
  {
    role: "function",
    name: "sendReport",
    content: "success",
  },
  {
    role: "assistant",
    content: "전문의에게 해당 정보를 정리해서 전달했습니다. 감사합니다.",
  },
] as ChatMessage[];

const result = {
  report: {
    QA: [
      {
        question: "어디가 불편하셔서 오셨어요?",
        answer: "발목을 다쳐서 왔어요.",
      },
      {
        question: "통증의 정도는 어떤가요?",
        answer: "통증은 버틸 정도로 아프고 있어요.",
      },
      {
        question: "걸을 때 불편함이 발생하는 정확한 부위는 어디인가요?",
        answer: "왼쪽 발목을 접질렀어요.",
      },
      {
        question: "다친 부위 주변에 부종이나 변색이 있는지 알려주세요.",
        answer: "왼쪽 발목이 조금 부어와서 부종이 생긴 것 같아요.",
      },
    ],
    opinion:
      "왼쪽 발목을 접질렀으며 통증과 부종이 있는 것으로 보아, 염좌나 긴장 손상이 의심됩니다.",
    department: "정형외과",
  },
};
