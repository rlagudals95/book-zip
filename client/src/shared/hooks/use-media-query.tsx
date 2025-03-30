'use client';

import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      
      const updateMatches = () => {
        setMatches(media.matches);
      };
      
      // 초기값 설정
      updateMatches();
      
      // 리스너 등록
      if (media.addEventListener) {
        media.addEventListener('change', updateMatches);
        return () => media.removeEventListener('change', updateMatches);
      } else {
        // 구형 브라우저 지원
        media.addListener(updateMatches);
        return () => media.removeListener(updateMatches);
      }
    }
    
    return undefined;
  }, [query]);
  
  return matches;
}; 