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
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Server } from "lucide-react";

export default function Home() {
  const { handleRunFrontend, handleRunBackend } = useCodeExecution();

  // Zustand store
  const {
    selectedFramework,
    frameworkType,
    viewMode,
    editor,
    preview,
    setFramework,
    setViewMode,
    setCode,
    setHtmlContent,
    setCssContent,
    setPreviewUrl,
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
  }, [selectedFramework, frameworkType, viewMode, currentFramework]);

  // Local state for terminal outputs
  const [terminalOutputs, setTerminalOutputs] = useState<any[]>([]);

  // Write terminal outputs to XTerm.js
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (frameworkType === "backend" && terminalOutputs.length > 0) {
      const terminal = (window as any).__terminal;
      if (terminal) {
        const latestOutput = terminalOutputs[terminalOutputs.length - 1];
        terminal.write(latestOutput.data);
      }
    }
  }, [terminalOutputs, frameworkType]);

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
    if (frameworkType === 'frontend') {
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
        mode={frameworkType}
        onModeChange={(mode) => {
          // Switch to first framework of that type
          const firstFramework = mode === 'frontend' ? 'vanilla' : 'express';
          setFramework(firstFramework, mode);
        }}
      />

      {/* Main Content - Resizable Split View */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Editor Panel */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <EditorPanel
            mode={frameworkType}
            selectedFramework={frameworkType === 'frontend' ? selectedFramework as FrontendFrameworkId : 'vanilla'}
            onFrameworkChange={(fw) => handleFrameworkChange(fw)}
            selectedBackendFramework={frameworkType === 'backend' ? selectedFramework as BackendFrameworkId : 'express'}
            onBackendFrameworkChange={(fw) => handleFrameworkChange(fw)}
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
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Preview Panel */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <PreviewPanel
            mode={frameworkType}
            selectedFramework={frameworkType === 'frontend' ? selectedFramework as FrontendFrameworkId : 'vanilla'}
            error={error}
            isRunning={preview.isLoading}
            autoRun={autoRun}
            onToggleAutoRun={() => setAutoRun(!autoRun)}
            onRefresh={handleRefresh}
            iframeRef={iframeRef}
            serverUrl={preview.url}
          />
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Status Bar */}
      <footer className="px-6 py-2 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {frameworkType === "frontend" ? (
            <>
              <FrameworkIcon framework={selectedFramework as FrontendFrameworkId} />
              <span className="text-sm text-zinc-400">
                {currentFramework?.name}
              </span>
            </>
          ) : (
            <>
              <Server className="w-4 h-4 text-green-500" />
              <span className="text-sm text-zinc-400">
                {currentFramework?.name}
              </span>
            </>
          )}
        </div>
        <span className="text-xs text-zinc-500">
          {frameworkType === "frontend"
            ? autoRun
              ? "Auto-run enabled"
              : "Manual mode"
            : preview.url
            ? "Server running"
            : "Ready to start"}
        </span>
      </footer>
    </div>
  );
}
