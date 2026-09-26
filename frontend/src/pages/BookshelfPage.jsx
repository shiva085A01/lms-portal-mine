import React from 'react';
import { Link } from 'react-router-dom';
import { CompleteShelfLandingPage } from '../shaders/landing-pages/CompleteShelfLandingPage';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export function BookshelfPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#121110]">
      {/* Floating Return Button & Theme Toggle */}
      <div className="absolute top-[80px] left-6 z-50 flex items-center gap-3">
        <Link to="/student/dashboard">
          <Button
            size="sm"
            variant="secondary"
            icon={ArrowLeft}
            className="backdrop-blur-md bg-black/70 border-white/15 hover:bg-black/90 hover:border-terracotta-500/40 text-xs px-3.5 py-1.5 shadow-xl text-white"
          >
            Back to Dashboard
          </Button>
        </Link>
        <ThemeToggle />
      </div>

      {/* 3D Three.js Interactive Working Volumes Shelf */}
      <div className="w-full h-full">
        <CompleteShelfLandingPage
          headingFont="iowan-old-style"
          bodyFont="inter"
          headingWeight="400"
          bodyWeight="400"
          primaryColor="#d95d39"
          headingSize={60}
          bodySize={12}
          headingLetterSpacing={-0.055}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}

export default BookshelfPage;
