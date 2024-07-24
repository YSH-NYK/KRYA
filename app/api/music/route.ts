import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { increaseApiLimit, checkApiLimit } from '@/lib/api-limit';

const replicate = new Replicate({
  auth:process.env.REP_KEY
})


export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();

    if (!freeTrial) {
      return new NextResponse("Free Trial has expired...", { status: 403 });
    }

    const response = await replicate.run("riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05", { input:{prompt_a:prompt} });
console.log(response)

await increaseApiLimit();

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return new NextResponse("Error generating Music", { status: 500 });
  }
}