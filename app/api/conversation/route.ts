import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import axios from 'axios';
import { increaseApiLimit, checkApiLimit } from '@/lib/api-limit';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
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
      text: messages.map((msg: { content: string }) => msg.content).join(" "),  // Combine messages into a single text string
      chatbot_global_action: "Act as an assistant",
      previous_history: [],  // Adjust as needed
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
    if (error instanceof Error) {
      return new NextResponse(`Error: ${error.message}`, { status: 500 });
    } else {
      return new NextResponse("Unknown error occurred", { status: 500 });
    }
  }
}
