import { useCallback, RefObject } from "react";
import { FRAMEWORKS } from "@/src/frameworks";
import { webContainerExecutor } from "@/src/executors/backend/webcontainer-executor";
import { fullStackExecutor } from "@/src/executors/fullstack/fullstack-executor";
import type { FrontendFrameworkId, BackendFrameworkId } from "@/src/frameworks/types";
import type { FullStackTemplate } from "@/src/frameworks/fullstack/types";

// Terminal output type
export interface TerminalOutput {
  type: 'stdout' | 'stderr' | 'error';
  data: string;
}

/**
 * Custom hook that provides code execution functionality for both
 * frontend and backend frameworks using the new registry system.
 */
export function useCodeExecution() {
  /**
   * Execute frontend framework code
   */
  const handleRunFrontend = useCallback(
    async ({
      framework,
      code,
      iframeRef,
      setIsRunning,
      setError,
      htmlTemplate,
      cssContent,
    }: {
      framework: FrontendFrameworkId;
      code: string;
      iframeRef: RefObject<HTMLIFrameElement | null>;
      setIsRunning: (running: boolean) => void;
      setError: (error: string) => void;
      htmlTemplate?: string;
      cssContent?: string;
    }) => {
      setIsRunning(true);
      setError("");

      try {
        // Get framework config from registry
        const frameworkConfig = FRAMEWORKS[framework];
        if (!frameworkConfig || frameworkConfig.type !== 'frontend') {
          throw new Error(`Invalid frontend framework: ${framework}`);
        }

        // Use the framework's executor
        const html = await frameworkConfig.executor.execute(code, {
          mode: htmlTemplate ? 'advanced' : 'simple',
          files: {
            html: htmlTemplate,
            css: cssContent,
            code: code,
          },
        });

        // Render to iframe
        if (iframeRef.current) {
          const iframeDoc = iframeRef.current.contentDocument;
          if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(html);
            iframeDoc.close();
          }
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Execution failed";
        setError(errorMsg);
        console.error("Execution error:", err);
      } finally {
        setIsRunning(false);
      }
    },
    []
  );

  /**
   * Execute backend framework code
   */
  const handleRunBackend = useCallback(
    async ({
      backendFiles,
      setIsRunning,
      setError,
      setServerUrl,
      setTerminalOutputs,
    }: {
      backendFiles: Record<string, string>;
      setIsRunning: (running: boolean) => void;
      setError: (error: string) => void;
      setServerUrl: (url: string) => void;
      setTerminalOutputs: (
        updater: (prev: TerminalOutput[]) => TerminalOutput[]
      ) => void;
    }) => {
      setIsRunning(true);
      setError("");
      setTerminalOutputs(() => []);
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
        // Use the WebContainer executor
        await webContainerExecutor.execute(
          backendFiles,
          (output) => {
            setTerminalOutputs((prev) => [...prev, { type: 'stdout', data: output }]);
          },
          (url) => {
            setServerUrl(url);
          }
        );
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Backend execution failed";
        setError(errorMsg);
        console.error("Backend execution error:", err);
      } finally {
        setIsRunning(false);
      }
    },
    []
  );

  /**
   * Execute full-stack application (backend + frontend)
   */
  const handleRunFullStack = useCallback(
    async ({
      template,
      iframeRef,
      setIsRunning,
      setError,
      setServerUrl,
      setTerminalOutputs,
    }: {
      template: FullStackTemplate;
      iframeRef: RefObject<HTMLIFrameElement | null>;
      setIsRunning: (running: boolean) => void;
      setError: (error: string) => void;
      setServerUrl: (url: string) => void;
      setTerminalOutputs: (
        updater: (prev: TerminalOutput[]) => TerminalOutput[]
      ) => void;
    }) => {
      setIsRunning(true);
      setError("");
      setTerminalOutputs(() => []);
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
        // Execute full-stack application
        await fullStackExecutor.execute(template, {
          onBackendOutput: (output) => {
            setTerminalOutputs((prev) => [...prev, { type: 'stdout', data: output }]);
          },
          onBackendReady: (url) => {
            setServerUrl(url);
          },
          onFrontendReady: (url) => {
            // Navigate iframe to backend URL (frontend is served from same origin)
            if (iframeRef.current) {
              iframeRef.current.src = url;
            }
          },
          onError: (error) => {
            setError(error);
          },
        });
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Full-stack execution failed";
        setError(errorMsg);
        console.error("Full-stack execution error:", err);
      } finally {
        setIsRunning(false);
      }
    },
    []
  );

  return {
    handleRunFrontend,
    handleRunBackend,
    handleRunFullStack,
  };
}
