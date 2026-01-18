// app/api/ask/route.ts
import { NextResponse } from "next/server";
import { AthenaAI } from "athena-ai-sdk";

const athena = new AthenaAI({
  apiKey: process.env.ATHENA_API_KEY,
});

export async function POST(req: Request) {
  const { university, question } = await req.json();

  const answer = await athena.generate({
    prompt: `Answer this question for ${university}: ${question}`,
    model: "default",
  });

  return NextResponse.json({
    answer,
  });
}
