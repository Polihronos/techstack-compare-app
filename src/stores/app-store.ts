/**
 * Application State Store
 * Manages framework selection, editor state, and preview state
 */

import { create } from 'zustand';
import type { FrameworkId, ViewMode } from '../frameworks/types';

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

interface AppState {
  // Framework selection
  selectedFramework: FrameworkId;
  frameworkType: 'frontend' | 'backend';

  // View mode (simple/advanced for frontend)
  viewMode: ViewMode;

  // Editor state
  editor: EditorState;

  // Preview state
  preview: PreviewState;

  // Actions
  setFramework: (id: FrameworkId, type: 'frontend' | 'backend') => void;
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

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  selectedFramework: 'vanilla',
  frameworkType: 'frontend',
  viewMode: 'simple',
  editor: initialEditorState,
  preview: initialPreviewState,

  // Actions
  setFramework: (id, type) =>
    set({
      selectedFramework: id,
      frameworkType: type,
      // Reset preview when switching frameworks
      preview: initialPreviewState,
    }),

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
