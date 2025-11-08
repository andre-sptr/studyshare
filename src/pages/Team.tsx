import Navbar from "@/components/Navbar";
import MusicPlayer from "@/components/MusicPlayer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Heart, Sparkles } from "lucide-react";

const Team = () => {
  const members = [
    { name: "Oksya Donika Amalia", emoji: "🌸", color: "from-pink-400 to-rose-400" },
    { name: "Azilla Lovenia Almisky", emoji: "🌸", color: "from-purple-400 to-pink-400" },
    { name: "Alya Azizah Afdal", emoji: "🌸", color: "from-blue-400 to-cyan-400" },
    { name: "Aira Reyhana Sumardi", emoji: "🌸", color: "from-green-400 to-emerald-400" },
    { name: "Nayla Azira", emoji: "🌸", color: "from-orange-400 to-red-400" },
  ];

  const socialLinks = [
    { username: "@manic_siak", url: "https://www.instagram.com/manic_siak" },
    { username: "@vastranoversee", url: "https://instagram.com/vastranoversee" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <MusicPlayer />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Heart className="h-12 w-12 text-primary animate-pulse-slow" />
            <span className="text-6xl">💕</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
            Kelompok Orang Gemoy
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto font-medium">
            Tim kreatif di balik StudyShare yang penuh semangat! ✨
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          <Card className="glow-effect glass-card border-0 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400" />
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-2 mb-8">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold text-gradient text-center">
                  Anggota Tim
                </h2>
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-xl p-6 text-center hover:scale-105 smooth-transition glass-card group cursor-pointer"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-0 group-hover:opacity-20 smooth-transition`} />
                    <div className="relative z-10">
                      <div className="text-4xl mb-3 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                        {member.emoji}
                      </div>
                      <p className="text-base font-semibold text-foreground group-hover:text-primary smooth-transition">
                        {member.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glow-effect glass-card border-0 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400" />
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-2 mb-8">
                <Instagram className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold text-gradient text-center">
                  Follow Us!
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {socialLinks.map((link, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="glow-effect glass-effect border-primary/30 font-semibold text-base"
                    size="lg"
                    asChild
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Instagram className="h-5 w-5" />
                      {link.username}
                    </a>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Card className="glass-card border-0 inline-block">
              <CardContent className="p-6">
                <p className="text-lg font-medium text-foreground/80">
                  💙 Dibuat dengan cinta oleh Kelompok Orang Gemoy 💙
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Team;
