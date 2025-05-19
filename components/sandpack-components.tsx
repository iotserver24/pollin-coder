"use client";

import {
  SandpackProvider,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react/unstyled";
import { useState, useEffect } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

interface SandpackComponentsProps {
  code: string;
  onRequestFix?: (error: string) => void;
  dependencies: Record<string, string>;
  shadcnFiles: Record<string, string>;
}

export default function SandpackComponents({
  code,
  onRequestFix,
  dependencies,
  shadcnFiles,
}: SandpackComponentsProps) {
  const ErrorMessage = ({ onRequestFix }: { onRequestFix: (e: string) => void }) => {
    const { sandpack } = useSandpack();
    const [didCopy, setDidCopy] = useState(false);
  
    if (!sandpack.error) return null;
  
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/5 text-base backdrop-blur-sm">
        <div className="max-w-[400px] rounded-md bg-red-500 p-4 text-white shadow-xl shadow-black/20">
          <p className="text-lg font-medium">Error</p>
  
          <p className="mt-4 line-clamp-[10] overflow-x-auto whitespace-pre font-mono text-xs">
            {sandpack.error.message}
          </p>
  
          <div className="mt-8 flex justify-between gap-4">
            <button
              onClick={async () => {
                if (!sandpack.error) return;
  
                setDidCopy(true);
                await window.navigator.clipboard.writeText(
                  sandpack.error.message,
                );
                await new Promise((resolve) => setTimeout(resolve, 2000));
                setDidCopy(false);
              }}
              className="rounded border-red-300 px-2.5 py-1.5 text-sm font-semibold text-red-50"
            >
              {didCopy ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
            </button>
            <button
              onClick={() => {
                if (!sandpack.error) return;
                onRequestFix(sandpack.error.message);
              }}
              className="rounded bg-white px-2.5 py-1.5 text-sm font-medium text-black"
            >
              Try to fix
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Force a minimum loading time to ensure our animation shows
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Set a minimum loading time of 2 seconds
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <div className="mb-6 text-xl font-medium text-purple-600">Loading code preview...</div>
          <div className="flex justify-center space-x-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold animate-bounce" style={{ animationDelay: "0ms", animationDuration: "1s" }}>1</div>
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold animate-bounce" style={{ animationDelay: "300ms", animationDuration: "1s" }}>2</div>
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold animate-bounce" style={{ animationDelay: "600ms", animationDuration: "1s" }}>3</div>
          </div>
          <div className="h-3 w-64 bg-gray-200 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-purple-500 animate-pulse" style={{ animationDuration: "1.5s" }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SandpackProvider
      key={code}
      template="react-ts"
      className="relative h-full w-full [&_.sp-preview-container]:flex [&_.sp-preview-container]:h-full [&_.sp-preview-container]:w-full [&_.sp-preview-container]:grow [&_.sp-preview-container]:flex-col [&_.sp-preview-container]:justify-center [&_.sp-preview-iframe]:grow"
      files={{
        "App.tsx": code,
        ...shadcnFiles,
        "/tsconfig.json": {
          code: `{
            "include": [
              "./**/*"
            ],
            "compilerOptions": {
              "strict": true,
              "esModuleInterop": true,
              "lib": [ "dom", "es2015" ],
              "jsx": "react-jsx",
              "baseUrl": "./",
              "paths": {
                "@/components/*": ["components/*"]
              }
            }
          }
        `,
        },
      }}
      options={{
        externalResources: [
          "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
        ],
      }}
      customSetup={{
        dependencies,
      }}
    >
      <SandpackPreview
        showNavigator={false}
        showOpenInCodeSandbox={false}
        showRefreshButton={false}
        showRestartButton={false}
        showOpenNewtab={false}
        className="h-full w-full"
      />
      {onRequestFix && <ErrorMessage onRequestFix={onRequestFix} />}
    </SandpackProvider>
  );
} 