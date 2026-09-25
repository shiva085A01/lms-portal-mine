import React from 'react';
import { Link } from 'react-router-dom';
import { CompleteShelfLandingPage } from '../shaders/landing-pages/CompleteShelfLandingPage';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function BookshelfPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#171a24]">
      {/* Floating Return Button - positioned below the top-left brand title */}
      <div className="absolute top-[80px] left-6 z-50">
        <Link to="/student/dashboard">
          <Button
            size="sm"
            variant="glass"
            icon={ArrowLeft}
            className="backdrop-blur-md bg-black/60 border-white/15 hover:bg-black/80 hover:border-white/30 text-xs px-3 py-1.5 shadow-lg"
          >
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* 3D Three.js Interactive Working Volumes Shelf */}
      <div className="w-full h-full">
        <CompleteShelfLandingPage
          headingFont="iowan-old-style"
          bodyFont="inter"
          headingWeight="400"
          bodyWeight="400"
          primaryColor="#c87046"
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
