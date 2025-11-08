// supabase/functions/chat/index.ts

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// Tipe untuk pesan yang masuk dari frontend (format OpenAI)
interface OpenAIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Tipe untuk format request ke Gemini
interface GeminiContent {
  role: "user" | "model";
  parts: { text: string }[];
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://studyshare.icsiak.site",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Fungsi untuk mengubah format messages OpenAI ke Gemini
function transformMessagesToGemini(messages: OpenAIMessage[]): GeminiContent[] {
  const geminiContents: GeminiContent[] = [];
  for (const msg of messages) {
    if (msg.role === "system") {
      continue;
    }
    geminiContents.push({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    });
  }
  return geminiContents;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders, status: 200 });
  }

  try {
    const { messages } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const systemPrompt = `Kamu adalah Gugugaga 🧠, teman belajar yang ramah, suportif, dan ceria untuk anak Madrasah di StudyShare.
Kamu dibuat oleh: Oksya Donika Amalia, Azilla Lovenia Almisky, Alya Azizah Afdal, Aira Reyhana Sumardi, dan Nayla Azira.

Kepribadian:
- Selalu antusias dan positif
- Gunakan emoji yang relevan dalam setiap respons
- Gunakan bahasa Indonesia santai tapi sopan seperti teman sebaya
- Berikan motivasi dan dukungan
- Kadang pakai kata-kata gaul yang wajar seperti "nih", "dong", "yuk"

Kemampuan:
- Bantu jelaskan materi pelajaran (Biologi, Bahasa Indonesia, Matematika, dll)
- Kasih tips belajar efektif
- Jawab pertanyaan akademik
- Beri motivasi saat mereka stress dengan tugas
- Dengerin curhat tentang pelajaran
- Sarankan cara belajar yang fun

Gaya bicara:
- Ramah dan approachable
- Jangan terlalu formal
- Pakai emoji yang sesuai
- Berikan respons yang engaging
- Kadang kasih quotes motivasi

Contoh sapaan: "Haii! Aku Gugugaga 🧠 temen belajarmu! Mau bahas pelajaran, motivasi, atau curhat tugas dulu nih?"`;

    const geminiBody = {
      contents: transformMessagesToGemini(messages),
      systemInstruction: {
        role: "model",
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        temperature: 0.7,
      },
    };

    // --- PERBAIKAN DI SINI ---
    // Tambahkan '&alt=sse' di akhir URL untuk memaksa Gemini
    // mengirimkan respons dalam format Server-Sent Event (SSE)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${GEMINI_API_KEY}&alt=sse`;
    // --- AKHIR PERBAIKAN ---

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(geminiBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Gemini API error: ${errorText}` }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // --- Logika Transformer (Sekarang akan bekerja) ---
    // Karena Gemini sekarang mengirim SSE, logika ini akan berhasil
    // mem-parsing 'data: ...' dan mengubahnya ke format OpenAI
    
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let textBuffer = ""; 

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
            break;
          }

          textBuffer += decoder.decode(value, { stream: true });

          let newlineIndex;
          while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
            const line = textBuffer.slice(0, newlineIndex).trim();
            textBuffer = textBuffer.slice(newlineIndex + 1);

            // Sekarang 'line' akan berisi 'data: { ... }' dari Gemini
            if (line.startsWith("data: ")) {
              try {
                const jsonStr = line.substring(6); // Hapus 'data: '
                const geminiChunk = JSON.parse(jsonStr);
                
                const content = geminiChunk.candidates?.[0]?.content?.parts?.[0]?.text;
                
                if (content) {
                  // Buat chunk format OpenAI
                  const openAIChunk = {
                    choices: [{ delta: { content: content } }],
                  };
                  
                  // Kirim sebagai Server-Sent Event (SSE)
                  const sseLine = `data: ${JSON.stringify(openAIChunk)}\n\n`;
                  controller.enqueue(new TextEncoder().encode(sseLine));
                }
              } catch (e) {
                // Abaikan jika JSON terpotong, akan dibuffer
                // console.error("Error parsing Gemini JSON chunk:", e.message, "Chunk:", line);
              }
            }
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});