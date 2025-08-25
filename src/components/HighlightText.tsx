import React, { useMemo } from 'react';

interface HighlightTextProps {
  text: string;
  keyword: string;
  className?: string;
}

const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  keyword,
  className = '',
}) => {
  const highlightedContent = useMemo(() => {
    if (!keyword.trim()) {
      return [text];
    }

    const lowerText = text.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let matchIndex = 0;

    let index = lowerText.indexOf(lowerKeyword);
    while (index !== -1) {
      // Them text truoc keyword
      if (index > lastIndex) {
        parts.push(text.substring(lastIndex, index));
      }

      // Them keyword duoc highlight
      parts.push(
        <mark key={`highlight-${matchIndex}`} className='rounded bg-amber-300'>
          {text.substring(index, index + keyword.length)}
        </mark>
      );

      lastIndex = index + keyword.length;
      index = lowerText.indexOf(lowerKeyword, lastIndex);
    }

    // Them phan text con lai
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  }, [text, keyword]);

  return <span className={className}>{highlightedContent}</span>;
};

export default HighlightText;
