import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REP_KEY
});

interface PredictionRequest {
  prompt: string;
  seed?: string;
  guidanceScale?: string;
}

interface PredictionResponse {
  id: string;
  output?: string[];
  status?: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { userId } = auth();
    const body: PredictionRequest = await req.json();
    const { prompt, seed, guidanceScale } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const response = await replicate.run("stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4", {
      input: {
        prompt,
        seed: seed ? parseInt(seed) : undefined,
        guidance_scale: guidanceScale ? parseFloat(guidanceScale) : undefined
      }
    });

    // Check for 'id' property in response
    if (!('id' in response)) {
      return new NextResponse("Error generating Image", { status: 500 });
    }

    // Explicitly cast response to PredictionResponse
    const predictionResponse: PredictionResponse = response as PredictionResponse;

    return NextResponse.json({ id: predictionResponse.id });
  } catch (error) {
    console.error(error);
    return new NextResponse("Error generating Image", { status: 500 });
  }
}
