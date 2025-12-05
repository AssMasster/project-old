import { useRef, useEffect } from 'react';

export const useAutoScroll = (trigger) => {
  const elementRef = useRef(null);

  useEffect(() => {
    elementRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [trigger]);

  return elementRef;
};
