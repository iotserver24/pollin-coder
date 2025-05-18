"use client";

import ArrowRightIcon from "@/components/icons/arrow-right";
import Spinner from "@/components/spinner";
import assert from "assert";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { createMessage } from "../../actions";
import { type Chat } from "./page";
import * as Select from "@radix-ui/react-select";
import { MODELS } from "@/lib/constants";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import UploadIcon from "@/components/icons/upload-icon";
import { XCircleIcon } from "@heroicons/react/20/solid";

export default function ChatBox({
  chat,
  onNewStreamPromise,
  isStreaming,
}: {
  chat: Chat;
  onNewStreamPromise: (v: Promise<ReadableStream>) => void;
  isStreaming: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const disabled = isPending || isStreaming;
  const didFocusOnce = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState(chat.model);
  const [screenshotUrl, setScreenshotUrl] = useState<string | undefined>(
    undefined,
  );
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const selectedModel = MODELS.find((m) => m.value === model);
  
  const textareaResizePrompt = prompt
    .split("\n")
    .map((text) => (text === "" ? "a" : text))
    .join("\n");

  useEffect(() => {
    if (!textareaRef.current) return;

    if (!disabled && !didFocusOnce.current) {
      textareaRef.current.focus();
      didFocusOnce.current = true;
    } else {
      didFocusOnce.current = false;
    }
  }, [disabled]);

  const handleScreenshotUpload = async (event: any) => {
    setScreenshotLoading(true);
    let file = event.target.files[0];
    
    // Create form data
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      setScreenshotUrl(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setScreenshotLoading(false);
    }
  };

  return (
    <div className="mx-auto mb-5 flex w-full max-w-prose shrink-0 px-8">
      <form
        className="relative flex w-full flex-col gap-2"
        action={async () => {
          startTransition(async () => {
            let messageText = prompt;
            
            // Add the screenshot URL to the message if it exists
            if (screenshotUrl) {
              messageText = `[Reference image: ${screenshotUrl}]\n\n${messageText}`;
            }
            
            const message = await createMessage(chat.id, messageText, "user");
            const streamPromise = fetch(
              "/api/get-next-completion-stream-promise",
              {
                method: "POST",
                body: JSON.stringify({
                  messageId: message.id,
                  model: model, // Use the selected model
                }),
              },
            ).then((res) => {
              if (!res.body) {
                throw new Error("No body on response");
              }
              return res.body;
            });

            onNewStreamPromise(streamPromise);
            startTransition(() => {
              router.refresh();
              setPrompt("");
              setScreenshotUrl(undefined);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            });
          });
        }}
      >
        <div className="flex items-center gap-2">
          <Select.Root
            name="model"
            value={model}
            onValueChange={setModel}
          >
            <Select.Trigger className="inline-flex items-center gap-1 rounded-md p-1 text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-500 transition-colors">
              <Select.Value aria-label={model}>
                <span>{selectedModel?.label}</span>
              </Select.Value>
              <Select.Icon>
                <ChevronDownIcon className="size-3" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="overflow-hidden rounded-md bg-black/80 shadow ring-1 ring-purple-500/20 z-[9999]">
                <Select.Viewport className="space-y-1 p-2">
                  {MODELS.map((m) => (
                    <Select.Item
                      key={m.value}
                      value={m.value}
                      className="flex cursor-pointer items-center gap-1 rounded-md p-1 text-sm text-gray-300 data-[highlighted]:bg-gray-800 data-[highlighted]:outline-none transition-colors"
                    >
                      <Select.ItemText className="inline-flex items-center gap-2 text-gray-300">
                        {m.label}
                      </Select.ItemText>
                      <Select.ItemIndicator>
                        <CheckIcon className="size-3 text-purple-500" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
                <Select.ScrollDownButton />
                <Select.Arrow />
              </Select.Content>
            </Select.Portal>
          </Select.Root>
          
          <div>
            <label
              htmlFor="chat-screenshot"
              className="flex cursor-pointer gap-2 text-sm text-gray-400 hover:underline"
            >
              <div className="flex size-6 items-center justify-center rounded bg-purple-800 hover:bg-purple-700 transition-colors">
                <UploadIcon className="size-4" />
              </div>
              <div className="flex items-center justify-center transition hover:text-gray-300">
                Attach
              </div>
            </label>
            <input
              id="chat-screenshot"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleScreenshotUpload}
              className="hidden"
              ref={fileInputRef}
            />
          </div>
        </div>
        
        {screenshotLoading && (
          <div className="relative">
            <div className="rounded-xl">
              <div className="group mb-2 flex h-16 w-[68px] animate-pulse items-center justify-center rounded bg-gray-700">
                <Spinner />
              </div>
            </div>
          </div>
        )}
        
        {screenshotUrl && (
          <div className="relative">
            <div className="rounded-xl">
              <img
                alt="screenshot"
                src={screenshotUrl}
                className="group relative mb-2 h-16 w-[68px] rounded"
              />
            </div>
            <button
              type="button"
              id="x-circle-icon"
              aria-label="Remove screenshot"
              className="absolute -right-3 -top-4 left-14 z-10 size-5 rounded-full bg-gray-700 text-white hover:text-gray-300 hover:bg-gray-600 transition-colors"
              onClick={() => {
                setScreenshotUrl(undefined);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            >
              <XCircleIcon />
            </button>
          </div>
        )}

        <fieldset className="w-full" disabled={disabled}>
          <div className="relative flex rounded-lg border-4 border-purple-500 bg-gray-900 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-shadow duration-300">
            <div className="relative w-full">
              <div className="w-full p-2">
                <p className="invisible min-h-[48px] w-full whitespace-pre-wrap">
                  {textareaResizePrompt}
                </p>
              </div>
              <textarea
                ref={textareaRef}
                placeholder="Follow up"
                autoFocus={!disabled}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                name="prompt"
                className="peer absolute inset-0 w-full resize-none bg-transparent p-2 text-white placeholder-gray-400 focus:outline-none disabled:opacity-50"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    const target = event.target;
                    if (!(target instanceof HTMLTextAreaElement)) return;
                    target.closest("form")?.requestSubmit();
                  }
                }}
              />
            </div>
            <div className="pointer-events-none absolute inset-0 rounded peer-focus:outline peer-focus:outline-offset-0 peer-focus:outline-purple-500" />

            <div className="absolute bottom-1.5 right-1.5 flex has-[:disabled]:opacity-50">
              <div className="pointer-events-none absolute inset-0 -bottom-[1px] rounded bg-purple-600" />

              <button
                className="relative inline-flex size-6 items-center justify-center rounded bg-purple-600 font-medium text-white shadow-lg outline-purple-300 hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all hover:shadow-[0_0_10px_rgba(168,85,247,0.8)] hover:scale-110"
                type="submit"
                aria-label="Send message"
              >
                <Spinner loading={disabled}>
                  <ArrowRightIcon />
                </Spinner>
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
