
"use client";

import { BookOpen } from "lucide-react";

interface PageControlsProps {
  appName: string;
}

export function PageControls({ appName }: PageControlsProps) {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md shadow-sm p-3 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">{appName}</h1>
        </div>
        {/* Buttons removed */}
      </div>
    </header>
  );
}
