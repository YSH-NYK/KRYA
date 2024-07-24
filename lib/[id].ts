import { NextResponse } from "next/server";
import axios from "axios";

interface PredictionStatusResponse {
  id: string;
  output: string[];
  status: string;
}

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  try {
    const response = await axios.get<PredictionStatusResponse>(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: {
        'Authorization': `Token ${process.env.REP_KEY}`
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return new NextResponse("Error fetching prediction status", { status: 500 });
  }
}
