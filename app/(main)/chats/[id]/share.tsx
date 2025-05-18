"use client";

import ShareIcon from "@/components/icons/share-icon";
import { toast } from "@/hooks/use-toast";
import { Message } from "@prisma/client";

export function Share({ message }: { message?: Message }) {
  async function shareAction() {
    if (!message) return;

    const baseUrl = window.location.href;
    const shareUrl = new URL(`/share/v2/${message.id}`, baseUrl);
    
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl.href);
        
        toast({
          title: "App Published!",
          description: `App URL copied to clipboard: ${shareUrl.href}`,
          variant: "default",
        });
      } else {
        // Fallback for browsers without clipboard API
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl.href;
        textarea.style.position = 'fixed';  // Prevent scrolling to bottom
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            toast({
              title: "App Published!",
              description: `App URL copied to clipboard: ${shareUrl.href}`,
              variant: "default",
            });
          } else {
            throw new Error('Fallback copy failed');
          }
        } catch (err) {
          toast({
            title: "Unable to copy automatically",
            description: `Please copy this URL manually: ${shareUrl.href}`,
            variant: "destructive",
          });
        } finally {
          document.body.removeChild(textarea);
        }
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast({
        title: "Copy failed",
        description: `Please copy this URL manually: ${shareUrl.href}`,
        variant: "destructive",
      });
    }
  }

  return (
    <form action={shareAction} className="flex">
      <button
        type="submit"
        disabled={!message}
        className="inline-flex items-center gap-1 rounded border border-gray-300 px-1.5 py-0.5 text-sm text-gray-600 enabled:hover:bg-white disabled:opacity-50"
      >
        <ShareIcon className="size-3" />
        Share
      </button>
    </form>
  );
}
