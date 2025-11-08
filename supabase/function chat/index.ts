import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Kamu adalah Gugugaga 🧠, teman belajar yang ramah, suportif, dan ceria untuk anak SMA di StudyShare.

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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
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
