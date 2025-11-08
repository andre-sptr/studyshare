import { useState } from "react";
import Navbar from "@/components/Navbar";
import MusicPlayer from "@/components/MusicPlayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload as UploadIcon, Sparkles } from "lucide-react";

const Upload = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Tugas Terkirim! ✨",
      description: "Tugasmu berhasil diupload. Semangat belajarnya!",
    });
    setTitle("");
    setDescription("");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <MusicPlayer />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-4">
            <span className="text-6xl animate-pulse-slow">📝</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
            Upload Tugas
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto font-medium">
            Share tugasmu dengan teman-teman lain di StudyShare! ✨
          </p>
        </div>

        <Card className="max-w-2xl mx-auto glow-effect glass-card border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl text-gradient">Upload Tugasmu</CardTitle>
            </div>
            <CardDescription className="text-base">
              Isi form di bawah untuk berbagi tugas dengan teman-teman 💙
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold">Judul Tugas</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Tugas Biologi - Ekosistem 🧬"
                  required
                  className="glass-effect border-primary/30 focus:border-primary font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan tentang tugasmu... 📖"
                  rows={5}
                  required
                  className="glass-effect border-primary/30 focus:border-primary font-medium resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file" className="text-base font-semibold">Upload File</Label>
                <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center hover:border-primary smooth-transition glass-effect cursor-pointer group">
                  <UploadIcon className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 smooth-transition" />
                  <Input
                    id="file"
                    type="file"
                    className="hidden"
                  />
                  <Label
                    htmlFor="file"
                    className="cursor-pointer text-primary hover:text-primary/80 font-semibold text-lg"
                  >
                    Klik untuk upload file ✨
                  </Label>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">
                    PDF, DOC, atau gambar (Max 10MB)
                  </p>
                </div>
              </div>

              <Button type="submit" className="w-full glow-effect text-white font-semibold text-lg py-6">
                Kirim Tugas 🚀
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Upload;
