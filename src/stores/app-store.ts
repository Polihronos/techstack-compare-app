/**
 * Application State Store
 * Manages framework selection, editor state, and preview state
 */

import { create } from 'zustand';
import type { FrameworkId, ViewMode, FrontendFrameworkId, BackendFrameworkId, AppMode } from '../frameworks/types';

interface EditorState {
  code: string;
  htmlContent: string;
  cssContent: string;
}

interface PreviewState {
  output: string;
  url: string;
  isLoading: boolean;
  terminalOutput: string;
}

interface FullStackState {
  frontendFramework: FrontendFrameworkId;
  backendFramework: BackendFrameworkId;
  backendUrl: string;
}

interface AppState {
  // App mode
  appMode: AppMode;

  // Framework selection
  selectedFramework: FrameworkId;
  frameworkType: 'frontend' | 'backend';

  // Full-stack mode state
  fullstack: FullStackState;

  // View mode (simple/advanced for frontend)
  viewMode: ViewMode;

  // Editor state
  editor: EditorState;

  // Preview state
  preview: PreviewState;

  // Actions
  setAppMode: (mode: AppMode) => void;
  setFramework: (id: FrameworkId, type: 'frontend' | 'backend') => void;
  setFullStackFrameworks: (frontend: FrontendFrameworkId, backend: BackendFrameworkId) => void;
  setBackendUrl: (url: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setCode: (code: string) => void;
  setHtmlContent: (html: string) => void;
  setCssContent: (css: string) => void;
  setPreviewOutput: (output: string) => void;
  setPreviewUrl: (url: string) => void;
  setPreviewLoading: (loading: boolean) => void;
  appendTerminalOutput: (output: string) => void;
  clearTerminalOutput: () => void;
  resetEditor: () => void;
}

const initialEditorState: EditorState = {
  code: '',
  htmlContent: '',
  cssContent: '',
};

const initialPreviewState: PreviewState = {
  output: '',
  url: '',
  isLoading: false,
  terminalOutput: '',
};

const initialFullStackState: FullStackState = {
  frontendFramework: 'react',
  backendFramework: 'express',
  backendUrl: '',
};

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  appMode: 'frontend',
  selectedFramework: 'vanilla',
  frameworkType: 'frontend',
  viewMode: 'simple',
  fullstack: initialFullStackState,
  editor: initialEditorState,
  preview: initialPreviewState,

  // Actions
  setAppMode: (mode) =>
    set({
      appMode: mode,
      // Reset preview when switching app modes
      preview: initialPreviewState,
    }),

  setFramework: (id, type) =>
    set({
      selectedFramework: id,
      frameworkType: type,
      // Reset preview when switching frameworks
      preview: initialPreviewState,
    }),

  setFullStackFrameworks: (frontend, backend) =>
    set((state) => ({
      fullstack: {
        ...state.fullstack,
        frontendFramework: frontend,
        backendFramework: backend,
      },
      // Reset preview when changing frameworks
      preview: initialPreviewState,
    })),

  setBackendUrl: (url) =>
    set((state) => ({
      fullstack: {
        ...state.fullstack,
        backendUrl: url,
      },
    })),

  setViewMode: (mode) =>
    set({
      viewMode: mode,
      // Reset preview when switching modes
      preview: initialPreviewState,
    }),

  setCode: (code) =>
    set((state) => ({
      editor: { ...state.editor, code },
    })),

  setHtmlContent: (html) =>
    set((state) => ({
      editor: { ...state.editor, htmlContent: html },
    })),

  setCssContent: (css) =>
    set((state) => ({
      editor: { ...state.editor, cssContent: css },
    })),

  setPreviewOutput: (output) =>
    set((state) => ({
      preview: { ...state.preview, output },
    })),

  setPreviewUrl: (url) =>
    set((state) => ({
      preview: { ...state.preview, url },
    })),

  setPreviewLoading: (loading) =>
    set((state) => ({
      preview: { ...state.preview, isLoading: loading },
    })),

  appendTerminalOutput: (output) =>
    set((state) => ({
      preview: {
        ...state.preview,
        terminalOutput: state.preview.terminalOutput + output,
      },
    })),

  clearTerminalOutput: () =>
    set((state) => ({
      preview: { ...state.preview, terminalOutput: '' },
    })),

  resetEditor: () =>
    set({
      editor: initialEditorState,
      preview: initialPreviewState,
    }),
}));
