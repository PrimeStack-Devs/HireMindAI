"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function InterviewChatPane({
  messages,
  isSpeechLoading,
  setMessages,
  mode
}: any) {
  const ref = useRef<HTMLDivElement | null>(null);
  console.log(mode);
  
  useEffect(() => {
    ref.current?.scrollTo({
      top: ref.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Determine which messages to render
  const displayedMessages = (() => {
    if (!messages || messages.length === 0) return [];
    // Hide the last assistant message while speech is loading
    if (isSpeechLoading) {
      const last = messages[messages.length - 1];
      if (last.role === "assistant") {
        return messages.slice(1, -1); // skip first dummy and last
      }
    }
    return messages.slice(1); // skip first dummy if you have it
  })();

  return (
    <div className="flex h-full flex-col">
      <div
        ref={ref}
        className="flex-1 space-y-3 no-scrollbar overflow-y-auto p-4"
      >
        {displayedMessages.map((m: any, i: number) => (
          <div key={i} className="flex">
            <div
              className={`max-w-[80%] rounded-lg border break-words px-3 py-2 text-sm ${
                m.role === "assistant" 
                  ? "bg-muted" 
                  : "ml-auto bg-primary text-primary-foreground"
              }`}
            >
              {Array.isArray(m.content) ? (
                m.content?.map((cont: any, idx: number) => (
                  <div key={idx}>
                    {cont.type === "image_url" ? (
                      <img
                        className="my-2 max-h-96 w-auto rounded-md border"
                        alt="Generated"
                        src={cont.image_url.url}
                      />
                    ) : mode === "Coding" && m.role === "assistant" ? (
                      <div className="markdown-content">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]} 
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            code(props: any) {
                              const {inline, className, children, ...rest} = props;
                              return !inline ? (
                                <code className={className} {...rest}>
                                  {children}
                                </code>
                              ) : (
                                <code className="bg-muted px-1 py-0.5 rounded text-xs" {...rest}>
                                  {children}
                                </code>
                              );
                            },
                            pre(props: any) {
                              const {children, ...rest} = props;
                              return (
                                <pre className="bg-gray-900 rounded-md p-4 overflow-x-auto my-2" {...rest}>
                                  {children}
                                </pre>
                              );
                            },
                          }}
                        >
                          {cont.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <span className="whitespace-pre-wrap">{cont.text}</span>
                    )}
                  </div>
                ))
              ) : mode === "Coding" && m.role === "assistant" ? (
                <div className="markdown-content">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]} 
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      code(props: any) {
                        const {inline, className, children, ...rest} = props;
                        return !inline ? (
                          <code className={className} {...rest}>
                            {children}
                          </code>
                        ) : (
                          <code className="bg-muted px-1 py-0.5 rounded text-xs" {...rest}>
                            {children}
                          </code>
                        );
                      },
                      pre(props: any) {
                        const {children, ...rest} = props;
                        return (
                          <pre className="bg-gray-900 rounded-md p-4 overflow-x-auto my-2" {...rest}>
                            {children}
                          </pre>
                        );
                      },
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <span className="whitespace-pre-wrap">{m.content}</span>
              )}
            </div>
          </div>
        ))}
        {isSpeechLoading && (
          <div className="flex">
            <div className="max-w-[80%] rounded-lg border bg-muted px-3 py-2 text-sm">
              <span className="animate-pulse">AI is thinking</span>
              <span className="animate-pulse">...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}