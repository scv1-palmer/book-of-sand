
"use client";

import Script from 'next/script';
import { useEffect } from 'react';

export function AdSenseBanner() {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ADSENSE_CLIENT_ID" // TODO: Replace with your AdSense client ID
        strategy="afterInteractive"
        crossOrigin="anonymous"
        onError={(e) => {
          console.error('AdSense script failed to load', e);
        }}
      />
      <div className="w-full p-4 text-center border-t bg-muted/20">
        {/* 
          Remember to replace ca-pub-YOUR_ADSENSE_CLIENT_ID with your actual publisher ID 
          in the Script tag above and data-ad-slot below with your ad slot ID.
        */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-YOUR_ADSENSE_CLIENT_ID" // TODO: Replace with your AdSense client ID
          data-ad-slot="YOUR_ADSENSE_AD_SLOT_ID"       // TODO: Replace with your AdSense ad slot ID
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <small className="block mt-2 text-xs text-muted-foreground">Advertisement</small>
      </div>
    </>
  );
}
