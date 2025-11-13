'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Play, Code2, Loader2 } from 'lucide-react';
import { EXAMPLE_CODE } from './utils/templates';
import { executeVanillaJS, executeReact, executeVue, executeSvelte, executeAngular } from './utils/executor';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-zinc-900 text-white">
      Loading editor...
    </div>
  ),
});

type Framework = 'vanilla' | 'react' | 'vue' | 'svelte' | 'angular';

const FRAMEWORKS: { value: Framework; label: string; color: string }[] = [
  { value: 'vanilla', label: 'Vanilla JS', color: 'bg-yellow-500' },
  { value: 'react', label: 'React', color: 'bg-blue-500' },
  { value: 'vue', label: 'Vue 3', color: 'bg-green-500' },
  { value: 'svelte', label: 'Svelte', color: 'bg-orange-500' },
  { value: 'angular', label: 'Angular', color: 'bg-red-500' },
];

export default function Home() {
  const [selectedFramework, setSelectedFramework] = useState<Framework>('vanilla');
  const [code, setCode] = useState<string>(EXAMPLE_CODE.vanilla);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load example code when framework changes
  useEffect(() => {
    setCode(EXAMPLE_CODE[selectedFramework]);
  }, [selectedFramework]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setError('');

    try {
      let html = '';

      switch (selectedFramework) {
        case 'vanilla':
          html = executeVanillaJS(code);
          break;
        case 'react':
          html = executeReact(code);
          break;
        case 'vue':
          html = executeVue(code);
          break;
        case 'svelte':
          html = executeSvelte(code);
          break;
        case 'angular':
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
      const errorMsg = err instanceof Error ? err.message : 'Execution failed';
      setError(errorMsg);
      console.error('Execution error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Code2 className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-white">TechStack Compare</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Framework Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400">Framework:</span>
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value as Framework)}
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FRAMEWORKS.map((fw) => (
                <option key={fw.value} value={fw.value}>
                  {fw.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Pane */}
        <div className="flex-1 flex flex-col border-r border-zinc-800">
          <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-300">Code Editor</h2>
          </div>
          <div className="flex-1">
            <MonacoEditor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* Preview Pane */}
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-300">Live Preview</h2>
          </div>
          <div className="flex-1 bg-white relative">
            {error && (
              <div className="absolute top-0 left-0 right-0 bg-red-50 border-b border-red-200 px-4 py-3 z-10">
                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-semibold text-sm">Error:</span>
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
        </div>
      </div>

      {/* Status Bar */}
      <footer className="px-6 py-2 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${FRAMEWORKS.find(f => f.value === selectedFramework)?.color}`} />
          <span className="text-sm text-zinc-400">
            {FRAMEWORKS.find(f => f.value === selectedFramework)?.label}
          </span>
        </div>
        <span className="text-xs text-zinc-500">
          Ready to run
        </span>
      </footer>
    </div>
  );
}
