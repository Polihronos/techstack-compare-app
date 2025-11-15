import { Code, FileCode, Layers } from "lucide-react";
import dynamic from "next/dynamic";
import { FrameworkSelector } from "./FrameworkSelector";
import { FileExplorer } from "./FileExplorer";
import { Button } from "@/components/ui/button";
import { type Framework } from "@/components/FrameworkIcon";
import { type BackendFrameworkId } from "@/src/frameworks/types";

// Type alias for compatibility
type BackendFramework = BackendFrameworkId;

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-zinc-900 text-white">
      Loading editor...
    </div>
  ),
});

/**
 * Get the appropriate Monaco editor language based on framework
 */
const getEditorLanguage = (framework: Framework): string => {
  const languageMap: Record<Framework, string> = {
    vanilla: "javascript",
    react: "javascript",
    vue: "javascript",
    svelte: "html",
    angular: "javascript",
  };
  return languageMap[framework];
};

/**
 * Get Monaco editor language based on file extension
 */
const getLanguageFromFilename = (filename: string): string => {
  if (filename.endsWith('.json')) return 'json';
  if (filename.endsWith('.md')) return 'markdown';
  if (filename.endsWith('.js')) return 'javascript';
  if (filename.endsWith('.ts')) return 'typescript';
  if (filename.endsWith('.tsx')) return 'typescript';
  if (filename.endsWith('.jsx')) return 'javascript';
  if (filename.endsWith('.svelte')) return 'html';
  if (filename.endsWith('.vue')) return 'html';
  if (filename.endsWith('.html')) return 'html';
  if (filename.endsWith('.css')) return 'css';
  return 'javascript';
};

/**
 * Code editor panel with framework selector and Monaco editor.
 * Supports both frontend and backend modes with appropriate framework options.
 *
 * @param {Object} props - Component props
 * @param {"frontend" | "backend"} props.mode - Current mode (frontend or backend)
 * @param {Framework} props.selectedFramework - Selected frontend framework
 * @param {(framework: Framework) => void} props.onFrameworkChange - Frontend framework change handler
 * @param {BackendFramework} props.selectedBackendFramework - Selected backend framework
 * @param {(framework: BackendFramework) => void} props.onBackendFrameworkChange - Backend framework change handler
 * @param {string} props.code - Current code content
 * @param {(code: string) => void} props.onCodeChange - Code change handler
 * @param {Array} props.frontendFrameworks - Available frontend frameworks
 * @param {Array} props.backendFrameworks - Available backend frameworks
 * @param {"simple" | "advanced"} props.frontendViewMode - Frontend view mode
 * @param {(mode: "simple" | "advanced") => void} props.onFrontendViewModeChange - View mode change handler
 * @param {Record<string, string>} props.frontendFiles - Frontend file structure
 * @param {string} props.selectedFrontendFile - Selected frontend file
 * @param {(filename: string) => void} props.onFrontendFileSelect - Frontend file selection handler
 * @param {Record<string, string>} props.backendFiles - Backend file structure
 * @param {string} props.selectedBackendFile - Selected backend file
 * @param {(filename: string) => void} props.onBackendFileSelect - Backend file selection handler
 *
 * @returns {JSX.Element} The editor panel component
 *
 * @example
 * ```tsx
 * <EditorPanel
 *   mode="frontend"
 *   selectedFramework="react"
 *   onFrameworkChange={setSelectedFramework}
 *   code={code}
 *   onCodeChange={setCode}
 *   frontendFrameworks={FRAMEWORKS}
 *   backendFrameworks={BACKEND_FRAMEWORKS}
 * />
 * ```
 */
export function EditorPanel({
  mode,
  selectedFramework,
  onFrameworkChange,
  selectedBackendFramework,
  onBackendFrameworkChange,
  code,
  onCodeChange,
  frontendFrameworks,
  backendFrameworks,
  frontendViewMode,
  onFrontendViewModeChange,
  frontendFiles,
  selectedFrontendFile,
  onFrontendFileSelect,
  backendFiles,
  selectedBackendFile,
  onBackendFileSelect,
}: {
  mode: "frontend" | "backend";
  selectedFramework: Framework;
  onFrameworkChange: (framework: Framework) => void;
  selectedBackendFramework: BackendFramework;
  onBackendFrameworkChange: (framework: BackendFramework) => void;
  code: string;
  onCodeChange: (code: string) => void;
  frontendFrameworks: { value: Framework; label: string; color: string }[];
  backendFrameworks: { value: BackendFramework; label: string; color: string }[];
  frontendViewMode: "simple" | "advanced";
  onFrontendViewModeChange: (mode: "simple" | "advanced") => void;
  frontendFiles: Record<string, string>;
  selectedFrontendFile: string;
  onFrontendFileSelect: (filename: string) => void;
  backendFiles: Record<string, string>;
  selectedBackendFile: string;
  onBackendFileSelect: (filename: string) => void;
}) {
  // Always show file explorer (backend mode or any frontend mode)
  const showFileExplorer = mode === "backend" || mode === "frontend";

  return (
    <div className="flex h-full">
      {/* File Explorer Sidebar */}
      {showFileExplorer && (
        <div className="w-48 flex-shrink-0">
          <FileExplorer
            files={mode === "frontend" ? frontendFiles : backendFiles}
            selectedFile={mode === "frontend" ? selectedFrontendFile : selectedBackendFile}
            onFileSelect={mode === "frontend" ? onFrontendFileSelect : onBackendFileSelect}
          />
        </div>
      )}

      {/* Editor Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
      {/* Editor Header */}
      <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-3 flex-shrink-0">
          <Code className="w-4 h-4 text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-300">
            Code Editor
          </h2>

          {/* View Mode Toggle - Frontend Only */}
          {mode === "frontend" && (
            <div className="flex items-center gap-1 bg-zinc-800 rounded-md p-0.5">
              <Button
                onClick={() => onFrontendViewModeChange("simple")}
                variant="ghost"
                size="sm"
                className={`h-6 px-2 text-xs ${
                  frontendViewMode === "simple"
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-400 hover:text-zinc-300"
                }`}
              >
                <FileCode className="w-3 h-3 mr-1" />
                Simple
              </Button>
              <Button
                onClick={() => onFrontendViewModeChange("advanced")}
                variant="ghost"
                size="sm"
                className={`h-6 px-2 text-xs ${
                  frontendViewMode === "advanced"
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-400 hover:text-zinc-300"
                }`}
              >
                <Layers className="w-3 h-3 mr-1" />
                Advanced
              </Button>
            </div>
          )}
        </div>

        {/* Framework Selector */}
        <div className="flex-shrink-0">
        {mode === "frontend" ? (
          <FrameworkSelector
            mode="frontend"
            frameworks={frontendFrameworks}
            selected={selectedFramework}
            onSelect={onFrameworkChange}
          />
        ) : (
          <FrameworkSelector
            mode="backend"
            frameworks={backendFrameworks}
            selected={selectedBackendFramework}
            onSelect={onBackendFrameworkChange}
          />
        )}
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <MonacoEditor
          height="100%"
          language={
            mode === "frontend"
              ? getLanguageFromFilename(selectedFrontendFile)
              : getLanguageFromFilename(selectedBackendFile)
          }
          theme="vs-dark"
          value={code}
          onChange={(value) => onCodeChange(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
      </div>
    </div>
  );
}
