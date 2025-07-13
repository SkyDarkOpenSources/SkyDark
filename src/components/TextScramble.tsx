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
    let interval: NodeJS.Timeout;

    const scramble = () => {
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
    };

    interval = setInterval(scramble, 50);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span 
      className={className} 
      style={{ 
        whiteSpace: 'pre',
        fontFamily: 'monospace', // Using monospace font for stable width
        fontWeight: 'inherit',
        fontSize: 'inherit',
      }}
    >
      {displayText}
    </span>
  );
}