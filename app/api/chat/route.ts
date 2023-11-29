import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { preset } from "@/prompts/gtp-prompt";

// SSE 설정
export const runtime = "edge";

// openai-edge 설정
const apiConfig = new Configuration({ apiKey: process.env.APIKEY! });
const openai = new OpenAIApi(apiConfig);

// POST /api/chat
export async function POST(req: Request) {
  const { messages } = await req.json();
  const response = await openai.createChatCompletion({
    model: "gpt-4-1106-preview",
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
