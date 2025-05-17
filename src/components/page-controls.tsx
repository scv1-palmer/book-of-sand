
"use client";

import { BookOpen, ArrowLeft, ArrowRight, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageControlsProps {
  appName: string;
  onFetchRandom: () => void;
  isLoading: boolean;
}

export function PageControls({ appName, onFetchRandom, isLoading }: PageControlsProps) {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md shadow-sm p-3 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">{appName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onFetchRandom} disabled={isLoading} aria-label="Previous Random Page">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={onFetchRandom} disabled={isLoading} aria-label="Shuffle Random Page">
            <Shuffle className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={onFetchRandom} disabled={isLoading} aria-label="Next Random Page">
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
