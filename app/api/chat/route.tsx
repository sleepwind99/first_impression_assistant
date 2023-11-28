import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { preset } from "@/prompts/gtp-propmt";

export const runtime = "edge";

const apiConfig = new Configuration({ apiKey: process.env.APIKEY! });
const openai = new OpenAIApi(apiConfig);

export async function POST(req: Request) {
  const { messages } = await req.json();
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-1106",
    messages: [...preset, ...messages],
    temperature: 1,
    max_tokens: 1000,
    top_p: 0,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
