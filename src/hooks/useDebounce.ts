import { useState, useEffect } from "react";

/**
 * Custom hook to debounce any fast-changing value (e.g. search input).
 * Delays updating the returned value until user stops typing for `delay` ms.
 */
export function useDebounce<T>(value: T, delay: number = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
