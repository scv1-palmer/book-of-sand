
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { WikipediaArticle } from '@/components/wikipedia-article';
import { PageControls } from '@/components/page-controls';
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSwipe } from "@/hooks/use-swipe";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const WIKIPEDIA_API_BASE = "https://en.wikipedia.org/w/api.php";

interface Article {
  title: string;
  content: string | null; // Null when content is not yet fetched
}

export default function Home() {
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const initialFetchDone = useRef(false);

  const fetchPageContent = useCallback(async (title: string): Promise<string | null> => {
    try {
      const response = await fetch(`${WIKIPEDIA_API_BASE}?action=parse&page=${encodeURIComponent(title)}&prop=text&formatversion=2&format=json&origin=*`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.info || `Could not load page: ${title}`);
      }
      return data.parse.text;
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      setError(message);
      toast({ title: "Error fetching page", description: message, variant: "destructive" });
      return null;
    }
  }, [toast]);
  
  const loadAndSetArticle = useCallback(async (title: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentArticle({ title, content: null }); // Show title while loading

    const content = await fetchPageContent(title);
    if (content !== null) {
      setCurrentArticle({ title, content });
    } else {
      setCurrentArticle(prev => prev ? { ...prev, content: null } : null);
    }
    setIsLoading(false);
  }, [fetchPageContent]);

  const fetchRandomPage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${WIKIPEDIA_API_BASE}?action=query&list=random&rnnamespace=0&rnlimit=1&format=json&origin=*`);
      if (!response.ok) throw new Error('Failed to fetch random page title');
      const data = await response.json();
      const randomTitle = data.query.random[0].title;
      if (randomTitle) {
        loadAndSetArticle(randomTitle);
      } else {
        throw new Error('No random title received');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred fetching random page";
      setError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
      setIsLoading(false);
    }
  }, [loadAndSetArticle, toast]);

  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchRandomPage();
      initialFetchDone.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const swipeHandlers = useSwipe({
    onSwipedLeft: fetchRandomPage,
    onSwipedRight: fetchRandomPage,
    threshold: 75, // Adjusted threshold for better swipe detection
  });

  return (
    <div className="flex flex-col h-screen bg-background" {...swipeHandlers}>
      <PageControls
        appName="BookOfSand"
      />
      <div className="flex-grow relative flex items-center">
        {/* Left Button - hidden on small screens, swipe is primary for mobile */}
        <Button
          variant="outline"
          size="icon"
          onClick={fetchRandomPage}
          disabled={isLoading}
          aria-label="Previous Random Page"
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 hidden md:inline-flex rounded-full h-10 w-10 md:h-12 md:w-12 shadow-lg bg-background/80 hover:bg-accent/80"
        >
          <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
        </Button>

        <ScrollArea className="flex-grow h-full">
          <main
            className={`article-container min-h-full ${isLoading ? 'loading' : ''} pt-4 pb-4 md:pt-8 md:pb-8 px-2 md:px-0`} // Added padding for article within scroll area
          >
            <WikipediaArticle
              title={currentArticle?.title ?? null}
              htmlContent={currentArticle?.content ?? null}
              isLoading={isLoading && currentArticle?.content === null}
              error={error}
              className="mx-auto max-w-4xl" // Center article and set max width
            />
          </main>
        </ScrollArea>

        {/* Right Button - hidden on small screens, swipe is primary for mobile */}
        <Button
          variant="outline"
          size="icon"
          onClick={fetchRandomPage}
          disabled={isLoading}
          aria-label="Next Random Page"
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 hidden md:inline-flex rounded-full h-10 w-10 md:h-12 md:w-12 shadow-lg bg-background/80 hover:bg-accent/80"
        >
          <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </div>
    </div>
  );
}
