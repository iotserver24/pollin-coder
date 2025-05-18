"use client";

import type { Chat, Message } from "./page";
import ArrowLeftIcon from "@/components/icons/arrow-left";
import { splitByFirstCodeFence } from "@/lib/utils";
import { Fragment } from "react";
import Markdown from "react-markdown";
import { StickToBottom } from "use-stick-to-bottom";

export default function ChatLog({
  chat,
  activeMessage,
  streamText,
  onMessageClick,
}: {
  chat: Chat;
  activeMessage?: Message;
  streamText: string;
  onMessageClick: (v: Message) => void;
}) {
  const assistantMessages = chat.messages.filter((m) => m.role === "assistant");

  return (
    <StickToBottom
      className="relative grow overflow-hidden"
      resize="smooth"
      initial="smooth"
    >
      <StickToBottom.Content className="mx-auto flex w-full max-w-prose flex-col gap-8 p-8">
        <UserMessage content={chat.prompt} />

        {chat.messages.slice(2).map((message) => (
          <Fragment key={message.id}>
            {message.role === "user" ? (
              <UserMessage content={message.content} />
            ) : (
              <AssistantMessage
                content={message.content}
                version={
                  assistantMessages.map((m) => m.id).indexOf(message.id) + 1
                }
                message={message}
                isActive={!streamText && activeMessage?.id === message.id}
                onMessageClick={onMessageClick}
              />
            )}
          </Fragment>
        ))}

        {streamText && (
          <AssistantMessage
            content={streamText}
            version={assistantMessages.length + 1}
            isActive={true}
          />
        )}
      </StickToBottom.Content>
    </StickToBottom>
  );
}

function UserMessage({ content }: { content: string }) {
  // Detect [Reference image: <url>] pattern
  const imageMatch = content.match(/\[Reference image: (https?:\/\/[^\]]+)\]/);
  let imageUrl = imageMatch ? imageMatch[1] : null;
  let messageText = imageMatch ? content.replace(imageMatch[0], '').trim() : content;

  return (
    <div className="relative inline-flex max-w-[80%] items-end gap-3 self-end">
      <div className="whitespace-pre-wrap rounded bg-gray-900 px-4 py-2 text-white shadow border border-purple-500/30">
        {imageUrl && (
          <img src={imageUrl} alt="Reference" className="mb-2 max-w-xs rounded" />
        )}
        {messageText}
      </div>
    </div>
  );
}

function AssistantMessage({
  content,
  version,
  message,
  isActive,
  onMessageClick = () => {},
}: {
  content: string;
  version: number;
  message?: Message;
  isActive?: boolean;
  onMessageClick?: (v: Message) => void;
}) {
  const parts = splitByFirstCodeFence(content);

  return (
    <div>
      {parts.map((part, i) => (
        <div key={i}>
          {part.type === "text" ? (
            <Markdown className="prose prose-invert">{part.content}</Markdown>
          ) : part.type === "first-code-fence-generating" ? (
            <div className="my-4">
              <button
                disabled
                className="inline-flex w-full animate-pulse items-center gap-2 rounded-lg border-4 border-purple-500/30 bg-gray-900 p-1.5 text-white"
              >
                <div className="flex size-8 items-center justify-center rounded bg-purple-500/30 font-bold text-white">
                  V{version}
                </div>
                <div className="flex flex-col gap-0.5 text-left leading-none text-white">
                  <div className="text-sm font-medium leading-none text-white">
                    Generating...
                  </div>
                </div>
              </button>
            </div>
          ) : message ? (
            <div className="my-4">
              <button
                className={`${
                  isActive 
                    ? "bg-gray-900 border-purple-500" 
                    : "bg-gray-900 border-purple-500/30 hover:border-purple-500/50 hover:bg-gray-800"
                } inline-flex w-full items-center gap-2 rounded-lg border-4 p-1.5 transition-colors text-white`}
                onClick={() => onMessageClick(message)}
              >
                <div
                  className={`${
                    isActive 
                      ? "bg-purple-500" 
                      : "bg-purple-500/30"
                  } flex size-8 items-center justify-center rounded font-bold text-white`}
                >
                  V{version}
                </div>
                <div className="flex flex-col gap-0.5 text-left leading-none text-white">
                  <div className="text-sm font-medium leading-none text-white">
                    {toTitleCase(part.filename.name)}{" "}
                    {version !== 1 && `v${version}`}
                  </div>
                  <div className="text-xs leading-none text-white">
                    {part.filename.name}
                    {version !== 1 && `-v${version}`}
                    {"."}
                    {part.filename.extension}
                  </div>
                </div>
                <div className="ml-auto">
                  <ArrowLeftIcon className="text-white" />
                </div>
              </button>
            </div>
          ) : (
            <div className="my-4">
              <button
                className="inline-flex w-full items-center gap-2 rounded-lg border-4 border-purple-500/30 bg-gray-900 p-1.5 text-white"
                disabled
              >
                <div className="flex size-8 items-center justify-center rounded bg-purple-500/30 font-bold text-white">
                  V{version}
                </div>
                <div className="flex flex-col gap-0.5 text-left leading-none text-white">
                  <div className="text-sm font-medium leading-none text-white">
                    {toTitleCase(part.filename.name)}{" "}
                    {version !== 1 && `v${version}`}
                  </div>
                  <div className="text-xs leading-none text-white">
                    {part.filename.name}
                    {version !== 1 && `-v${version}`}
                    {"."}
                    {part.filename.extension}
                  </div>
                </div>
                <div className="ml-auto">
                  <ArrowLeftIcon className="text-white" />
                </div>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function toTitleCase(rawName: string): string {
  // Split on one or more hyphens or underscores
  const parts = rawName.split(/[-_]+/);

  // Capitalize each part and join them back with spaces
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
