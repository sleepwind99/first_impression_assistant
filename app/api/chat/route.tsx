import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { preset, functions } from "@/prompts/gtp-propmt";
import { Report } from "@/models/report";

export const runtime = "edge";

const apiConfig = new Configuration({ apiKey: process.env.APIKEY! });
const openai = new OpenAIApi(apiConfig);

async function runFunction(name: string, args: any) {
  switch (name) {
    case "sendReport":
      return await sendReport(args);
  }
  return "error";
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [...preset, ...messages],
    temperature: 1,
    max_tokens: 981,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    functions,
    function_call: "auto",
  });
  const stream = OpenAIStream(response, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages,
    ) => {
      const result = await runFunction(name, args);
      const newMessages = createFunctionCallMessages(result);
      return openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [...preset, ...messages, ...newMessages],
        temperature: 1,
        max_tokens: 981,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true,
        functions,
        function_call: "auto",
      });
    },
  });
  return new StreamingTextResponse(stream);
}

const sendReport = async ({ report }: { report: Report }): Promise<string> => {
  console.log(report);
  return "success";
};
