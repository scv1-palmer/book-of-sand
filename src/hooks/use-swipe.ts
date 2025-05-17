"use client";

import { useState, type TouchEvent as ReactTouchEvent } from 'react';

interface SwipeInput {
  onSwipedLeft: () => void;
  onSwipedRight: () => void;
  threshold?: number;
}

interface SwipeOutput {
  onTouchStart: (e: ReactTouchEvent<HTMLDivElement>) => void;
  onTouchMove: (e: ReactTouchEvent<HTMLDivElement>) => void;
  onTouchEnd: () => void;
}

export function useSwipe({ onSwipedLeft, onSwipedRight, threshold = 50 }: SwipeInput): SwipeOutput {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (e.targetTouches.length > 0) {
      setTouchEnd(e.targetTouches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > threshold;
    const isRightSwipe = distance < -threshold;

    if (isLeftSwipe) {
      onSwipedLeft();
    } else if (isRightSwipe) {
      onSwipedRight();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}
