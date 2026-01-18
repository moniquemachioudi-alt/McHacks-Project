"use client";

//import { useEffect, useState } from "react";
//import { callTool } from "@/lib/callTool";
import {useEffect, useState} from "react";


/* export default function AnswerPage() {
  //const [loading, setLoading] = useState(true);
  //const [answerData, setAnswerData] = useState<{
    //answer: string;
    //sources: { text: string; source: string }[];
  } | null>(null);
  */


export default function AnswerPage() {
    const [university, setUniversity] = useState<string | null>(null);
    const [question, setQuestion] = useState<string | null>(null);
  
    useEffect(() => {
        const u = localStorage.getItem("university");
        const q = localStorage.getItem("question");
      
        console.log("Stored university:", u);
        console.log("Stored question:", q);
      
        if (!u || !q) return;
      
        setUniversity(u);
        setQuestion(q);
      
        const run = async () => {
          try {
            const res = await fetch("/api/ask", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                university: u,
                question: q,
              }),
            });
      
            const data = await res.json();
            console.log("MCP response:", data);
          } catch (err) {
            console.error("MCP call failed:", err);
          }
        };
      
        run();
      }, []);
    }

    const run = async () => {
        try {
          const res = await fetch("/api/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              university: u,
              question: q,
            }),
          });
      
          const text = await res.text();
          console.log("Raw response:", text);
      
          if (!text) {
            throw new Error("Empty response from MCP");
          }
      
          const data = JSON.parse(text);
          console.log("MCP response:", data);
      
        } catch (err) {
          console.error("MCP call failed:", err);
        }
      };
      


  /* const [university, setUniversity] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(null);

  useEffect(() => {
    // 1️⃣ Get values from localStorage safely
    console.log("AnswerPage mounted");

    const storedUniversity = localStorage.getItem("university");
    const storedQuestion = localStorage.getItem("question");

    console.log({ storedUniversity, storedQuestion });

    if (!storedUniversity || !storedQuestion) {
      console.log("Missing storage, aborting");
      setLoading(false); // stop loading if missing info
      return;
    }

    setUniversity(storedUniversity);
    setQuestion(storedQuestion);

    const runAgent = async () => {
      setLoading(true);

      try {
        // 2️⃣ Retrieve relevant sources from the backend
        const sourcesData = await callTool("retrieve_sources", {
          question: storedQuestion,
          university: storedUniversity,
        });

        const passages: string[] = sourcesData.structuredContent.sources.map(
          (s: any) => s.text
        );

        // 3️⃣ Generate answer using the passages
        const answerResp = await callTool("generate_answer", {
          question: storedQuestion,
          content: passages,
        });

        setAnswerData({
          answer: answerResp.structuredContent.answer,
          sources: sourcesData.structuredContent.sources,
        });
      } catch (err) {
        console.error("Agent failed:", err);
      } finally {
        setLoading(false);
      }
    };

    runAgent();
  }, []);

  // 4️⃣ Render states
  if (loading) return <p className="p-8">Loading answer...</p>;

  if (!university || !question)
    return <p className="p-8">Missing info. Please select your university first.</p>;

  if (!answerData) return <p className="p-8">No answer available.</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-bold">Answer for {university}</h2>
        <p className="text-gray-600 italic">"{question}"</p>
      </header>

      <section className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="whitespace-pre-wrap leading-relaxed">{answerData.answer}</p>
      </section>

      {answerData.sources.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mt-4">Sources</h3>
          <ul className="list-disc pl-5">
            {answerData.sources.map((s, i) => (
              <li key={i}>
                <a
                  href={s.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600"
                >
                  {s.source}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
} */