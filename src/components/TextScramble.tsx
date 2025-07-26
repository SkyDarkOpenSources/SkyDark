'use client';

import { useEffect, useState } from 'react';

interface TextScrambleProps {
  text: string;
  className?: string;
}

export default function TextScramble({ text, className }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  // Using more consistent width characters for stable animation
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$%&*<>[]{}';

  useEffect(() => {
    let resolvedIndex = -1;
    // Initialize interval immediately with the correct type
    const interval: NodeJS.Timeout = setInterval(() => {
      let newText = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          newText += ' ';
          continue;
        }
        
        if (i <= resolvedIndex) {
          newText += text[i];
        } else {
          newText += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setDisplayText(newText);

      if (resolvedIndex < text.length - 1) {
        resolvedIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span 
      className={className} 
      style={{ 
        whiteSpace: 'pre',
        fontFamily: 'inter',
        fontWeight: 'inherit',
        fontSize: 'inherit',
      }}
    >
      {displayText}
    </span>
  );
}