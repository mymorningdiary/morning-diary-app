import { useEffect, useRef, useState } from 'react';
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

interface Options {
  resetKey?: string | number | null;
  triggerRatio?: number;
}

const DEFAULT_TRIGGER_RATIO = 0.72;

export function useScrollTriggeredSection({
  resetKey,
  triggerRatio = DEFAULT_TRIGGER_RATIO,
}: Options = {}) {
  const scrollYRef = useRef(0);
  const scrollViewHeightRef = useRef(0);
  const targetYRef = useRef<number | null>(null);
  const isTriggeredRef = useRef(false);
  const [isTriggered, setIsTriggered] = useState(false);

  const triggerIfNeeded = (
    nextScrollY = scrollYRef.current,
    nextScrollViewHeight = scrollViewHeightRef.current,
    nextTargetY = targetYRef.current,
  ) => {
    if (isTriggeredRef.current || !nextScrollViewHeight || nextTargetY == null) {
      return;
    }

    if (nextScrollY + nextScrollViewHeight * triggerRatio >= nextTargetY) {
      isTriggeredRef.current = true;
      setIsTriggered(true);
    }
  };

  const handleScrollViewLayout = (event: LayoutChangeEvent) => {
    const nextHeight = event.nativeEvent.layout.height;

    scrollViewHeightRef.current = nextHeight;
    triggerIfNeeded(scrollYRef.current, nextHeight);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextScrollY = event.nativeEvent.contentOffset.y;

    scrollYRef.current = nextScrollY;
    triggerIfNeeded(nextScrollY);
  };

  const handleTargetLayout = (event: LayoutChangeEvent) => {
    const nextTargetY = event.nativeEvent.layout.y;

    targetYRef.current = nextTargetY;
    triggerIfNeeded(scrollYRef.current, scrollViewHeightRef.current, nextTargetY);
  };

  useEffect(() => {
    scrollYRef.current = 0;
    targetYRef.current = null;
    isTriggeredRef.current = false;
    setIsTriggered(false);
  }, [resetKey]);

  return {
    isTriggered,
    handleScrollViewLayout,
    handleScroll,
    handleTargetLayout,
  };
}
