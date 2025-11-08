// src/pages/Auth.tsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MusicPlayer from "@/components/MusicPlayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/intragation/supabase/client"; // Pastikan path ini benar
import { Sparkles } from "lucide-react";

const Auth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // State untuk form Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // State untuk form Register
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);

  // Handler untuk Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Gagal Masuk 😥",
        description: error.message || "Terjadi kesalahan, coba lagi ya.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Berhasil Masuk! ✨",
        description: "Selamat datang kembali! Yuk lanjut belajar.",
      });
      navigate("/"); // Arahkan ke halaman utama setelah login
    }
  };

  // Handler untuk Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email: registerEmail,
      password: registerPassword,
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Gagal Daftar 😥",
        description: error.message || "Terjadi kesalahan, coba lagi ya.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Berhasil Daftar! 🎉",
        description: "Akunmu berhasil dibuat. Silakan login sekarang.",
      });
      // Anda bisa juga langsung login atau tetap di halaman ini
      setRegisterEmail("");
      setRegisterPassword("");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <MusicPlayer />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-4">
            <span className="text-6xl animate-pulse-slow">🔐</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
            Gabung StudyShare
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto font-medium">
            Masuk atau daftar untuk mulai berbagi dan belajar bersama! ✨
          </p>
        </div>

        <Tabs defaultValue="login" className="max-w-xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 glass-effect border-0 mb-6">
            <TabsTrigger value="login" className="text-base py-2">Masuk</TabsTrigger>
            <TabsTrigger value="register" className="text-base py-2">Daftar</TabsTrigger>
          </TabsList>
          
          {/* Form Login */}
          <TabsContent value="login">
            <Card className="max-w-xl mx-auto glow-effect glass-card border-0">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl text-gradient">Selamat Datang Kembali!</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Masuk ke akunmu untuk lanjut belajar 🚀
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-base font-semibold">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="nama@gmail.com"
                      required
                      disabled={isLoading}
                      className="glass-effect border-primary/30 focus:border-primary font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-base font-semibold">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                      className="glass-effect border-primary/30 focus:border-primary font-medium"
                    />
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full glow-effect text-white font-semibold text-lg py-6">
                    {isLoading ? "Loading..." : "Masuk 🚀"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Form Register */}
          <TabsContent value="register">
            <Card className="max-w-xl mx-auto glow-effect glass-card border-0">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl text-gradient">Buat Akun Baru</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Ayo gabung dan mulai belajar bareng! 💙
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-base font-semibold">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="nama@gmail.com"
                      required
                      disabled={isLoading}
                      className="glass-effect border-primary/30 focus:border-primary font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-base font-semibold">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      required
                      disabled={isLoading}
                      className="glass-effect border-primary/30 focus:border-primary font-medium"
                    />
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full glow-effect text-white font-semibold text-lg py-6">
                    {isLoading ? "Mendaftar..." : "Daftar Sekarang 🎉"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Auth;