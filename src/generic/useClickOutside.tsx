import { useEffect } from 'react';

/**
 * Calls the callback when a mousedown occurs outside the referenced element.
 * @param ref React ref to the element
 * @param callback Function to call on outside click
 */
export function useClickOutside(
  ref: React.RefObject<HTMLDivElement | null>,
  callback: () => void
) {
  useEffect(() => {
    function handleEvent(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    document.addEventListener('mousedown', handleEvent);
    return () => {
      document.removeEventListener('mousedown', handleEvent);
    };
  }, [ref, callback]);
} 