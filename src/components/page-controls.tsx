"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Shuffle, BookOpen } from "lucide-react";

interface PageControlsProps {
  onBack: () => void;
  onRandom: () => void;
  canGoBack: boolean;
  appName: string;
}

export function PageControls({ onBack, onRandom, canGoBack, appName }: PageControlsProps) {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md shadow-sm p-3 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">{appName}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={onBack} disabled={!canGoBack} aria-label="Previous Page">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button variant="default" size="icon" onClick={onRandom} aria-label="Random Page">
            <Shuffle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
