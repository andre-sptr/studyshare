// src/App.tsx

// 1. Import 'lazy' dan 'Suspense' dari React
import { lazy, Suspense } from "react"; 
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute"; 

// 2. Buat komponen Loader sederhana
const SimpleLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <p className="text-lg text-foreground">Loading halaman...</p>
  </div>
);

// 3. Ubah semua import halaman statis menjadi 'lazy'
const Index = lazy(() => import("./pages/Index"));
const Materials = lazy(() => import("./pages/Materials"));
const Forum = lazy(() => import("./pages/Forum"));
const Upload = lazy(() => import("./pages/Upload"));
const Team = lazy(() => import("./pages/Team"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Auth = lazy(() => import("./pages/Auth"));
const Tugas = lazy(() => import("./pages/Tugas"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          {/* 4. Bungkus <Routes> dengan <Suspense> */}
          <Suspense fallback={<SimpleLoader />}>
            <Routes>
              {/* Rute Publik */}
              <Route path="/" element={<Index />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/team" element={<Team />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/register" element={<Auth />} />

              {/* Rute Terlindungi */}
              <Route element={<ProtectedRoute />}>
                <Route path="/upload" element={<Upload />} />
                <Route path="/tugas" element={<Tugas />} />
                <Route path="/forum" element={<Forum />} />
              </Route>

              {/* Rute Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;