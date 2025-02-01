// /src/components/MarkdownRenderer.tsx

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy } from "lucide-react";
import YouTubeEmbed from "./YouTubeEmbed";
import showToast from "@/utils/mentorUtils/showToast";

interface MarkdownComponentProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  href?: string;
}

const MarkdownRenderer = {
  // Custom renderer for code blocks
  code({ node, inline, className, children, ...props }: MarkdownComponentProps) {
    const match = /language-(\w+)/.exec(className || "");
    const handleCopy = () => {
      navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
      showToast('Code copied to clipboard!');
    };

    return !inline && match ? (
      <div className="relative group rounded-lg bg-gray-900 text-white shadow-md my-4">
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white text-xs px-2 py-1 rounded-lg shadow"
          >
            <Copy size={12} />
            Copy
          </button>
        </div>
        <SyntaxHighlighter
          style={tomorrow}
          language={match[1]}
          PreTag="div"
          customStyle={{
            backgroundColor: "transparent",
            padding: "16px",
            borderRadius: "8px",
            fontSize: "0.9em",
          }}
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className="px-1.5 py-0.5 bg-gray-100 text-pink-500 rounded-md text-sm font-mono">
        {children}
      </code>
    );
  },

  // Custom renderer for blockquotes
  blockquote({ children }: MarkdownComponentProps) {
    return (
      <blockquote className="border-l-4 border-indigo-400 pl-4 my-4 italic text-gray-600 bg-indigo-50 py-2 rounded-r-lg">
        {children}
      </blockquote>
    );
  },

  // Custom renderer for links
  a({ href = "", children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    const isExternal = /^https?:\/\//.test(href);
    const isYouTube = href.includes('youtube.com') || href.includes('youtu.be');

    if (isYouTube) {
      return <YouTubeEmbed src={href} />;
    }

    return (
      <a
        href={href}
        target={isExternal ? "_blank" : "_self"}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className={`text-blue-600 hover:text-blue-800 underline ${isExternal ? "font-semibold" : ""}`}
        {...props}
      >
        {children}
      </a>
    );
  },

  // Custom renderer for paragraphs
  p({ children }: MarkdownComponentProps) {
    // Special handling for iframes and YouTube embeds within paragraphs
    if (React.isValidElement(children)) {
      const childType = (children as React.ReactElement).type;
      if (childType === 'iframe' || childType === YouTubeEmbed) {
        return children;
      }
    }
    return <p className="mb-4 leading-relaxed text-[16px] font-ubuntu">{children}</p>;
  },

  // Custom renderer for unordered lists
  ul({ children }: MarkdownComponentProps) {
    return <ul className="list-disc list-inside space-y-2 mb-4">{children}</ul>;
  },

  // Custom renderer for ordered lists
  ol({ children }: MarkdownComponentProps) {
    return <ol className="list-decimal list-inside space-y-2 mb-4">{children}</ol>;
  },

  // Custom renderer for list items
  li({ children }: MarkdownComponentProps) {
    return <li className="ml-4">{children}</li>;
  },

  // Custom renderers for headings
  h1: ({ children }: MarkdownComponentProps) => <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>,
  h2: ({ children }: MarkdownComponentProps) => <h2 className="text-xl font-bold mb-3 mt-5">{children}</h2>,
  h3: ({ children }: MarkdownComponentProps) => <h3 className="text-lg font-bold mb-2 mt-4">{children}</h3>,

  // Custom renderer for iframes
  iframe({ node }: MarkdownComponentProps) {
    const src = node?.properties?.src;
    if (src) {
      return <YouTubeEmbed src={src} />;
    }
    return null;
  }
};

export default MarkdownRenderer;
