
"use client";

import type { HTMLAttributes } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ExternalLink } from "lucide-react";
import { ArticleSkeleton } from "./article-skeleton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface WikipediaArticleProps extends HTMLAttributes<HTMLDivElement> {
  title: string | null;
  htmlContent: string | null; // Can be "", null, or HTML string
  isLoading: boolean;
  error: string | null;
}

export function WikipediaArticle({ title, htmlContent, isLoading, error, className, ...props }: WikipediaArticleProps) {
  if (isLoading) {
    return <ArticleSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className={cn("m-4 mx-auto max-w-4xl", className)}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!title || htmlContent === null) {
    return (
       <div className={cn("p-4 text-center text-muted-foreground mx-auto max-w-4xl", className)}>
         <p>Swipe or use controls to load a random Wikipedia page summary.</p>
       </div>
    );
  }

  const wikipediaLink = `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;

  const renderFooter = () => (
    <CardFooter className="pt-4">
      <Button variant="link" asChild className="p-0 h-auto text-base">
        <a href={wikipediaLink} target="_blank" rel="noopener noreferrer">
          Read full article on Wikipedia
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </CardFooter>
  );

  if (htmlContent === "") {
    return (
      <Card className={cn("m-2 md:m-4 overflow-hidden shadow-xl", className)} {...props}>
        <CardHeader className="bg-card-foreground/5">
          <CardTitle className="text-2xl md:text-3xl font-bold text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <p className="text-muted-foreground">
            No summary is available for this topic. It might be a disambiguation page or an article without an introductory section.
          </p>
        </CardContent>
        {renderFooter()}
      </Card>
    );
  }

  return (
    <Card className={cn("m-2 md:m-4 overflow-hidden shadow-xl", className)} {...props}>
      <CardHeader className="bg-card-foreground/5">
        <CardTitle className="text-2xl md:text-3xl font-bold text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none">
        <div
          className="wikipedia-content-wrapper"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </CardContent>
      {renderFooter()}
    </Card>
  );
}
