import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MusicPlayer from "@/components/MusicPlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, MessageSquare, Upload, Users, Sparkles, Heart, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, isLoading } = useAuth();
  const features = [
    {
      icon: <BookOpen className="h-12 w-12 text-primary" />,
      title: "Materi Lengkap",
      description: "Video pembelajaran dari berbagai mata pelajaran",
      link: "/materials",
      color: "from-blue-400 to-cyan-400",
    },
    {
      icon: <MessageSquare className="h-12 w-12 text-primary" />,
      title: "Chat AI Gugugaga",
      description: "Tanya jawab dengan AI teman belajarmu",
      link: "/forum",
      color: "from-purple-400 to-pink-400",
    },
    {
      icon: <Upload className="h-12 w-12 text-primary" />,
      title: "Upload Tugas",
      description: "Berbagi tugas dengan teman-teman",
      link: "/upload",
      color: "from-green-400 to-emerald-400",
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Tim Gemoy",
      description: "Kenalan dengan tim kreatif kami",
      link: "/team",
      color: "from-orange-400 to-red-400",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 animate-float">
          <Sparkles className="h-8 w-8 text-primary/30" />
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>
          <Star className="h-6 w-6 text-accent/30" />
        </div>
        <div className="absolute bottom-40 left-1/4 animate-float" style={{ animationDelay: '2s' }}>
          <Heart className="h-7 w-7 text-primary/30" />
        </div>
        <div className="absolute bottom-20 right-1/3 animate-float" style={{ animationDelay: '0.5s' }}>
          <Sparkles className="h-9 w-9 text-accent/30" />
        </div>
      </div>

      <Navbar />
      <MusicPlayer />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="container mx-auto text-center animate-fade-in">
          <div className="mb-6 inline-block">
            <span className="text-6xl md:text-8xl animate-pulse-slow">📚</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient leading-tight">
            Selamat Datang di<br />StudyShare! ✨
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-10 max-w-3xl mx-auto font-medium">
            Tempat anak Madrasah berbagi video belajar, berdiskusi, dan upload tugas bareng.
            <span className="block mt-2 text-lg">🌟 Belajar jadi seru dan aesthetic! 💙</span>
          </p>
          <Link to="/materials">
            <Button size="lg" className="text-lg px-8 py-6 glow-effect text-white font-semibold">
              Lihat Materi 📚
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4 inline-block">
              Fitur StudyShare ✨
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Semua yang kamu butuhkan untuk belajar lebih seru dan efektif!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link}>
                <Card className="h-full hover:scale-105 smooth-transition glow-effect cursor-pointer glass-card border-0 overflow-hidden group">
                  <CardContent className="p-6 text-center space-y-4 relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 smooth-transition`} />
                    <div className="flex justify-center relative z-10 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-foreground relative z-10">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground relative z-10">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isLoading && !user && (
        <section className="pb-20 px-4">
          <div className="container mx-auto">
            <Card className="glass-card border-0 glow-effect max-w-4xl mx-auto overflow-hidden">
              <CardContent className="p-12 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 animate-gradient" />
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
                    Siap Belajar Bareng? 🚀
                  </h2>
                  <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
                    Gabung sekarang dan rasakan pengalaman belajar yang berbeda!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="glow-effect text-white font-semibold" asChild>
                      <Link to="/register">Daftar Sekarang 💙</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="glass-effect font-semibold" asChild>
                      <Link to="/login">Login ✨</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="glass-effect border-t border-border/50 py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-foreground/70 font-medium">
            © 2025 StudyShare | Kelompok Orang Gemoy 💙 
            <span className="block sm:inline sm:ml-2">Belajar jadi seru!</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
