import Navbar from "@/components/Navbar";
import MusicPlayer from "@/components/MusicPlayer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Materials = () => {
  const materials = [
    {
      title: "Biologi",
      emoji: "🧬",
      videoId: "MriGdzO5OSY",
      description: "Pelajari dasar kehidupan, sel, genetika, dan ekosistem.",
      badge: "Sains",
      color: "from-green-400 to-emerald-500",
    },
    {
      title: "Bahasa Indonesia",
      emoji: "📖",
      videoId: "eytIEk9pEDk",
      description: "Belajar memahami teks dan menulis dengan cara menyenangkan.",
      badge: "Bahasa",
      color: "from-orange-400 to-red-500",
    },
    {
      title: "Matematika",
      emoji: "🔢",
      videoId: "nJ_-RsDhdRM",
      description: "Pahami konsep persamaan, geometri, dan aljabar dengan mudah.",
      badge: "Eksak",
      color: "from-blue-400 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <MusicPlayer />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-4">
            <span className="text-6xl animate-pulse-slow">📚</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
            Materi Pelajaran
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto font-medium">
            Tonton video pembelajaran dan pahami konsep dengan lebih mudah! ✨
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {materials.map((material, index) => (
            <Card 
              key={index} 
              className="overflow-hidden smooth-transition glow-effect glass-card border-0 group"
            >
              <div className={`h-2 bg-gradient-to-r ${material.color}`} />
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-4xl animate-float" style={{ animationDelay: `${index * 0.3}s` }}>
                    {material.emoji}
                  </span>
                  <Badge className="bg-primary/10 text-primary border-0 font-semibold">
                    {material.badge}
                  </Badge>
                </div>
                <CardTitle className="text-2xl text-foreground group-hover:text-primary smooth-transition">
                  {material.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {material.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden glass-effect">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${material.videoId}`}
                    title={material.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Card className="glass-card border-0 glow-effect max-w-2xl mx-auto">
            <CardContent className="p-8">
              <p className="text-lg text-foreground/80 font-medium">
                💡 <span className="font-bold">Tips:</span> Tonton video sambil catat poin penting, 
                lalu diskusikan dengan Gugugaga AI kalau ada yang kurang jelas! 🤖✨
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Materials;
