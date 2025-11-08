// src/pages/Tugas.tsx

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; 
import { supabase } from "@/intragation/supabase/client";
import { Database } from "@/intragation/supabase/types";
import Navbar from "@/components/Navbar";
import MusicPlayer from "@/components/MusicPlayer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, AlertCircle, FileText, User, Edit, Trash2 } from "lucide-react"; 
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react"; 
import { Link } from "react-router-dom"; 
import { useAuth } from "@/hooks/useAuth"; 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"; 
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type AssignmentWithProfile = Database["public"]["Tables"]["assignments"]["Row"] & {
  profiles: { email: string | null } | null;
};

const fetchAssignments = async (): Promise<AssignmentWithProfile[]> => {
  const { data, error } = await supabase
    .from("assignments")
    .select(`
      *,
      profiles ( email )
    `) 
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  
  return data as unknown as AssignmentWithProfile[];
};

const AssignmentCard = ({ 
  assignment, 
  currentUserId 
}: { 
  assignment: AssignmentWithProfile,
  currentUserId: string | undefined 
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editTitle, setEditTitle] = useState(assignment.title);
  const [editDescription, setEditDescription] = useState(assignment.description || "");

  const isOwner = assignment.user_id === currentUserId;

  // --- PERBAIKAN DI FUNGSI INI ---
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Gunakan createSignedUrl untuk bucket PRIBADI
      // Ini membuat link sementara yang berlaku selama 60 detik
      const { data, error } = await supabase.storage
        .from("assignments")
        .createSignedUrl(assignment.file_url!, 60); // <-- '!' dan 60 detik

      if (error) throw error;

      // Buka URL yang sudah ditandatangani
      window.open(data.signedUrl, "_blank");

    } catch (error: any) {
      console.error("Error getting download link:", error);
      toast({
        title: "Gagal Mengunduh 😥",
        description: error.message || "Tidak bisa mendapatkan link file.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };
  // --- AKHIR PERBAIKAN ---

  const editMutation = useMutation({
    mutationFn: async ({ title, description }: { title: string, description: string }) => {
      const { error } = await supabase
        .from("assignments")
        .update({ title, description })
        .eq("id", assignment.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Berhasil Diperbarui! ✏️", description: "Tugasmu sudah di-update." });
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      setIsEditing(false); 
    },
    onError: (error: any) => {
      toast({ title: "Gagal Update 😥", description: error.message, variant: "destructive" });
    }
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim() === "") {
      toast({ title: "Judul tidak boleh kosong", variant: "destructive" });
      return;
    }
    editMutation.mutate({ title: editTitle, description: editDescription });
  };

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (assignment.file_url) {
        const { error: fileError } = await supabase.storage
          .from("assignments")
          .remove([assignment.file_url]);
        if (fileError) throw fileError;
      }
      const { error: dbError } = await supabase
        .from("assignments")
        .delete()
        .eq("id", assignment.id);
      if (dbError) throw dbError;
    },
    onSuccess: () => {
      toast({ title: "Berhasil Dihapus! 🗑️", description: "Tugasmu sudah dihapus." });
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
    onError: (error: any) => {
      toast({ title: "Gagal Hapus 😥", description: error.message, variant: "destructive" });
    }
  });

  return (
    <Card className="overflow-hidden smooth-transition glow-effect glass-card border-0 group flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle className="text-xl text-foreground group-hover:text-primary smooth-transition flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {assignment.title}
          </CardTitle>
          <CardDescription className="text-sm flex items-center gap-2 pt-1 text-foreground/70">
            <User className="h-4 w-4" />
            diupload oleh: {assignment.profiles?.email || "User"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm min-h-[40px]">
            {assignment.description || "Tidak ada deskripsi."}
          </p>
          <Button 
            className="w-full glow-effect text-white font-semibold"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? "Loading..." : "Download Tugas"}
          </Button>

          {isOwner && (
            <div className="flex gap-2 w-full">
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full glass-effect">
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-0">
                  <DialogHeader>
                    <DialogTitle className="text-gradient text-2xl">Edit Tugas</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title" className="font-semibold">Judul</Label>
                      <Input 
                        id="edit-title" 
                        value={editTitle} 
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="glass-effect border-primary/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-desc" className="font-semibold">Deskripsi</Label>
                      <Textarea 
                        id="edit-desc" 
                        value={editDescription} 
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="glass-effect border-primary/30"
                      />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline" className="glass-effect">Batal</Button>
                      </DialogClose>
                      <Button type="submit" disabled={editMutation.isPending} className="glow-effect text-white">
                        {editMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" /> Hapus
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass-card border-0">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Kamu yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini tidak bisa dibatalkan. Ini akan menghapus tugas dan file-nya secara permanen.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="glass-effect">Batal</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => deleteMutation.mutate()} 
                      disabled={deleteMutation.isPending}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

const SkeletonCard = () => (
  <Card className="overflow-hidden glass-card border-0">
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2 mt-2" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-10 w-full" />
    </CardContent>
  </Card>
);

const Tugas = () => {
  const { user } = useAuth(); 
  const { data: assignments, isLoading, isError, error } = useQuery<AssignmentWithProfile[]>({
    queryKey: ["assignments"],
    queryFn: fetchAssignments,
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <MusicPlayer />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-4">
            <span className="text-6xl animate-pulse-slow">📂</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
            Daftar Tugas
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto font-medium">
            Lihat semua tugas yang sudah di-share oleh teman-temanmu! ✨
          </p>
        </div>

        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {isError && (
          <Card className="max-w-2xl mx-auto glass-card border-destructive/50">
            <CardContent className="p-6 text-center text-destructive flex items-center justify-center gap-3">
              <AlertCircle className="h-8 w-8" />
              <div>
                <p className="font-bold text-lg">Gagal memuat tugas 😥</p>
                <p className="text-sm">{(error as Error).message}</p>
              </div> 
            </CardContent>
          </Card>
        )}

        {!isLoading && !isError && assignments && assignments.length === 0 && (
          <Card className="max-w-2xl mx-auto glass-card border-0">
            <CardContent className="p-8 text-center">
              <p className="text-lg text-foreground/80 font-medium">
                Yah, belum ada yang upload tugas nih 😭
                <br />
                Jadilah yang pertama upload di halaman <Link to="/upload" className="text-primary underline">Upload Tugas</Link>!
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !isError && assignments && assignments.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {assignments.map((assignment) => (
              <AssignmentCard 
                key={assignment.id} 
                assignment={assignment}
                currentUserId={user?.id} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Tugas;