import React from "react";
import DOMPurify from "dompurify";
import { Text } from "@mantine/core";

interface TextRendererProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const TextRenderer: React.FC<TextRendererProps> = ({ children, className, style }) => {
  const renderContent = () => {
    if (typeof children === "string") {
      // Check if the string contains HTML tags
      const hasHtmlTags = /<[^>]*>/g.test(children);
      
      if (hasHtmlTags) {
        // Sanitize HTML content before rendering
        const sanitizedHTML = DOMPurify.sanitize(children);
        return (
          <Text
            className={className}
            style={style}
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
          />
        );
      }
    }
    
    // For non-HTML content, render safely
    return (
      <Text className={className} style={style}>
        {children}
      </Text>
    );
  };

  return renderContent();
};

export default TextRenderer;
