/* eslint-disable @next/next/no-img-element */
"use client";

import Fieldset from "@/components/fieldset";
import ArrowRightIcon from "@/components/icons/arrow-right";
import LightningBoltIcon from "@/components/icons/lightning-bolt";
import LoadingButton from "@/components/loading-button";
import Spinner from "@/components/spinner";
import ThreeBackground from "@/components/ThreeBackground";
import ThreeBackgroundScene from "@/components/ThreeBackgroundScene";
import * as Select from "@radix-ui/react-select";
import assert from "assert";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState, useRef, useTransition, useEffect } from "react";
import { createChat } from "./actions";
import { Context } from "./providers";
import Header from "@/components/header";
import UploadIcon from "@/components/icons/upload-icon";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { MODELS, SUGGESTED_PROMPTS } from "@/lib/constants";
import { getPrisma } from "@/lib/prisma";

async function getProjectCount() {
  const prisma = getPrisma();
  return await prisma.chat.count();
}

export default function Home() {
  const { setStreamPromise } = use(Context);
  const router = useRouter();
  const [projectCount, setProjectCount] = useState<number>(0);
  const [isCountLoading, setIsCountLoading] = useState(true);

  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState(MODELS[0].value);
  const [quality, setQuality] = useState("high");
  const [screenshotUrl, setScreenshotUrl] = useState<string | undefined>(
    undefined,
  );
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const selectedModel = MODELS.find((m) => m.value === model);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [animationLoaded, setAnimationLoaded] = useState(false);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Trigger animations after component mounts
    setAnimationLoaded(true);

    // Fetch project count when component mounts
    const fetchProjectCount = async () => {
      setIsCountLoading(true);
      try {
        // Add timestamp to prevent caching
        const timestamp = Date.now();
        const response = await fetch(`/api/project-count?t=${timestamp}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProjectCount(data.count);
      } catch (err) {
        console.error('Failed to fetch project count:', err);
        // Retry once after a short delay
        setTimeout(async () => {
          try {
            const timestamp = Date.now();
            const response = await fetch(`/api/project-count?t=${timestamp}`, {
              method: 'GET',
              headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              setProjectCount(data.count);
            }
          } catch (retryErr) {
            console.error('Retry failed to fetch project count:', retryErr);
          } finally {
            setIsCountLoading(false);
          }
        }, 1000);
        return;
      } finally {
        setIsCountLoading(false);
      }
    };

    fetchProjectCount();
  }, []);

  const handleScreenshotUpload = async (event: any) => {
    if (prompt.length === 0) setPrompt("Build this");
    // Keep high quality by default even for screenshots
    // setQuality("low");
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

  const textareaResizePrompt = prompt
    .split("\n")
    .map((text) => (text === "" ? "a" : text))
    .join("\n");

  return (
    <div className="relative flex grow flex-col bg-black">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <ThreeBackgroundScene />
      </div>

      <div className="isolate flex h-full grow flex-col">
        <Header />

        <div className="mt-10 flex grow flex-col items-center px-4 lg:mt-16">
          <div
            className={`mb-4 inline-flex shrink-0 items-center rounded-full border-[0.5px] border-purple-500 bg-black px-7 py-2 text-xs text-purple-300 shadow-[0px_1px_1px_0px_rgba(168,85,247,0.35)] md:text-base opacity-0 ${
              animationLoaded ? "animate-fadeIn" : ""
            }`}
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            <span className="text-center">
              Created by <span className="font-semibold text-purple-400">pollinations ai</span> and
              <span className="font-semibold text-purple-400"> R3AP3R editz </span>
            </span>
          </div>

          <div
            className={`mt-2 text-center text-sm text-purple-300 opacity-0 ${
              animationLoaded ? "animate-fadeIn" : ""
            }`}
            style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
          >
            Total Projects Built:{" "}
            {isCountLoading ? (
              <span className="inline-flex items-center">
                <Spinner className="mr-1 size-3" />
                <span className="animate-pulse">Loading...</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <span className="font-semibold">{projectCount}</span>
                <button
                  onClick={() => {
                    setIsCountLoading(true);
                    const timestamp = Date.now();
                    fetch(`/api/project-count?t=${timestamp}`, {
                      method: 'GET',
                      headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                      }
                    })
                    .then(res => res.json())
                    .then(data => {
                      setProjectCount(data.count);
                      setIsCountLoading(false);
                    })
                    .catch(err => {
                      console.error('Failed to refresh project count:', err);
                      setIsCountLoading(false);
                    });
                  }}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                  title="Refresh count"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </span>
            )}
          </div>

          <h1 
            className={`mt-4 text-balance text-center text-4xl leading-none text-white md:text-[64px] lg:mt-8 opacity-0 ${
              animationLoaded ? "animate-slideUp" : ""
            }`}
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            Turn your <span className="text-purple-500">idea</span>
            <br className="hidden md:block" /> into an{" "}
            <span className="text-purple-500">app</span>
          </h1>

          <form
            className={`relative w-full max-w-2xl pt-6 lg:pt-12 opacity-0 ${
              animationLoaded ? "animate-slideUp" : ""
            }`}
            style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
            action={async (formData) => {
              startTransition(async () => {
                const { prompt, model, quality } = Object.fromEntries(formData);

                assert.ok(typeof prompt === "string");
                assert.ok(typeof model === "string");
                assert.ok(quality === "high" || quality === "low");

                const { chatId, lastMessageId } = await createChat(
                  prompt,
                  model,
                  quality,
                  screenshotUrl,
                );

                const streamPromise = fetch(
                  "/api/get-next-completion-stream-promise",
                  {
                    method: "POST",
                    body: JSON.stringify({ messageId: lastMessageId, model }),
                  },
                ).then((res) => {
                  if (!res.body) {
                    throw new Error("No body on response");
                  }
                  return res.body;
                });

                startTransition(() => {
                  setStreamPromise(streamPromise);
                  router.push(`/chats/${chatId}`);
                });
              });
            }}
          >
            <Fieldset>
              <div className="relative flex w-full max-w-2xl rounded-xl border-4 border-purple-500 bg-gray-900 pb-10 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-shadow duration-300">
                <div className="w-full">
                  {screenshotLoading && (
                    <div className="relative mx-3 mt-3">
                      <div className="rounded-xl">
                        <div className="group mb-2 flex h-16 w-[68px] animate-pulse items-center justify-center rounded bg-gray-700">
                          <Spinner />
                        </div>
                      </div>
                    </div>
                  )}
                  {screenshotUrl && (
                    <div
                      className={`${isPending ? "invisible" : ""} relative mx-3 mt-3`}
                    >
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
                  <div className="relative">
                    <div className="p-3">
                      <p className="invisible w-full whitespace-pre-wrap">
                        {textareaResizePrompt}
                      </p>
                    </div>
                    <textarea
                      placeholder="Build me a budgeting app..."
                      required
                      name="prompt"
                      rows={1}
                      className="peer absolute inset-0 w-full resize-none bg-transparent p-3 text-white placeholder-gray-400 focus-visible:outline-none disabled:opacity-50"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
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
                </div>
                <div className="absolute bottom-2 left-2 right-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
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
                        <Select.Content className="overflow-hidden rounded-md bg-gray-900 shadow ring-1 ring-purple-500/20">
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

                    <div className="h-4 w-px bg-gray-700 max-sm:hidden" />

                    {/* Quality selector commented out - using high quality by default 
                    <Select.Root
                      name="quality"
                      value={quality}
                      onValueChange={setQuality}
                    >
                      <Select.Trigger className="inline-flex items-center gap-1 rounded p-1 text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-500 transition-colors">
                        <Select.Value aria-label={quality}>
                          <span className="max-sm:hidden">
                            {quality === "low"
                              ? "Low quality [faster]"
                              : "High quality [slower]"}
                          </span>
                          <span className="sm:hidden">
                            <LightningBoltIcon className="size-3" />
                          </span>
                        </Select.Value>
                        <Select.Icon>
                          <ChevronDownIcon className="size-3" />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="overflow-hidden rounded-md bg-gray-900 shadow ring-1 ring-purple-500/20">
                          <Select.Viewport className="space-y-1 p-2">
                            {[
                              { value: "low", label: "Low quality [faster]" },
                              {
                                value: "high",
                                label: "High quality [slower]",
                              },
                            ].map((q) => (
                              <Select.Item
                                key={q.value}
                                value={q.value}
                                className="flex cursor-pointer items-center gap-1 rounded-md p-1 text-sm text-gray-300 data-[highlighted]:bg-gray-800 data-[highlighted]:outline-none transition-colors"
                              >
                                <Select.ItemText className="inline-flex items-center gap-2 text-gray-300">
                                  {q.label}
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
                    */}
                    
                    {/* Hidden input to maintain form functionality */}
                    <input type="hidden" name="quality" value={quality} />
                    
                    <div className="h-4 w-px bg-gray-700 max-sm:hidden" />
                    <div>
                      <label
                        htmlFor="screenshot"
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
                        // name="screenshot"
                        id="screenshot"
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleScreenshotUpload}
                        className="hidden"
                        ref={fileInputRef}
                      />
                    </div>
                  </div>

                  <div className="relative flex shrink-0 has-[:disabled]:opacity-50">
                    <div className="pointer-events-none absolute inset-0 -bottom-[1px] rounded bg-purple-600" />

                    <LoadingButton
                      className="relative inline-flex size-6 items-center justify-center rounded bg-purple-600 font-medium text-white shadow-lg outline-purple-300 hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all hover:shadow-[0_0_10px_rgba(168,85,247,0.8)] hover:scale-110"
                      type="submit"
                    >
                      <ArrowRightIcon />
                    </LoadingButton>
                  </div>
                </div>

                {isPending && (
                  <LoadingMessage
                    isHighQuality={quality === "high"}
                    screenshotUrl={screenshotUrl}
                  />
                )}
              </div>
              <div 
                className={`mt-4 flex w-full flex-wrap justify-center gap-3 opacity-0 ${
                  animationLoaded ? "animate-fadeIn" : ""
                }`} 
                style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
              >
                {SUGGESTED_PROMPTS.map((v, index) => (
                  <button
                    key={v.title}
                    type="button"
                    onClick={() => setPrompt(v.description)}
                    className="rounded bg-gray-800 px-2.5 py-1.5 text-xs text-gray-300 hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 transition-all hover:shadow-[0_0_10px_rgba(168,85,247,0.5)] hover:scale-105"
                    style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </Fieldset>
          </form>
        </div>

        <footer 
          className={`flex w-full flex-col items-center justify-between space-y-3 px-5 pb-3 pt-5 text-center text-gray-400 sm:flex-row sm:pt-2 opacity-0 ${
            animationLoaded ? "animate-fadeIn" : ""
          }`}
          style={{ animationDelay: "1s", animationFillMode: "forwards" }}
        >
          <div>
            <div className="font-medium">
              Built by{" "}
              <a
                href="#"
                className="font-semibold text-purple-400 underline-offset-4 transition hover:text-purple-300 hover:underline"
              >
                pollinations ai
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="font-semibold text-purple-400 underline-offset-4 transition hover:text-purple-300 hover:underline"
              >
                R3AP3R editz
              </a>
              .
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function LoadingMessage({
  isHighQuality,
  screenshotUrl,
}: {
  isHighQuality: boolean;
  screenshotUrl: string | undefined;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-gray-900 px-1 py-3 md:px-3 animate-fadeIn">
      <div className="flex flex-col items-center justify-center gap-2 text-gray-300">
        <span className="animate-pulse text-balance text-center text-sm md:text-base">
          {isHighQuality
            ? `Coming up with project plan, may take 15 seconds...`
            : screenshotUrl
              ? "Analyzing your screenshot..."
              : `Creating your app...`}
        </span>

        <Spinner />
      </div>
    </div>
  );
}

// export const runtime = "edge";
export const maxDuration = 45;
