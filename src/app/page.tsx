
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
  content: string | null; // Null when content is not yet fetched or error
}

export default function Home() {
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const initialFetchDone = useRef(false);

  const fetchPageSummary = useCallback(async (title: string): Promise<string> => {
    const params = new URLSearchParams({
      action: "query",
      prop: "extracts",
      exintro: "true", // Get only the intro section (summary)
      explaintext: "false", // Get HTML
      titles: title,
      format: "json",
      origin: "*",
      redirects: "1", // Follow redirects
    });
    const response = await fetch(`${WIKIPEDIA_API_BASE}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Wikipedia API error: ${response.status} for title "${title}"`);
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.info || `Could not load page summary for "${title}"`);
    }
    
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    
    if (!pageId || !pages[pageId]) {
      throw new Error(`No page data found in API response for title "${title}"`);
    }

    const pageData = pages[pageId];

    // pageId === "-1" indicates a page that doesn't exist after checking redirects
    if (pageData.missing !== undefined || pageId === "-1") { 
       throw new Error(`The page "${title}" does not exist or could not be found.`);
    }

    // If extract is a string (even empty), return it.
    // An empty string often means it's a disambiguation page or has no intro.
    if (typeof pageData.extract === 'string') {
      return pageData.extract; 
    } else {
      // Fallback for rare cases where extract isn't a string for an existing page.
      return ""; 
    }
  }, []);
  
  const loadAndSetArticle = useCallback(async (title: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentArticle({ title, content: null }); // Show title, clear old content while loading summary

    try {
      const summaryContent = await fetchPageSummary(title);
      setCurrentArticle({ title, content: summaryContent }); // summaryContent can be ""
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      setError(message); // This will be picked up by WikipediaArticle component
      toast({ title: "Error Loading Summary", description: message, variant: "destructive" });
      // Keep current title, set content to null to indicate error or no content
      setCurrentArticle(prev => prev ? { ...prev, content: null } : { title, content: null });
    } finally {
      setIsLoading(false);
    }
  }, [fetchPageSummary, toast, setIsLoading, setError, setCurrentArticle]);

  const fetchRandomPage = useCallback(async () => {
    setIsLoading(true); // For fetching the title itself
    setError(null);
    // setCurrentArticle(null); // Clear previous article immediately
    try {
      const response = await fetch(`${WIKIPEDIA_API_BASE}?action=query&list=random&rnnamespace=0&rnlimit=1&format=json&origin=*`);
      if (!response.ok) throw new Error('Failed to fetch random page title');
      const data = await response.json();
      const randomTitle = data.query.random[0].title;
      if (randomTitle) {
        await loadAndSetArticle(randomTitle); 
      } else {
        throw new Error('No random title received from API');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred fetching random page";
      setError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
      setCurrentArticle(null); // Clear article info if title fetch fails
      setIsLoading(false); // Ensure loading is false if title fetch itself fails
    }
    // setIsLoading(false) for summary loading is handled by loadAndSetArticle's finally block
  }, [loadAndSetArticle, toast, setIsLoading, setError, setCurrentArticle]);

  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchRandomPage();
      initialFetchDone.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchRandomPage]); // fetchRandomPage is memoized

  const swipeHandlers = useSwipe({
    onSwipedLeft: fetchRandomPage,
    onSwipedRight: fetchRandomPage,
    threshold: 75,
  });

  return (
    <div className="flex flex-col h-screen bg-background" {...swipeHandlers}>
      <PageControls
        appName="BookOfSand"
      />
      <div className="flex-grow relative flex items-center">
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
            className={`article-container min-h-full ${isLoading && currentArticle?.content === null ? 'loading' : ''} pt-4 pb-4 md:pt-8 md:pb-8 px-2 md:px-0`}
          >
            <WikipediaArticle
              title={currentArticle?.title ?? null}
              htmlContent={currentArticle?.content ?? null}
              isLoading={isLoading && currentArticle?.content === null} // Loading if overall isLoading is true AND content specifically is null
              error={error}
              className="mx-auto max-w-4xl"
            />
          </main>
        </ScrollArea>

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
