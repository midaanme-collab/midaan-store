'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { fbqTrack } from '@/utils/metaPixel';
import { captureUtmParams } from '@/utils/crm';

export default function MetaPixelNavigation() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Capture any landing UTM campaign tags or fbclid into sessionStorage
    captureUtmParams();

    // Avoid double firing on initial mount because base script in layout already tracks PageView
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fbqTrack('PageView');
  }, [pathname]);

  return null;
}
