
"use client";

import { BookOpen } from "lucide-react";
// Button component is no longer needed here as arrows are moved
// import { Button } from "@/components/ui/button";
// ArrowLeft and ArrowRight icons are no longer needed here
// import { ArrowLeft, ArrowRight } from "lucide-react";


interface PageControlsProps {
  appName: string;
  // onFetchRandom and isLoading are removed as buttons are no longer in this component
}

export function PageControls({ appName }: PageControlsProps) {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md shadow-sm p-3 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">{appName}</h1>
        </div>
        {/* Navigation buttons have been moved to the sides of the page content */}
      </div>
    </header>
  );
}
