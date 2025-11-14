import { Sparkles, Monitor, Server } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Header Component
 *
 * @description Main application header with branding and mode toggle.
 * Allows users to switch between frontend and backend development modes.
 *
 * @param {Object} props - Component props
 * @param {"frontend" | "backend"} props.mode - Current mode (frontend or backend)
 * @param {(mode: "frontend" | "backend") => void} props.onModeChange - Callback when mode changes
 *
 * @returns {JSX.Element} The header component
 *
 * @example
 * ```tsx
 * <Header
 *   mode="frontend"
 *   onModeChange={(newMode) => setMode(newMode)}
 * />
 * ```
 */
export function Header({
  mode,
  onModeChange,
}: {
  mode: "frontend" | "backend";
  onModeChange: (mode: "frontend" | "backend") => void;
}) {
  return (
    <header className="flex items-center justify-between px-6 py-2 bg-zinc-900 border-b border-zinc-800">
      <div className="flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-blue-500" />
        <div>
          <h1 className="text-2xl font-bold text-white">
            Framework Playground
          </h1>
          <p className="text-xs text-zinc-400">
            Compare and test code across frameworks
          </p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center gap-2 bg-zinc-800 rounded-lg p-1">
        <Button
          onClick={() => onModeChange("frontend")}
          variant={mode === "frontend" ? "default" : "ghost"}
          size="sm"
          className={`h-8 px-3 ${
            mode === "frontend"
              ? "bg-blue-600 hover:bg-blue-700"
              : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          <Monitor className="w-4 h-4 mr-1.5" />
          Frontend
        </Button>
        <Button
          onClick={() => onModeChange("backend")}
          variant={mode === "backend" ? "default" : "ghost"}
          size="sm"
          className={`h-8 px-3 ${
            mode === "backend"
              ? "bg-green-600 hover:bg-green-700"
              : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          <Server className="w-4 h-4 mr-1.5" />
          Backend
        </Button>
      </div>
    </header>
  );
}
