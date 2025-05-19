"use client";

import * as shadcnComponents from "@/lib/shadcn";
import dedent from "dedent";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";

// Simple code viewer component as fallback
function SimpleCodeViewer({ code }: { code: string }) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("code");

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex border-b border-gray-200 p-2">
        <button
          onClick={() => setActiveTab("code")}
          className={`px-3 py-1 rounded-md ${
            activeTab === "code" ? "bg-gray-200" : ""
          }`}
        >
          Code
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`px-3 py-1 ml-2 rounded-md ${
            activeTab === "preview" ? "bg-gray-200" : ""
          }`}
        >
          Preview (Unavailable)
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {activeTab === "code" ? (
          <pre className="text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-md overflow-auto">
            <code>{code}</code>
          </pre>
        ) : (
          <div className="p-4 bg-red-50 rounded-md border border-red-200">
            <h3 className="text-lg font-medium text-red-800 mb-2">Preview Error</h3>
            <p className="text-sm text-red-600">
              Unable to preview the code. The code sandbox could not be initialized.
              The code is still displayed in the {"\""} Code {"\""} tab.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReactCodeRunner({
  code,
  onRequestFix,
}: {
  code: string;
  onRequestFix?: (e: string) => void;
}) {
  const [hasError, setHasError] = useState(false);

  // Use simple code viewer when there's an error
  if (hasError) {
    return <SimpleCodeViewer code={code} />;
  }

  return (
    <ErrorBoundary 
      fallbackRender={({ error }) => {
        console.error("Sandpack error:", error);
        if (onRequestFix) {
          // Only call onRequestFix if it's available
          onRequestFix(error.message || "Unknown error in code sandbox");
        }
        return <SimpleCodeViewer code={code} />;
      }}
      onError={() => setHasError(true)}
    >
      <SandpackWrapper code={code} onRequestFix={onRequestFix} />
    </ErrorBoundary>
  );
}

// Import Sandpack in a separate component to better handle errors
import dynamic from "next/dynamic";

const DynamicSandpack = dynamic(
  () => import("./sandpack-components"),
  {
    ssr: false,
    loading: () => (
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
    ),
  }
);

function SandpackWrapper({ code, onRequestFix }: { code: string; onRequestFix?: (e: string) => void }) {
  return <DynamicSandpack code={code} onRequestFix={onRequestFix} dependencies={dependencies} shadcnFiles={shadcnFiles} />;
}

const shadcnFiles = {
  "/lib/utils.ts": shadcnComponents.utils,
  "/components/ui/accordion.tsx": shadcnComponents.accordian,
  "/components/ui/alert-dialog.tsx": shadcnComponents.alertDialog,
  "/components/ui/alert.tsx": shadcnComponents.alert,
  "/components/ui/avatar.tsx": shadcnComponents.avatar,
  "/components/ui/badge.tsx": shadcnComponents.badge,
  "/components/ui/breadcrumb.tsx": shadcnComponents.breadcrumb,
  "/components/ui/button.tsx": shadcnComponents.button,
  "/components/ui/calendar.tsx": shadcnComponents.calendar,
  "/components/ui/card.tsx": shadcnComponents.card,
  "/components/ui/carousel.tsx": shadcnComponents.carousel,
  "/components/ui/checkbox.tsx": shadcnComponents.checkbox,
  "/components/ui/collapsible.tsx": shadcnComponents.collapsible,
  "/components/ui/dialog.tsx": shadcnComponents.dialog,
  "/components/ui/drawer.tsx": shadcnComponents.drawer,
  "/components/ui/dropdown-menu.tsx": shadcnComponents.dropdownMenu,
  "/components/ui/input.tsx": shadcnComponents.input,
  "/components/ui/label.tsx": shadcnComponents.label,
  "/components/ui/menubar.tsx": shadcnComponents.menuBar,
  "/components/ui/navigation-menu.tsx": shadcnComponents.navigationMenu,
  "/components/ui/pagination.tsx": shadcnComponents.pagination,
  "/components/ui/popover.tsx": shadcnComponents.popover,
  "/components/ui/progress.tsx": shadcnComponents.progress,
  "/components/ui/radio-group.tsx": shadcnComponents.radioGroup,
  "/components/ui/select.tsx": shadcnComponents.select,
  "/components/ui/separator.tsx": shadcnComponents.separator,
  "/components/ui/skeleton.tsx": shadcnComponents.skeleton,
  "/components/ui/slider.tsx": shadcnComponents.slider,
  "/components/ui/switch.tsx": shadcnComponents.switchComponent,
  "/components/ui/table.tsx": shadcnComponents.table,
  "/components/ui/tabs.tsx": shadcnComponents.tabs,
  "/components/ui/textarea.tsx": shadcnComponents.textarea,
  "/components/ui/toast.tsx": shadcnComponents.toast,
  "/components/ui/toaster.tsx": shadcnComponents.toaster,
  "/components/ui/toggle-group.tsx": shadcnComponents.toggleGroup,
  "/components/ui/toggle.tsx": shadcnComponents.toggle,
  "/components/ui/tooltip.tsx": shadcnComponents.tooltip,
  "/components/ui/use-toast.tsx": shadcnComponents.useToast,
  "/components/ui/index.tsx": `
  export * from "./button"
  export * from "./card"
  export * from "./input"
  export * from "./label"
  export * from "./select"
  export * from "./textarea"
  export * from "./avatar"
  export * from "./radio-group"
  `,
  "/public/index.html": dedent`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  `,
};

const dependencies = {
  "lucide-react": "latest",
  recharts: "2.9.0",
  "react-router-dom": "latest",
  "@radix-ui/react-accordion": "^1.2.0",
  "@radix-ui/react-alert-dialog": "^1.1.1",
  "@radix-ui/react-aspect-ratio": "^1.1.0",
  "@radix-ui/react-avatar": "^1.1.0",
  "@radix-ui/react-checkbox": "^1.1.1",
  "@radix-ui/react-collapsible": "^1.1.0",
  "@radix-ui/react-dialog": "^1.1.1",
  "@radix-ui/react-dropdown-menu": "^2.1.1",
  "@radix-ui/react-hover-card": "^1.1.1",
  "@radix-ui/react-label": "^2.1.0",
  "@radix-ui/react-menubar": "^1.1.1",
  "@radix-ui/react-navigation-menu": "^1.2.0",
  "@radix-ui/react-popover": "^1.1.1",
  "@radix-ui/react-progress": "^1.1.0",
  "@radix-ui/react-radio-group": "^1.2.0",
  "@radix-ui/react-select": "^2.1.1",
  "@radix-ui/react-separator": "^1.1.0",
  "@radix-ui/react-slider": "^1.2.0",
  "@radix-ui/react-slot": "^1.1.0",
  "@radix-ui/react-switch": "^1.1.0",
  "@radix-ui/react-tabs": "^1.1.0",
  "@radix-ui/react-toast": "^1.2.1",
  "@radix-ui/react-toggle": "^1.1.0",
  "@radix-ui/react-toggle-group": "^1.1.0",
  "@radix-ui/react-tooltip": "^1.1.2",
  "class-variance-authority": "^0.7.0",
  clsx: "^2.1.1",
  "date-fns": "^3.6.0",
  "embla-carousel-react": "^8.1.8",
  "react-day-picker": "^8.10.1",
  "tailwind-merge": "^2.4.0",
  "tailwindcss-animate": "^1.0.7",
  "framer-motion": "^11.15.0",
  vaul: "^0.9.1",
};
