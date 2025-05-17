"use client";

import type { HTMLAttributes } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ArticleSkeleton } from "./article-skeleton";
import { cn } from "@/lib/utils";

interface WikipediaArticleProps extends HTMLAttributes<HTMLDivElement> {
  title: string | null;
  htmlContent: string | null;
  isLoading: boolean;
  error: string | null;
}

export function WikipediaArticle({ title, htmlContent, isLoading, error, className, ...props }: WikipediaArticleProps) {
  if (isLoading) {
    return <ArticleSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!title || htmlContent === null) {
    return (
       <div className="p-4 text-center text-muted-foreground">
         <p>Swipe to load a new page or use the controls.</p>
       </div>
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
    </Card>
  );
}
