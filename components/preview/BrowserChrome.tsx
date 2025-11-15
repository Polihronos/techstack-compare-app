import { ChevronLeft, ChevronRight, RotateCw, Lock, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Simulates a browser navigation bar with back/forward buttons,
 * refresh button, address bar, and home button.
 *
 * @param {Object} props - Component props
 * @param {string} props.url - URL to display in the address bar
 * @param {boolean} props.isRefreshing - Whether the refresh operation is in progress
 * @param {() => void} props.onRefresh - Callback when refresh button is clicked
 *
 * @returns {JSX.Element} The browser chrome component
 *
 * @example
 * ```tsx
 * <BrowserChrome
 *   url="https://localhost:3000/preview/react"
 *   isRefreshing={false}
 *   onRefresh={handleRunCode}
 * />
 * ```
 */
export function BrowserChrome({
  url,
  isRefreshing,
  onRefresh,
}: {
  url: string;
  isRefreshing: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="bg-zinc-800 px-3 py-2 flex items-center gap-2 border-b border-zinc-700">
      {/* Navigation Buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700"
          disabled
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700"
          disabled
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RotateCw
            className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      {/* Address Bar */}
      <div className="flex-1 bg-zinc-900 rounded-md px-3 py-1.5 flex items-center gap-2 border border-zinc-700">
        <Lock className="w-3.5 h-3.5 text-green-500" />
        <span className="text-xs text-zinc-400 font-mono">
          {url}
        </span>
      </div>

      {/* Home Button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700"
        disabled
      >
        <HomeIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}
