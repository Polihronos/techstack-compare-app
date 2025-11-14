"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { FrameworkIcon, type Framework } from "@/components/FrameworkIcon";
import { FRONTEND_TEMPLATES, SIMPLE_TEMPLATES } from "./utils/templates";
import { BACKEND_TEMPLATES, type BackendFramework } from "./utils/backend-templates";
import { type TerminalOutput } from "./utils/webcontainer-executor";
import { useCodeExecution } from "@/hooks/useCodeExecution";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Server } from "lucide-react";

const FRAMEWORKS: { value: Framework; label: string; color: string }[] = [
  { value: "vanilla", label: "Vanilla JS", color: "bg-yellow-500" },
  { value: "react", label: "React", color: "bg-blue-500" },
  { value: "vue", label: "Vue 3", color: "bg-green-500" },
  { value: "svelte", label: "Svelte", color: "bg-orange-500" },
  { value: "angular", label: "Angular", color: "bg-red-500" },
];

const BACKEND_FRAMEWORKS: { value: BackendFramework; label: string; color: string }[] = [
  { value: "express", label: "Express.js", color: "bg-gray-500" },
  { value: "fastify", label: "Fastify", color: "bg-black" },
  { value: "nextjs", label: "Next.js API", color: "bg-black" },
  { value: "sveltekit", label: "SvelteKit", color: "bg-orange-500" },
];

export default function Home() {
  const { handleRunFrontend, handleRunBackend } = useCodeExecution();

  // Mode toggle
  const [mode, setMode] = useState<"frontend" | "backend">("frontend");

  // Frontend state
  const [selectedFramework, setSelectedFramework] = useState<Framework>("vanilla");
  const [frontendViewMode, setFrontendViewMode] = useState<"simple" | "advanced">("simple");
  const [frontendFiles, setFrontendFiles] = useState<Record<string, string>>({});
  const [selectedFrontendFile, setSelectedFrontendFile] = useState<string>("script.js");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string>("");
  const [autoRun, setAutoRun] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Backend state
  const [selectedBackendFramework, setSelectedBackendFramework] =
    useState<BackendFramework>("express");
  const [backendFiles, setBackendFiles] = useState<Record<string, string>>({});
  const [selectedBackendFile, setSelectedBackendFile] = useState<string>("README.md");
  const [serverUrl, setServerUrl] = useState<string>("");
  const [terminalOutputs, setTerminalOutputs] = useState<TerminalOutput[]>([]);

  // Load frontend template when framework or view mode changes
  useEffect(() => {
    if (mode === "frontend") {
      const template = frontendViewMode === "simple"
        ? SIMPLE_TEMPLATES[selectedFramework]
        : FRONTEND_TEMPLATES[selectedFramework];
      setFrontendFiles(template.files);
      // Set default file based on framework
      const defaultFile = selectedFramework === 'svelte' ? 'App.svelte' :
                         selectedFramework === 'angular' ? 'counter.component.ts' :
                         'script.js';
      setSelectedFrontendFile(defaultFile);
    }
  }, [selectedFramework, mode, frontendViewMode]);

  // Load backend template when backend framework changes
  useEffect(() => {
    if (mode === "backend") {
      const template = BACKEND_TEMPLATES[selectedBackendFramework];
      setBackendFiles(template.files);
      setSelectedBackendFile("README.md"); // Default to README
      setServerUrl("");
      setTerminalOutputs([]);
    }
  }, [selectedBackendFramework, mode]);

  // Write terminal outputs
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (mode === "backend" && terminalOutputs.length > 0) {
      const latestOutput = terminalOutputs[terminalOutputs.length - 1];
      const terminal = (window as any).__terminal;
      if (terminal) {
        terminal.write(latestOutput.data);
      }
    }
  }, [terminalOutputs, mode]);

  // Helper function to get code for execution (combines HTML/CSS/JS in advanced mode)
  const getExecutableCode = () => {
    const mainFile = selectedFramework === 'svelte' ? 'App.svelte' :
                    selectedFramework === 'angular' ? 'counter.component.ts' :
                    'script.js';

    if (frontendViewMode === "simple") {
      // Simple mode: just return the main code file
      return frontendFiles[mainFile] || '';
    } else {
      // Advanced mode: combine HTML, CSS, and JS
      // For now, still return just the main file (we'll inject HTML/CSS through the executor)
      return frontendFiles[mainFile] || '';
    }
  };

  // Auto-run effect with debouncing (frontend only)
  useEffect(() => {
    if (mode !== "frontend" || !autoRun) return;

    const timeoutId = setTimeout(() => {
      // Get the main code file for execution
      const mainFile = selectedFramework === 'svelte' ? 'App.svelte' :
                      selectedFramework === 'angular' ? 'counter.component.ts' :
                      'script.js';
      const codeToRun = frontendFiles[mainFile] || '';

      // In advanced mode, extract HTML and CSS files
      const htmlTemplate = frontendViewMode === 'advanced' ? frontendFiles['index.html'] : undefined;
      const cssContent = frontendViewMode === 'advanced' ? frontendFiles['styles.css'] : undefined;

      handleRunFrontend({
        framework: selectedFramework,
        code: codeToRun,
        iframeRef,
        setIsRunning,
        setError,
        htmlTemplate,
        cssContent,
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [frontendFiles, autoRun, mode, selectedFramework, handleRunFrontend, frontendViewMode]);

  // Handler for manual run/refresh
  const handleRefresh = () => {
    if (mode === "frontend") {
      // Get the main code file for execution
      const mainFile = selectedFramework === 'svelte' ? 'App.svelte' :
                      selectedFramework === 'angular' ? 'counter.component.ts' :
                      'script.js';
      const codeToRun = frontendFiles[mainFile] || '';

      // In advanced mode, extract HTML and CSS files
      const htmlTemplate = frontendViewMode === 'advanced' ? frontendFiles['index.html'] : undefined;
      const cssContent = frontendViewMode === 'advanced' ? frontendFiles['styles.css'] : undefined;

      handleRunFrontend({
        framework: selectedFramework,
        code: codeToRun,
        iframeRef,
        setIsRunning,
        setError,
        htmlTemplate,
        cssContent,
      });
    } else {
      handleRunBackend({
        backendFiles,
        setIsRunning,
        setError,
        setServerUrl,
        setTerminalOutputs,
      });
    }
  };

  // Get current code based on mode
  const currentCode =
    mode === "frontend"
      ? frontendFiles[selectedFrontendFile] || ""
      : backendFiles[selectedBackendFile] || "";

  // Handle code change
  const handleCodeChange = (value: string) => {
    if (mode === "frontend") {
      setFrontendFiles({ ...frontendFiles, [selectedFrontendFile]: value });
    } else {
      setBackendFiles({ ...backendFiles, [selectedBackendFile]: value });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      {/* Header */}
      <Header mode={mode} onModeChange={setMode} />

      {/* Main Content - Resizable Split View */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Editor Panel */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <EditorPanel
            mode={mode}
            selectedFramework={selectedFramework}
            onFrameworkChange={setSelectedFramework}
            selectedBackendFramework={selectedBackendFramework}
            onBackendFrameworkChange={setSelectedBackendFramework}
            code={currentCode}
            onCodeChange={handleCodeChange}
            frontendFrameworks={FRAMEWORKS}
            backendFrameworks={BACKEND_FRAMEWORKS}
            frontendViewMode={frontendViewMode}
            onFrontendViewModeChange={setFrontendViewMode}
            frontendFiles={frontendFiles}
            selectedFrontendFile={selectedFrontendFile}
            onFrontendFileSelect={setSelectedFrontendFile}
            backendFiles={backendFiles}
            selectedBackendFile={selectedBackendFile}
            onBackendFileSelect={setSelectedBackendFile}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Preview Panel */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <PreviewPanel
            mode={mode}
            selectedFramework={selectedFramework}
            error={error}
            isRunning={isRunning}
            autoRun={autoRun}
            onToggleAutoRun={() => setAutoRun(!autoRun)}
            onRefresh={handleRefresh}
            iframeRef={iframeRef}
            serverUrl={serverUrl}
          />
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Status Bar */}
      <footer className="px-6 py-2 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {mode === "frontend" ? (
            <>
              <FrameworkIcon framework={selectedFramework} />
              <span className="text-sm text-zinc-400">
                {FRAMEWORKS.find((f) => f.value === selectedFramework)?.label}
              </span>
            </>
          ) : (
            <>
              <Server className="w-4 h-4 text-green-500" />
              <span className="text-sm text-zinc-400">
                {
                  BACKEND_FRAMEWORKS.find(
                    (f) => f.value === selectedBackendFramework
                  )?.label
                }
              </span>
            </>
          )}
        </div>
        <span className="text-xs text-zinc-500">
          {mode === "frontend"
            ? autoRun
              ? "Auto-run enabled"
              : "Manual mode"
            : serverUrl
            ? "Server running"
            : "Ready to start"}
        </span>
      </footer>
    </div>
  );
}
