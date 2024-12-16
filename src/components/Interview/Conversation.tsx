import { useRef } from "react";
import { IMessage } from "./Interview";

const Conversation: React.FC<{
  messages: IMessage[];
}> = ({ messages }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="h-[40vh] relative w-full rounded-xl minimal-scrollbar"
      style={{
        scrollBehavior: "smooth",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* Top Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>

      {/* Scrollable Messages */}
      <div className="overflow-y-scroll h-full">
        {messages.map((message, index) =>
          // <Message key={message.id} message={message} />
          // If the message is last or first, add a margin to the top or bottom
          index === 0 ? (
            <Message key={message.id} message={{ ...message, className: "mt-12" }} />
          ) : index === messages.length - 1 ? (
            <Message key={message.id} message={{ ...message, className: "mb-12" }} />
          ) : (
            <Message key={message.id} message={{ ...message }} />
          )
        )}
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Conversation;

const Message: React.FC<{
  message: { id: number; message: string; sender: string; className?: string };
}> = ({ message }) => {
  return (
    <div
      className={`flex gap-4 flex-row items-center py-1.5 px-1.5 w-full ${message.className}`}
    >
      <div className="flex flex-col gap-1.5">
        <span
          className={`${
            message.sender !== "User" ? "text-[#08A358]" : "text-[#228BBF]"
          } font-ubuntu font-medium text-sm`}
        >
          {message.sender}
        </span>
        <p className="text-left font-ubuntu text-base text-slate-900">
          {message.message}
        </p>
      </div>
    </div>
  );
};
