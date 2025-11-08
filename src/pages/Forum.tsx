import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import MusicPlayer from "@/components/MusicPlayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Sparkles } from "lucide-react";
import { useChat } from "@/hooks/useChat";

const motivationalQuotes = [
  "✨ Belajar sedikit setiap hari lebih baik daripada tidak sama sekali.",
  "🌟 Kamu nggak gagal, kamu cuma lagi proses jadi hebat.",
  "💪 Istirahat boleh, tapi jangan menyerah.",
  "🚀 Setiap usaha kecil hari ini adalah investasi untuk masa depan.",
  "💙 Kesalahan adalah bagian dari belajar. Keep going!",
];

const Forum = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setCurrentQuote(motivationalQuotes[randomIndex]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <MusicPlayer />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-8 animate-fade-in">
          <div className="mb-4">
            <span className="text-6xl animate-pulse-slow">🤖</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
            Chat AI Gugugaga
          </h1>
          <Card className="max-w-2xl mx-auto glass-card border-0 p-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse-slow" />
              <p className="text-sm text-foreground/80 italic font-medium">
                {currentQuote}
              </p>
            </div>
          </Card>
        </div>

        <Card className="max-w-3xl mx-auto glass-card border-0 min-h-[500px] flex flex-col glow-effect">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-primary to-primary/90 text-white glow-effect"
                      : "glass-card"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="glass-card rounded-2xl px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Gugugaga sedang mengetik...
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-6 border-t border-border/30 glass-effect">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pesanmu di sini... 💬"
                disabled={isLoading}
                className="flex-1 glass-effect border-primary/30 focus:border-primary font-medium"
              />
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="glow-effect text-white font-semibold px-6"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default Forum;
