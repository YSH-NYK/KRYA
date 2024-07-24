import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import axios from 'axios';

import { increaseApiLimit, checkApiLimit } from '@/lib/api-limit';

type RequestBody = {
  messages: { content: string }[];
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body: RequestBody = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!messages || !Array.isArray(messages)) {
      return new NextResponse("Messages are required and must be an array", { status: 400 });
    }

    const freeTrial = await checkApiLimit();

    if (!freeTrial) {
      return new NextResponse("Free Trial has expired...", { status: 403 });
    }

    const apiKey = process.env.GROQCLOUD_API_KEY;

    if (!apiKey) {
      return new NextResponse("API key not configured", { status: 500 });
    }

    const groqcloudResponse = await axios.post("https://api.edenai.run/v2/text/chat", {
      providers: "openai",
      text: messages.map((msg: { content: string }) => msg.content).join(" "),  
      chatbot_global_action: "You are a code generator. You must give code only in markdown code snippets with some explanation about the topic outside markdown. Give some output samples in different markdown. Use code comments for explanations",
      previous_history: [],  
      temperature: 0.0,
      max_tokens: 150
    }, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    await increaseApiLimit();

    return NextResponse.json(groqcloudResponse.data);
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new NextResponse(`Error: ${errorMessage}`, { status: 500 });
  }
}
