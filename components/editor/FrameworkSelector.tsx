import { Button } from "@/components/ui/button";
import { FrameworkIcon, type Framework } from "@/components/FrameworkIcon";
import { Server } from "lucide-react";
import { type BackendFramework } from "@/app/utils/backend-templates";

/**
 * FrameworkSelector Component
 *
 * @description Renders a row of framework selection buttons.
 * Supports both frontend and backend frameworks with appropriate styling.
 *
 * @template T - The framework type (Framework | BackendFramework)
 *
 * @param {Object} props - Component props
 * @param {"frontend" | "backend"} props.mode - Display mode (affects button styling)
 * @param {Array<{value: T, label: string, color: string}>} props.frameworks - Array of framework options
 * @param {T} props.selected - Currently selected framework
 * @param {(framework: T) => void} props.onSelect - Callback when framework is selected
 *
 * @returns {JSX.Element} The framework selector buttons
 *
 * @example
 * ```tsx
 * // Frontend frameworks
 * <FrameworkSelector
 *   mode="frontend"
 *   frameworks={FRAMEWORKS}
 *   selected={selectedFramework}
 *   onSelect={setSelectedFramework}
 * />
 *
 * // Backend frameworks
 * <FrameworkSelector
 *   mode="backend"
 *   frameworks={BACKEND_FRAMEWORKS}
 *   selected={selectedBackendFramework}
 *   onSelect={setSelectedBackendFramework}
 * />
 * ```
 */
export function FrameworkSelector<T extends Framework | BackendFramework>({
  mode,
  frameworks,
  selected,
  onSelect,
}: {
  mode: "frontend" | "backend";
  frameworks: { value: T; label: string; color: string }[];
  selected: T;
  onSelect: (framework: T) => void;
}) {
  const isFrontend = mode === "frontend";
  const activeColor = isFrontend ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700";

  return (
    <div className="flex items-center gap-1">
      {frameworks.map((fw) => (
        <Button
          key={fw.value}
          onClick={() => onSelect(fw.value)}
          variant={selected === fw.value ? "default" : "ghost"}
          size="sm"
          className={`h-7 px-2 ${
            selected === fw.value
              ? activeColor
              : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800"
          }`}
        >
          {isFrontend ? (
            <FrameworkIcon framework={fw.value as Framework} />
          ) : (
            <Server className="w-3.5 h-3.5" />
          )}
          <span className="ml-1.5 text-xs">{fw.label}</span>
        </Button>
      ))}
    </div>
  );
}
