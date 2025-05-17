"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSwipe } from '@/hooks/use-swipe';
import { WikipediaArticle } from '@/components/wikipedia-article';
import { PageControls } from '@/components/page-controls';
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const INITIAL_PAGE_TITLE = "Book of Sand";
const WIKIPEDIA_API_BASE = "https://en.wikipedia.org/w/api.php";

interface Article {
  title: string;
  content: string | null; // Null when content is not yet fetched
}

export default function Home() {
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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
      // Error already handled by fetchPageContent, keep currentArticle as is or clear content
      setCurrentArticle(prev => prev ? { ...prev, content: null } : null);
    }
    setIsLoading(false);
  }, [fetchPageContent]);

  const navigateToNewPage = useCallback((title: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(title);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    loadAndSetArticle(title);
  }, [history, historyIndex, loadAndSetArticle]);

  const fetchRandomPage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${WIKIPEDIA_API_BASE}?action=query&list=random&rnnamespace=0&rnlimit=1&format=json&origin=*`);
      if (!response.ok) throw new Error('Failed to fetch random page title');
      const data = await response.json();
      const randomTitle = data.query.random[0].title;
      if (randomTitle) {
        navigateToNewPage(randomTitle);
      } else {
        throw new Error('No random title received');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred fetching random page";
      setError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
      setIsLoading(false);
    }
  }, [navigateToNewPage, toast]);

  useEffect(() => {
    navigateToNewPage(INITIAL_PAGE_TITLE);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Load initial page only once

  const handleSwipe = () => {
    if (!isLoading) {
      fetchRandomPage();
    }
  };

  const swipeHandlers = useSwipe({
    onSwipedLeft: handleSwipe,
    onSwipedRight: handleSwipe,
    threshold: 75,
  });

  const goBack = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      loadAndSetArticle(history[prevIndex]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <PageControls
        onBack={goBack}
        onRandom={fetchRandomPage}
        canGoBack={historyIndex > 0}
        appName="BookOfSand"
      />
      <ScrollArea className="flex-grow" {...swipeHandlers}>
        <main
          className={`article-container min-h-full ${isLoading ? 'loading' : ''}`}
        >
          <WikipediaArticle
            title={currentArticle?.title ?? null}
            htmlContent={currentArticle?.content ?? null}
            isLoading={isLoading && currentArticle?.content === null} // Only show full skeleton if content is truly loading
            error={error}
          />
        </main>
      </ScrollArea>
    </div>
  );
}
