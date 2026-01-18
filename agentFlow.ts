// lib/agentFlow.ts
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { AthenaAI } from "athena-ai-sdk";

const athena = new AthenaAI({ apiKey: process.env.ATHENA_API_KEY });

export const answerStudentQuestion = createMcpHandler(async (server) => {
  server.registerTool(
    "generate_answer",
    {
      title: "Generate Answer",
      description: "Produces an answer from passages or summaries",
      inputSchema: z.object({
        question: z.string(),
        content: z.array(z.string()),
      }),
    },
    async ({ question, content }) => {
      const combined = content.join("\n\n");
      const answer = await athena.generate({
        prompt: `Answer using the following passages:\n${combined}\nQ: ${question}`,
        model: "default",
      });
      return { structuredContent: { answer } };
    }
  );
});

  