'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { fbqTrack } from '@/utils/metaPixel';

export default function MetaPixelNavigation() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Avoid double firing on initial mount because base script in layout already tracks PageView
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fbqTrack('PageView');
  }, [pathname]);

  return null;
}
