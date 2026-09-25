import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  splitTypographyProps,
  usePageTypography,
  type PageTypographyProps,
} from './pageTypography';
import { LandingPageFrame, type LandingPageProps } from './LandingPageFrame';
import { COMPLETE_SHELF_TYPOGRAPHY } from './pageRecipes';
import '../threeui.css';

export function CompleteShelfLandingPage(props: LandingPageProps & PageTypographyProps) {
  const navigate = useNavigate();
  const [type, frame] = splitTypographyProps(props);
  const customization = usePageTypography(COMPLETE_SHELF_TYPOGRAPHY, type);

  // Listen for interactive module navigation from the 3D shelf
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'LMS_NAVIGATE' && event.data?.route) {
        navigate(event.data.route);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  return (
    <LandingPageFrame
      {...frame}
      customization={customization}
      title="LearnSphere LMS — Interactive 3D Module Library"
      sourceUrl="/landing-pages/complete-shelf-v2.html"
    />
  );
}

export default CompleteShelfLandingPage;
