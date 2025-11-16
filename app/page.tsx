"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { FrameworkIcon } from "@/components/FrameworkIcon";
import { useCodeExecution } from "@/hooks/useCodeExecution";
import { useAppStore } from "@/src/stores/app-store";
import { FRAMEWORKS, getFrontendFrameworks, getBackendFrameworks } from "@/src/frameworks";
import type { FrameworkId, FrontendFrameworkId, BackendFrameworkId } from "@/src/frameworks/types";
import { reactExpressTodo } from "@/src/frameworks/fullstack/react-express-todo";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Server, Layers } from "lucide-react";

export default function Home() {
  const { handleRunFrontend, handleRunBackend, handleRunFullStack } = useCodeExecution();

  // Zustand store
  const {
    appMode,
    selectedFramework,
    frameworkType,
    viewMode,
    editor,
    preview,
    fullstack,
    setAppMode,
    setFramework,
    setFullStackFrameworks,
    setViewMode,
    setCode,
    setHtmlContent,
    setCssContent,
    setPreviewUrl,
    setBackendUrl,
    appendTerminalOutput,
    clearTerminalOutput,
    setPreviewLoading,
  } = useAppStore();

  // Local UI state
  const [selectedFile, setSelectedFile] = useState<string>("script.js");
  const [files, setFiles] = useState<Record<string, string>>({});
  const [autoRun, setAutoRun] = useState(true);
  const [error, setError] = useState<string>("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Get current framework config
  const currentFramework = FRAMEWORKS[selectedFramework];

  // Load templates when framework or view mode changes
  useEffect(() => {
    if (appMode === 'fullstack') {
      // Load fullstack template files
      const fullstackFiles: Record<string, string> = {};

      // Add frontend files with prefix
      for (const [path, content] of Object.entries(reactExpressTodo.files.frontend)) {
        fullstackFiles[`frontend/${path}`] = content;
      }

      // Add backend files with prefix
      for (const [path, content] of Object.entries(reactExpressTodo.files.backend)) {
        fullstackFiles[`backend/${path}`] = content;
      }

      setFiles(fullstackFiles);
      setSelectedFile('frontend/App.jsx');
      setCode(fullstackFiles['frontend/App.jsx'] || '');
      clearTerminalOutput();
      setPreviewUrl('');
      setBackendUrl('');
      setTerminalOutputs([]);
      return;
    }

    if (!currentFramework) return;

    if (frameworkType === 'frontend') {
      const template = viewMode === 'simple'
        ? currentFramework.simpleTemplate
        : currentFramework.advancedTemplate;

      if (viewMode === 'simple' && template && 'code' in template && typeof template.code === 'string') {
        // Simple mode: single file
        const fileName = selectedFramework === 'svelte' ? 'App.svelte' :
                        selectedFramework === 'angular' ? 'counter.component.ts' :
                        'script.js';
        setFiles({ [fileName]: template.code });
        setSelectedFile(fileName);
        setCode(template.code);
      } else if (viewMode === 'advanced' && template && 'files' in template) {
        // Advanced mode: multiple files
        const advancedFiles = (template as any).files || {};
        setFiles(advancedFiles);

        // Set default file based on framework
        const defaultFile = selectedFramework === 'svelte' ? 'App.svelte' :
                           selectedFramework === 'angular' ? 'counter.component.ts' :
                           'script.js';
        setSelectedFile(defaultFile);
        setCode(advancedFiles[defaultFile] || '');
        setHtmlContent(advancedFiles['index.html'] || '');
        setCssContent(advancedFiles['styles.css'] || '');
      }
    } else {
      // Backend: always use advanced template (file system)
      const template = currentFramework.advancedTemplate as Record<string, string>;
      setFiles(template);
      setSelectedFile('README.md');
      setCode(template['README.md'] || '');
      clearTerminalOutput();
      setPreviewUrl('');
      setTerminalOutputs([]);
    }
  }, [appMode, selectedFramework, frameworkType, viewMode, currentFramework]);

  // Local state for terminal outputs
  const [terminalOutputs, setTerminalOutputs] = useState<any[]>([]);

  // Write terminal outputs to XTerm.js
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((frameworkType === "backend" || appMode === "fullstack") && terminalOutputs.length > 0) {
      const terminal = (window as any).__terminal;
      if (terminal) {
        const latestOutput = terminalOutputs[terminalOutputs.length - 1];
        terminal.write(latestOutput.data);
      }
    }
  }, [terminalOutputs, frameworkType, appMode]);

  // Auto-run effect for frontend
  useEffect(() => {
    if (frameworkType !== 'frontend' || !autoRun) return;

    const timeoutId = setTimeout(() => {
      const mainFile = selectedFramework === 'svelte' ? 'App.svelte' :
                      selectedFramework === 'angular' ? 'counter.component.ts' :
                      'script.js';
      const codeToRun = files[mainFile] || '';
      const htmlTemplate = viewMode === 'advanced' ? files['index.html'] : undefined;
      const cssContent = viewMode === 'advanced' ? files['styles.css'] : undefined;

      handleRunFrontend({
        framework: selectedFramework as FrontendFrameworkId,
        code: codeToRun,
        iframeRef,
        setIsRunning: setPreviewLoading,
        setError,
        htmlTemplate,
        cssContent,
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [files, autoRun, frameworkType, selectedFramework, viewMode]);

  // Handle refresh/run
  const handleRefresh = () => {
    if (appMode === 'fullstack') {
      // Run full-stack application
      handleRunFullStack({
        template: reactExpressTodo, // TODO: Get template based on selected frameworks
        iframeRef,
        setIsRunning: setPreviewLoading,
        setError,
        setServerUrl: (url) => {
          setPreviewUrl(url);
          setBackendUrl(url);
        },
        setTerminalOutputs: setTerminalOutputs,
      });
    } else if (frameworkType === 'frontend') {
      const mainFile = selectedFramework === 'svelte' ? 'App.svelte' :
                      selectedFramework === 'angular' ? 'counter.component.ts' :
                      'script.js';
      const codeToRun = files[mainFile] || '';
      const htmlTemplate = viewMode === 'advanced' ? files['index.html'] : undefined;
      const cssContent = viewMode === 'advanced' ? files['styles.css'] : undefined;

      handleRunFrontend({
        framework: selectedFramework as FrontendFrameworkId,
        code: codeToRun,
        iframeRef,
        setIsRunning: setPreviewLoading,
        setError,
        htmlTemplate,
        cssContent,
      });
    } else {
      handleRunBackend({
        backendFiles: files,
        setIsRunning: setPreviewLoading,
        setError,
        setServerUrl: setPreviewUrl,
        setTerminalOutputs: setTerminalOutputs,
      });
    }
  };

  // Handle code change
  const handleCodeChange = (value: string) => {
    setFiles({ ...files, [selectedFile]: value });
    setCode(value);

    // Update HTML/CSS in store if changed
    if (selectedFile === 'index.html') setHtmlContent(value);
    if (selectedFile === 'styles.css') setCssContent(value);
  };

  // Handle framework change
  const handleFrameworkChange = (id: FrameworkId) => {
    const framework = FRAMEWORKS[id];
    if (framework) {
      setFramework(id, framework.type);
    }
  };

  // Get frameworks for UI
  const frontendFrameworks = getFrontendFrameworks().map(fw => ({
    value: fw.id as FrontendFrameworkId,
    label: fw.name,
    color: fw.color,
  }));

  const backendFrameworks = getBackendFrameworks().map(fw => ({
    value: fw.id as BackendFrameworkId,
    label: fw.name,
    color: fw.color,
  }));

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      {/* Header */}
      <Header
        mode={appMode}
        onModeChange={(mode) => {
          setAppMode(mode);

          // Switch to appropriate framework based on mode
          if (mode === 'frontend') {
            setFramework('vanilla', 'frontend');
          } else if (mode === 'backend') {
            setFramework('express', 'backend');
          } else if (mode === 'fullstack') {
            // Set default fullstack frameworks
            setFullStackFrameworks('react', 'express');
          }
        }}
      />

      {/* Main Content - Resizable Split View */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Editor Panel */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <EditorPanel
            mode={appMode === 'fullstack' ? 'frontend' : frameworkType}
            selectedFramework={appMode === 'frontend' ? selectedFramework as FrontendFrameworkId : appMode === 'fullstack' ? fullstack.frontendFramework : 'vanilla'}
            onFrameworkChange={(fw) => {
              if (appMode === 'fullstack') {
                setFullStackFrameworks(fw, fullstack.backendFramework);
              } else {
                handleFrameworkChange(fw);
              }
            }}
            selectedBackendFramework={appMode === 'backend' ? selectedFramework as BackendFrameworkId : appMode === 'fullstack' ? fullstack.backendFramework : 'express'}
            onBackendFrameworkChange={(fw) => {
              if (appMode === 'fullstack') {
                setFullStackFrameworks(fullstack.frontendFramework, fw);
              } else {
                handleFrameworkChange(fw);
              }
            }}
            code={files[selectedFile] || ''}
            onCodeChange={handleCodeChange}
            frontendFrameworks={frontendFrameworks}
            backendFrameworks={backendFrameworks}
            frontendViewMode={viewMode}
            onFrontendViewModeChange={setViewMode}
            frontendFiles={files}
            selectedFrontendFile={selectedFile}
            onFrontendFileSelect={(file) => {
              setSelectedFile(file);
              setCode(files[file] || '');
            }}
            backendFiles={files}
            selectedBackendFile={selectedFile}
            onBackendFileSelect={(file) => {
              setSelectedFile(file);
              setCode(files[file] || '');
            }}
            // Full-stack specific props
            appMode={appMode}
            fullstackFrontendFramework={fullstack.frontendFramework}
            fullstackBackendFramework={fullstack.backendFramework}
            onFullstackFrontendChange={(fw) => setFullStackFrameworks(fw, fullstack.backendFramework)}
            onFullstackBackendChange={(fw) => setFullStackFrameworks(fullstack.frontendFramework, fw)}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Preview Panel */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <PreviewPanel
            mode={appMode === 'fullstack' ? 'fullstack' : frameworkType}
            selectedFramework={appMode === 'frontend' ? selectedFramework as FrontendFrameworkId : appMode === 'fullstack' ? fullstack.frontendFramework : 'vanilla'}
            error={error}
            isRunning={preview.isLoading}
            autoRun={autoRun}
            onToggleAutoRun={() => setAutoRun(!autoRun)}
            onRefresh={handleRefresh}
            iframeRef={iframeRef}
            serverUrl={preview.url}
            appMode={appMode}
            backendUrl={fullstack.backendUrl}
          />
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Status Bar */}
      <footer className="px-6 py-2 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {appMode === "frontend" ? (
            <>
              <FrameworkIcon framework={selectedFramework as FrontendFrameworkId} />
              <span className="text-sm text-zinc-400">
                {currentFramework?.name}
              </span>
            </>
          ) : appMode === "backend" ? (
            <>
              <Server className="w-4 h-4 text-green-500" />
              <span className="text-sm text-zinc-400">
                {currentFramework?.name}
              </span>
            </>
          ) : (
            <>
              <Layers className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-zinc-400">
                {FRAMEWORKS[fullstack.frontendFramework]?.name} + {FRAMEWORKS[fullstack.backendFramework]?.name}
              </span>
            </>
          )}
        </div>
        <span className="text-xs text-zinc-500">
          {appMode === "frontend"
            ? autoRun
              ? "Auto-run enabled"
              : "Manual mode"
            : appMode === "backend"
            ? preview.url
              ? "Server running"
              : "Ready to start"
            : fullstack.backendUrl
            ? "Full-stack app running"
            : "Ready to start"}
        </span>
      </footer>
    </div>
  );
}
