import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-gradient hover:scale-105 smooth-transition">
            <Sparkles className="h-6 w-6 text-primary" />
            StudyShare
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground/80 hover:text-primary smooth-transition font-medium">
              Beranda
            </Link>
            <Link to="/materials" className="text-foreground/80 hover:text-primary smooth-transition font-medium">
              Materi
            </Link>
            <Link to="/forum" className="text-foreground/80 hover:text-primary smooth-transition font-medium">
              Chat AI
            </Link>
            <Link to="/upload" className="text-foreground/80 hover:text-primary smooth-transition font-medium">
              Upload Tugas
            </Link>
            <Link to="/team" className="text-foreground/80 hover:text-primary smooth-transition font-medium">
              Tim Kami
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden md:inline-flex glass-effect border-primary/30 font-medium">
              Login
            </Button>
            <Button className="glow-effect text-white font-semibold">
              Daftar
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden mt-4 flex flex-wrap gap-3">
          <Link to="/" className="text-sm text-foreground/80 hover:text-primary smooth-transition font-medium">
            Beranda
          </Link>
          <Link to="/materials" className="text-sm text-foreground/80 hover:text-primary smooth-transition font-medium">
            Materi
          </Link>
          <Link to="/forum" className="text-sm text-foreground/80 hover:text-primary smooth-transition font-medium">
            Chat AI
          </Link>
          <Link to="/upload" className="text-sm text-foreground/80 hover:text-primary smooth-transition font-medium">
            Upload
          </Link>
          <Link to="/team" className="text-sm text-foreground/80 hover:text-primary smooth-transition font-medium">
            Tim
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
