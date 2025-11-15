import { RefObject } from "react";
import dynamic from "next/dynamic";
import { Play, RotateCw, Server, Terminal as TerminalIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrowserChrome } from "./BrowserChrome";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { type Framework } from "@/components/FrameworkIcon";

const Terminal = dynamic(
  () =>
    import("@/components/terminal").then((mod) => ({ default: mod.Terminal })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-zinc-900 text-white">
        Loading terminal...
      </div>
    ),
  }
);

/**
 * Preview panel that displays either a frontend iframe preview
 * or a backend server preview with integrated terminal output.
 *
 * @param {Object} props - Component props
 * @param {"frontend" | "backend"} props.mode - Current mode (frontend or backend)
 * @param {Framework} props.selectedFramework - Selected frontend framework
 * @param {string} props.error - Error message to display
 * @param {boolean} props.isRunning - Whether code is currently executing
 * @param {boolean} props.autoRun - Whether auto-run is enabled
 * @param {() => void} props.onToggleAutoRun - Toggle auto-run callback
 * @param {() => void} props.onRefresh - Refresh/run code callback
 * @param {RefObject<HTMLIFrameElement | null>} props.iframeRef - Reference to the preview iframe
 * @param {string} props.serverUrl - Backend server URL
 *
 * @returns {JSX.Element} The preview panel component
 *
 * @example
 * ```tsx
 * <PreviewPanel
 *   mode="frontend"
 *   selectedFramework="react"
 *   error=""
 *   isRunning={false}
 *   autoRun={true}
 *   onToggleAutoRun={() => setAutoRun(!autoRun)}
 *   onRefresh={handleRunCode}
 *   iframeRef={iframeRef}
 *   serverUrl=""
 * />
 * ```
 */
export function PreviewPanel({
  mode,
  selectedFramework,
  error,
  isRunning,
  autoRun,
  onToggleAutoRun,
  onRefresh,
  iframeRef,
  serverUrl,
}: {
  mode: "frontend" | "backend";
  selectedFramework: Framework;
  error: string;
  isRunning: boolean;
  autoRun: boolean;
  onToggleAutoRun: () => void;
  onRefresh: () => void;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  serverUrl: string;
}) {
  const previewUrl =
    mode === "frontend"
      ? `https://localhost:3000/preview/${selectedFramework}`
      : serverUrl || `http://localhost:3001 (waiting...)`;

  return (
    <div className="flex flex-col h-full">
      {/* Preview Header */}
      <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {mode === "frontend" ? (
            <Play className="w-4 h-4 text-zinc-400" />
          ) : (
            <Play className="w-4 h-4 text-zinc-400" />
          )}
          <h2 className="text-sm font-semibold text-zinc-300">
            {mode === "frontend" ? "Live Preview" : "Live Preview"}
          </h2>
        </div>

        {/* Auto-run Toggle (Frontend) or Run Server Button (Backend) */}
        {mode === "frontend" ? (
          <Button
            onClick={onToggleAutoRun}
            variant={autoRun ? "default" : "ghost"}
            size="sm"
            className={`h-7 px-2 ${
              autoRun
                ? "bg-green-600 hover:bg-green-700"
                : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800"
            }`}
          >
            <RotateCw
              className={`w-3 h-3 ${autoRun ? "animate-spin" : ""}`}
            />
            <span className="ml-1.5 text-xs">
              {autoRun ? "Auto-run ON" : "Auto-run OFF"}
            </span>
          </Button>
        ) : (
          <Button
            onClick={onRefresh}
            variant="default"
            size="sm"
            disabled={isRunning}
            className="h-7 px-2 bg-green-600 hover:bg-green-700"
          >
            {isRunning ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Play className="w-3 h-3" />
            )}
            <span className="ml-1.5 text-xs">Run Server</span>
          </Button>
        )}
      </div>

      {/* Browser Chrome */}
      <BrowserChrome
        url={previewUrl}
        isRefreshing={isRunning}
        onRefresh={onRefresh}
      />

      {/* Preview Content */}
      {mode === "frontend" ? (
        <div className="flex-1 bg-white relative">
          {error && (
            <div className="absolute top-0 left-0 right-0 bg-red-50 border-b border-red-200 px-4 py-3 z-10">
              <div className="flex items-start gap-2">
                <span className="text-red-600 font-semibold text-sm">
                  Error:
                </span>
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            title="preview"
            sandbox="allow-scripts allow-modals allow-forms allow-pointer-lock allow-popups allow-same-origin"
            className="w-full h-full border-0"
          />
        </div>
      ) : (
        <ResizablePanelGroup direction="vertical" className="flex-1">
          {/* Server Preview Section */}
          <ResizablePanel defaultSize={75} minSize={40}>
            <div className="h-full bg-zinc-800 relative">
              {error && (
                <div className="absolute top-0 left-0 right-0 bg-red-900/20 border-b border-red-700 px-4 py-3 z-10">
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 font-semibold text-sm">
                      Error:
                    </span>
                    <span className="text-red-300 text-sm">{error}</span>
                  </div>
                </div>
              )}
              {serverUrl ? (
                <iframe
                  src={serverUrl}
                  title="Backend Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-400">
                  <div className="text-center">
                    <Server className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Server starting...</p>
                    <p className="text-xs mt-1 opacity-70">
                      Preview will appear here when ready
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Terminal Output Section */}
          <ResizablePanel defaultSize={25} minSize={15}>
            <div className="h-full bg-[#1e1e1e] flex flex-col">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#2d2d30] border-b border-[#3e3e42]">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-xs font-medium text-zinc-300">
                    Terminal
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-zinc-600 hover:bg-zinc-500 cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-zinc-600 hover:bg-zinc-500 cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-zinc-600 hover:bg-zinc-500 cursor-pointer" />
                </div>
              </div>
              {/* Terminal Content */}
              <div className="flex-1 overflow-hidden">
                <Terminal className="w-full h-full" />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
