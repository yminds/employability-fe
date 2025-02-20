import { useEffect, useRef } from "react";
import { IMessage } from "./Interview";

const Conversation: React.FC<{
  messages: IMessage[];
  layoutType: 1 | 2;
}> = ({ messages, layoutType }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // to enable auto scrolling 
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isUserNearBottom = () => {
      const threshold = 150; // px from bottom
      const position = container.scrollHeight - container.scrollTop - container.clientHeight;
      return position <= threshold;
    };

    
    if (isUserNearBottom()) {
     
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-xl ${
        layoutType === 1 ? "h-[40vh]" : "h-[50vh]"
      }`}
      style={{
        scrollBehavior: "smooth",
        WebkitOverflowScrolling: "touch",
        backgroundColor: layoutType === 2 ? "#f5f5f5" : "transparent",
      }}
    >
      {/* Top Gradient Overlay */}
      {layoutType === 1 && (
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
      )}

      {/* Scrollable Messages */}
      <div
        className={`overflow-y-scroll max-h-full minimal-scrollbar flex flex-col-reverse ${
          layoutType === 1 ? "p-0" : "p-4"
        }`}
      >
        {messages.map((message, index) =>
          // <Message key={message.id} message={message} />
          // If the message is last or first, add a margin to the top or bottom
          index === 0 ? (
            <Message
              key={message.id}
              message={{
                ...message,
                className: layoutType === 1 ? "mb-12" : "mb-4",
              }}
            />
          ) : index === messages.length - 1 ? (
            <Message
              key={message.id}
              message={{ ...message, className: "mb-5" }}
            />
          ) : (
            <Message key={message.id} message={{ ...message }} />
          )
        )}
         <div ref={scrollRef} />
      </div>

      {/* Bottom Gradient Overlay */}
      {layoutType === 1 && (
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      )}
    </div>
  );
};

export default Conversation;

const Message: React.FC<{
  message: { id: number; message: string; role: string; className?: string };
}> = ({ message }) => {
  return (
    <div
      className={`flex gap-4 flex-row items-center py-1.5 px-1.5 w-full ${message.className}`}
    >
      <div className="flex flex-col gap-1.5">
        <span
          className={`${
            message.role !== "User" ? "text-[#08A358]" : "text-[#228BBF]"
          } font-ubuntu font-medium text-sm`}
        >
          {message.role}
        </span>
        <p className="text-left font-ubuntu text-base text-slate-900">
          {message.message}
        </p>
      </div>
    </div>
  );
};
