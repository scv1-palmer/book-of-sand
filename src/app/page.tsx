
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { WikipediaArticle } from '@/components/wikipedia-article';
import { PageControls } from '@/components/page-controls';
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  }, []); // fetchRandomPage is memoized, but we only want this effect on initial mount

  return (
    <div className="flex flex-col h-screen bg-background">
      <PageControls
        appName="BookOfSand"
        onFetchRandom={fetchRandomPage}
        isLoading={isLoading}
      />
      <ScrollArea className="flex-grow">
        <main
          className={`article-container min-h-full ${isLoading ? 'loading' : ''}`}
        >
          <WikipediaArticle
            title={currentArticle?.title ?? null}
            htmlContent={currentArticle?.content ?? null}
            isLoading={isLoading && currentArticle?.content === null}
            error={error}
          />
        </main>
      </ScrollArea>
    </div>
  );
}
