import { useCallback, RefObject } from "react";
import {
  executeVanillaJS,
  executeReact,
  executeVue,
  executeSvelte,
  executeAngular,
} from "@/app/utils/executor";
import { executeBackend, type TerminalOutput } from "@/app/utils/webcontainer-executor";
import { type Framework } from "@/components/FrameworkIcon";

/**
 * useCodeExecution Hook
 *
 * @description Custom hook that provides code execution functionality for both
 * frontend and backend frameworks. Handles iframe rendering, error states,
 * and terminal output management.
 *
 * @returns {Object} Execution handlers
 * @returns {Function} handleRunFrontend - Execute frontend framework code
 * @returns {Function} handleRunBackend - Execute backend framework code
 *
 * @example
 * ```tsx
 * const { handleRunFrontend, handleRunBackend } = useCodeExecution();
 *
 * // Frontend execution
 * handleRunFrontend({
 *   framework: 'react',
 *   code: 'const App = () => <div>Hello</div>',
 *   iframeRef,
 *   setIsRunning,
 *   setError
 * });
 *
 * // Backend execution
 * handleRunBackend({
 *   backendFiles: { 'server.js': 'const express = require("express")...' },
 *   setIsRunning,
 *   setError,
 *   setServerUrl,
 *   setTerminalOutputs
 * });
 * ```
 */
export function useCodeExecution() {
  /**
   * Execute frontend framework code
   *
   * @param framework - The frontend framework to execute
   * @param code - The code to execute
   * @param iframeRef - Reference to the preview iframe
   * @param setIsRunning - State setter for running status
   * @param setError - State setter for error messages
   * @param htmlTemplate - Optional HTML template (for advanced mode)
   * @param cssContent - Optional CSS content (for advanced mode)
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
      framework: Framework;
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
        let html = "";

        switch (framework) {
          case "vanilla":
            html = executeVanillaJS(code, htmlTemplate, cssContent);
            break;
          case "react":
            html = executeReact(code, htmlTemplate, cssContent);
            break;
          case "vue":
            html = executeVue(code, htmlTemplate, cssContent);
            break;
          case "svelte":
            html = executeSvelte(code, htmlTemplate, cssContent);
            break;
          case "angular":
            html = await executeAngular(code, htmlTemplate, cssContent);
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
   *
   * @param backendFiles - File system structure for the backend
   * @param setIsRunning - State setter for running status
   * @param setError - State setter for error messages
   * @param setServerUrl - State setter for server URL
   * @param setTerminalOutputs - State setter for terminal outputs
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
        const result = await executeBackend(backendFiles, (output) => {
          setTerminalOutputs((prev) => [...prev, output]);
        });

        if (result.error) {
          setError(result.error);
        } else if (result.url) {
          setServerUrl(result.url);
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Backend execution failed";
        setError(errorMsg);
      } finally {
        setIsRunning(false);
      }
    },
    []
  );

  return {
    handleRunFrontend,
    handleRunBackend,
  };
}
