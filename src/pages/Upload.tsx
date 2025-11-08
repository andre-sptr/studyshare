// src/pages/Upload.tsx

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
import { useAuth } from "@/hooks/useAuth"; 
import { supabase } from "@/intragation/supabase/client"; 

const Upload = () => {
  const { toast } = useToast();
  const { user } = useAuth(); 
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    const fileInput = document.getElementById("file") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Oops!", description: "Kamu harus login untuk upload tugas.", variant: "destructive" });
      return;
    }
    if (!file) {
      toast({ title: "Oops!", description: "Jangan lupa pilih filenya ya!", variant: "destructive" });
      return;
    }
    if (!title.trim()) {
      toast({ title: "Oops!", description: "Judul tugasnya diisi dulu dong.", variant: "destructive" });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`; 

      const { data: fileData, error: fileError } = await supabase.storage
        .from("assignments") 
        .upload(filePath, file);

      if (fileError) throw fileError;

      const { error: dbError } = await supabase
        .from("assignments")
        .insert({
          user_id: user.id,
          title: title,
          description: description,
          file_url: fileData.path, 
        });

      if (dbError) throw dbError;

      toast({
        title: "Tugas Terkirim! ✨",
        description: "Tugasmu berhasil diupload. Semangat belajarnya!",
      });
      resetForm();

    } catch (error: any) {
      console.error("Error uploading assignment:", error);
      toast({
        title: "Gagal Upload 😥",
        description: error.message || "Terjadi kesalahan, coba lagi ya.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
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
                  disabled={isUploading}
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
                  disabled={isUploading}
                  className="glass-effect border-primary/30 focus:border-primary font-medium resize-none"
                />
              </div>

              {/* --- PERBAIKAN MULAI DI SINI --- */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Upload File</Label>
                
                {/* Input file tetap tersembunyi */}
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                />
                
                {/* 'div' diubah menjadi 'Label' dan dihubungkan dengan 'htmlFor="file"' */}
                <Label
                  htmlFor="file"
                  className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center hover:border-primary smooth-transition glass-effect cursor-pointer group flex flex-col items-center justify-center"
                >
                  <UploadIcon className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 smooth-transition" />
                  
                  {/* Label lama diubah menjadi 'span' agar tidak konflik */}
                  <span
                    className="text-primary hover:text-primary/80 font-semibold text-lg"
                  >
                    {file ? file.name : "Klik untuk upload file ✨"}
                  </span>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">
                    {file ? "File siap diupload!" : "PDF, DOC, atau gambar (Max 10MB)"}
                  </p>
                </Label>
              </div>
              {/* --- AKHIR PERBAIKAN --- */}

              <Button type="submit" disabled={isUploading} className="w-full glow-effect text-white font-semibold text-lg py-6">
                {isUploading ? "Mengupload..." : "Kirim Tugas 🚀"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Upload;