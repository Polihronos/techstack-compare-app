"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Play,
  Zap,
  Code,
  Sparkles,
  RotateCw,
  Lock,
  ChevronLeft,
  ChevronRight,
  Home as HomeIcon,
  Monitor,
  Server,
  Terminal as TerminalIcon,
} from "lucide-react";
import { EXAMPLE_CODE } from "./utils/templates";
import {
  executeVanillaJS,
  executeReact,
  executeVue,
  executeSvelte,
  executeAngular,
} from "./utils/executor";
import { BACKEND_TEMPLATES, type BackendFramework } from "./utils/backend-templates";
import { executeBackend, type TerminalOutput } from "./utils/webcontainer-executor";
import { Button } from "@/components/ui/button";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-zinc-900 text-white">
      Loading editor...
    </div>
  ),
});

const Terminal = dynamic(() => import("@/components/terminal").then((mod) => ({ default: mod.Terminal })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-zinc-900 text-white">
      Loading terminal...
    </div>
  ),
});

type Framework = "vanilla" | "react" | "vue" | "svelte" | "angular";

// Framework icons using SVG paths
const FrameworkIcon = ({ framework }: { framework: Framework }) => {
  const icons = {
    vanilla: <Zap className="w-4 h-4 text-yellow-500" />,
    react: (
      <svg
        className="w-4 h-4 text-blue-500"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38a2.167 2.167 0 0 0-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44a23.476 23.476 0 0 0-3.107-.534A23.892 23.892 0 0 0 12.769 4.7c1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442a22.73 22.73 0 0 0-3.113.538 15.02 15.02 0 0 1-.254-1.42c-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87a25.64 25.64 0 0 1-4.412.005 26.64 26.64 0 0 1-1.183-1.86c-.372-.64-.71-1.29-1.018-1.946a25.17 25.17 0 0 1 1.013-1.954c.38-.66.773-1.286 1.18-1.868A25.245 25.245 0 0 1 12 8.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933a25.952 25.952 0 0 0-1.345-2.32zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493a23.966 23.966 0 0 0-1.1-2.98c.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98a23.142 23.142 0 0 0-1.086 2.964c-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39a25.819 25.819 0 0 0 1.341-2.338zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143a22.005 22.005 0 0 1-2.006-.386c.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295a1.185 1.185 0 0 1-.553-.132c-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" />
      </svg>
    ),
    vue: (
      <svg
        className="w-4 h-4 text-green-500"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39ZM12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z" />
      </svg>
    ),
    svelte: (
      <svg
        className="w-4 h-4 text-orange-500"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M10.354 21.125a4.44 4.44 0 0 1-4.765-1.767 4.109 4.109 0 0 1-.703-3.107 3.898 3.898 0 0 1 .134-.522l.105-.321.287.21a7.21 7.21 0 0 0 2.186 1.092l.208.063-.02.208a1.253 1.253 0 0 0 .226.83 1.337 1.337 0 0 0 1.435.533 1.231 1.231 0 0 0 .343-.15l5.59-3.562a1.164 1.164 0 0 0 .524-.778 1.242 1.242 0 0 0-.211-.937 1.338 1.338 0 0 0-1.435-.533 1.23 1.23 0 0 0-.343.15l-2.133 1.36a4.078 4.078 0 0 1-1.135.499 4.44 4.44 0 0 1-4.765-1.766 4.108 4.108 0 0 1-.702-3.108 3.855 3.855 0 0 1 1.742-2.582l5.589-3.563a4.072 4.072 0 0 1 1.135-.499 4.44 4.44 0 0 1 4.765 1.767 4.109 4.109 0 0 1 .703 3.107 3.943 3.943 0 0 1-.134.522l-.105.321-.286-.21a7.204 7.204 0 0 0-2.187-1.093l-.208-.063.02-.207a1.255 1.255 0 0 0-.226-.831 1.337 1.337 0 0 0-1.435-.532 1.231 1.231 0 0 0-.343.15L8.620 9.368a1.162 1.162 0 0 0-.524.778 1.24 1.24 0 0 0 .211.937 1.338 1.338 0 0 0 1.435.533 1.235 1.235 0 0 0 .344-.15l2.131-1.36a4.025 4.025 0 0 1 1.135-.499 4.44 4.44 0 0 1 4.765 1.767 4.108 4.108 0 0 1 .703 3.107 3.857 3.857 0 0 1-1.742 2.583l-5.59 3.562a4.072 4.072 0 0 1-1.134.499z" />
      </svg>
    ),
    angular: (
      <svg
        className="w-4 h-4 text-red-500"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M9.931 12.645h4.138l-2.07-4.908m0-7.737L.68 3.982l1.726 14.771L12 24l9.596-5.242L23.32 3.984 11.999.001zm7.064 18.31h-2.638l-1.422-3.503H8.996l-1.422 3.504h-2.64L12 2.65z" />
      </svg>
    ),
  };
  return icons[framework];
};

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

// Get appropriate language for Monaco editor based on framework
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

export default function Home() {
  // Mode toggle
  const [mode, setMode] = useState<"frontend" | "backend">("frontend");

  // Frontend state
  const [selectedFramework, setSelectedFramework] =
    useState<Framework>("vanilla");
  const [code, setCode] = useState<string>(EXAMPLE_CODE.vanilla);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string>("");
  const [autoRun, setAutoRun] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Backend state
  const [selectedBackendFramework, setSelectedBackendFramework] =
    useState<BackendFramework>("express");
  const [backendFiles, setBackendFiles] = useState<Record<string, string>>({});
  const [serverUrl, setServerUrl] = useState<string>("");
  const [terminalOutputs, setTerminalOutputs] = useState<TerminalOutput[]>([]);

  // Load example code when framework changes
  useEffect(() => {
    if (mode === "frontend") {
      setCode(EXAMPLE_CODE[selectedFramework]);
    }
  }, [selectedFramework, mode]);

  // Load backend template when backend framework changes
  useEffect(() => {
    if (mode === "backend") {
      const template = BACKEND_TEMPLATES[selectedBackendFramework];
      setBackendFiles(template.files);
      setServerUrl("");
      setTerminalOutputs([]);
    }
  }, [selectedBackendFramework, mode]);

  // Frontend execution (ORIGINAL WORKING CODE)
  const handleRunCode = useCallback(async () => {
    if (mode === "backend") return; // Skip if backend mode

    setIsRunning(true);
    setError("");

    try {
      let html = "";

      switch (selectedFramework) {
        case "vanilla":
          html = executeVanillaJS(code);
          break;
        case "react":
          html = executeReact(code);
          break;
        case "vue":
          html = executeVue(code);
          break;
        case "svelte":
          html = executeSvelte(code);
          break;
        case "angular":
          html = await executeAngular(code);
          break;
      }

      if (iframeRef.current) {
        const iframeDoc = iframeRef.current.contentDocument;
        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(html);
          iframeDoc.close();
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Execution failed";
      setError(errorMsg);
      console.error("Execution error:", err);
    } finally {
      setIsRunning(false);
    }
  }, [mode, selectedFramework, code]);

  // Backend execution (manual only via refresh button)
  const handleRunBackend = useCallback(async () => {
    setIsRunning(true);
    setError("");
    setTerminalOutputs([]);
    setServerUrl("");

    // Wait for terminal to be ready
    const waitForTerminal = () => {
      return new Promise<void>((resolve) => {
        const checkTerminal = () => {
          const terminal = (window as any).__terminal;
          if (terminal?.ready) {
            terminal.clear();
            resolve();
          } else {
            setTimeout(checkTerminal, 100);
          }
        };
        checkTerminal();
      });
    };

    await waitForTerminal();

    try {
      const result = await executeBackend(backendFiles, (output) => {
        setTerminalOutputs((prev) => [...prev, output]);
      });

      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        setServerUrl(result.url);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Backend execution failed";
      setError(errorMsg);
    } finally {
      setIsRunning(false);
    }
  }, [backendFiles]);

  // Write terminal outputs
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (mode === "backend" && terminalOutputs.length > 0) {
      const latestOutput = terminalOutputs[terminalOutputs.length - 1];
      const terminal = (window as any).__terminal;
      if (terminal) {
        terminal.write(latestOutput.data);
      }
    }
  }, [terminalOutputs, mode]);

  // Auto-run effect with debouncing (ORIGINAL WORKING CODE - frontend only)
  useEffect(() => {
    if (mode !== "frontend" || !autoRun) return;

    const timeoutId = setTimeout(() => {
      handleRunCode();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [code, autoRun, mode, handleRunCode]);

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      {/* Header */}
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
            onClick={() => setMode("frontend")}
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
            onClick={() => setMode("backend")}
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

      {/* Main Content - Resizable Split View */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Editor Pane */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="flex flex-col h-full">
            <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-zinc-400" />
                <h2 className="text-sm font-semibold text-zinc-300">
                  Code Editor
                </h2>
              </div>

              {/* Framework Selector Buttons */}
              <div className="flex items-center gap-1">
                {mode === "frontend" ? (
                  FRAMEWORKS.map((fw) => (
                    <Button
                      key={fw.value}
                      onClick={() => setSelectedFramework(fw.value)}
                      variant={
                        selectedFramework === fw.value ? "default" : "ghost"
                      }
                      size="sm"
                      className={`h-7 px-2 ${
                        selectedFramework === fw.value
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800"
                      }`}
                    >
                      <FrameworkIcon framework={fw.value} />
                      <span className="ml-1.5 text-xs">{fw.label}</span>
                    </Button>
                  ))
                ) : (
                  BACKEND_FRAMEWORKS.map((fw) => (
                    <Button
                      key={fw.value}
                      onClick={() => setSelectedBackendFramework(fw.value)}
                      variant={
                        selectedBackendFramework === fw.value ? "default" : "ghost"
                      }
                      size="sm"
                      className={`h-7 px-2 ${
                        selectedBackendFramework === fw.value
                          ? "bg-green-600 hover:bg-green-700"
                          : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800"
                      }`}
                    >
                      <Server className="w-3.5 h-3.5" />
                      <span className="ml-1.5 text-xs">{fw.label}</span>
                    </Button>
                  ))
                )}
              </div>
            </div>
            <div className="flex-1">
              <MonacoEditor
                height="100%"
                language={mode === "frontend" ? getEditorLanguage(selectedFramework) : "javascript"}
                theme="vs-dark"
                value={
                  mode === "frontend"
                    ? code
                    : backendFiles['server.js'] || backendFiles[Object.keys(backendFiles)[0]] || ""
                }
                onChange={(value) => {
                  if (mode === "frontend") {
                    setCode(value || "");
                  } else {
                    const mainFile = 'server.js' in backendFiles ? 'server.js' : Object.keys(backendFiles)[0];
                    setBackendFiles({ ...backendFiles, [mainFile]: value || "" });
                  }
                }}
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
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Preview Pane */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="flex flex-col h-full">
            <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {mode === "frontend" ? (
                  <Play className="w-4 h-4 text-zinc-400" />
                ) : (
                  <TerminalIcon className="w-4 h-4 text-zinc-400" />
                )}
                <h2 className="text-sm font-semibold text-zinc-300">
                  {mode === "frontend" ? "Live Preview" : "Terminal Output"}
                </h2>
              </div>

              {/* Auto-run Toggle */}
              <Button
                onClick={() => setAutoRun(!autoRun)}
                variant={autoRun ? "default" : "ghost"}
                size="sm"
                className={`h-7 px-2 ${
                  autoRun
                    ? "bg-green-600 hover:bg-green-700"
                    : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                <RotateCw
                  className={`w-3 h-3 ${
                    isRunning && autoRun ? "animate-spin" : ""
                  }`}
                />
                <span className="ml-1.5 text-xs">
                  {autoRun ? "Auto-run ON" : "Auto-run OFF"}
                </span>
              </Button>
            </div>

            {/* Browser Chrome */}
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
                  onClick={mode === "frontend" ? handleRunCode : handleRunBackend}
                  disabled={isRunning}
                >
                  <RotateCw
                    className={`w-3.5 h-3.5 ${isRunning ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>

              {/* Address Bar */}
              <div className="flex-1 bg-zinc-900 rounded-md px-3 py-1.5 flex items-center gap-2 border border-zinc-700">
                <Lock className="w-3.5 h-3.5 text-green-500" />
                <span className="text-xs text-zinc-400 font-mono">
                  {mode === "frontend"
                    ? `https://localhost:3000/preview/${selectedFramework}`
                    : serverUrl || `http://localhost:3001 (waiting...)`}
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
                          <p className="text-xs mt-1 opacity-70">Preview will appear here when ready</p>
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
                        <span className="text-xs font-medium text-zinc-300">Terminal</span>
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
                {BACKEND_FRAMEWORKS.find((f) => f.value === selectedBackendFramework)?.label}
              </span>
            </>
          )}
        </div>
        <span className="text-xs text-zinc-500">
          {mode === "frontend"
            ? autoRun ? "Auto-run enabled" : "Manual mode"
            : serverUrl ? "Server running" : "Ready to start"}
        </span>
      </footer>
    </div>
  );
}
