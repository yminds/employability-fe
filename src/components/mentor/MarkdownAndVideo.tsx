// MarkdownComponents.tsx
import React, { useMemo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import { useYouTubeContext } from "./YouTubeContext";


/** Extract a YouTube Video ID from standard YouTube links. */
 export function getVideoId(url: string) {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export const YouTubeEmbed = React.memo(
  ({
    src,
    width = "300px",
    height = "400px",
  }: {
    src: string;
    width?: string;
    height?: string;
  }) => {
    const videoId = useMemo(() => getVideoId(src), [src]);
    if (!videoId) return null;

    return (
      <div className="youtube-embed-container my-4 w-full aspect-video ">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          width={width}
          height={height}
        />
      </div>
    );
  }
);

export const MarkdownComponents = {
  code({
    inline,
    className,
    children,
    ...props
  }: {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
  }) {
    const match = /language-(\w+)/.exec(className || "");
    
    if (!inline && match) {
      const language = match[1];
      const codeString = String(children).replace(/\n$/, "");

      return (
        <div className="relative group">
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton textToCopy={codeString} />
          </div>
          <SyntaxHighlighter
            style={tomorrow}
            language={language}
            PreTag="div"
            {...props}
            customStyle={{
              padding: "1.5rem",
              borderRadius: "0.5rem",
              marginTop: "0.5rem",
              marginBottom: "1.5rem",
            }}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      );
    }
    
    // Fallback for inline code:
    return (
      <code className="px-1.5 py-0.5 bg-gray-100 text-pink-500 rounded-md text-sm font-mono">
        {children}
      </code>
    );
  },

  blockquote({ children }: { children?: React.ReactNode }) {
    return (
      <blockquote className="border-l-4 border-indigo-400 pl-4 my-4 italic text-gray-600 bg-indigo-50 py-2 rounded-r-lg">
        {children}
      </blockquote>
    );
  },

  /**
   * Modifies the anchor renderer so that:
   * - If it's a YouTube link, we add the link to context and return null.
   * - Otherwise, render a normal <a>.
   */
  a({ href = "", children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    const isExternal = /^https?:\/\//.test(href);
    const isYouTube = href.includes("youtube.com") || href.includes("youtu.be");
    const { addYouTubeLink } = useYouTubeContext();

    if (isYouTube) {
      // Collect the link in our context (we'll render it later).
      addYouTubeLink(href);
      // Return null so we don't render it inline.
      return null;
    }

    // Otherwise, normal link
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : "_self"}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-blue-600 hover:text-blue-800 underline"
        {...props}
      >
        {children}
      </a>
    );
  },

  p({ children }: { children?: React.ReactNode }) {
    return (
      <p className="mb-4 leading-relaxed text-[16px] font-ubuntu">
        {children}
      </p>
    );
  },

  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-xl font-bold mb-3 mt-5">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-lg font-bold mb-2 mt-4">{children}</h3>
  ),
};

// CopyButton for code blocks
const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-md"
      title="Copy to clipboard"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
};
