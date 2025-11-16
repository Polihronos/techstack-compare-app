/**
 * Core types for the framework registry system
 */

export type FrameworkType = 'frontend' | 'backend';
export type AppMode = 'frontend' | 'backend' | 'fullstack';

export type FrontendFrameworkId = 'vanilla' | 'react' | 'vue' | 'svelte' | 'angular';
export type BackendFrameworkId = 'express' | 'fastify' | 'nextjs' | 'sveltekit';
export type FrameworkId = FrontendFrameworkId | BackendFrameworkId;

export type ViewMode = 'simple' | 'advanced';

/**
 * Template structure for simple mode (single file with inline styles)
 */
export interface SimpleTemplate {
  code: string;
  language: string; // Monaco editor language
}

/**
 * Template structure for advanced mode (separate files)
 */
export interface AdvancedTemplate {
  files: {
    [filename: string]: string;
  };
}

/**
 * File system structure for backend frameworks
 */
export interface FileSystemTemplate {
  [path: string]: string | FileSystemTemplate;
}

/**
 * Executor interface - handles code compilation and execution
 */
export interface FrameworkExecutor {
  execute(code: string, options: ExecutionOptions): Promise<string>;
}

/**
 * Backend executor interface - handles file-based execution
 */
export interface BackendExecutor {
  execute(
    files: FileSystemTemplate,
    onOutput: (text: string) => void,
    onReady: (url: string) => void
  ): Promise<void>;
  cleanup(): Promise<void>;
}

/**
 * Execution options for frontend frameworks
 */
export interface ExecutionOptions {
  mode: ViewMode;
  files?: {
    html?: string;
    css?: string;
    code?: string;
  };
}

/**
 * CDN library configuration
 */
export interface CDNLibrary {
  url: string;
  global?: string; // Global variable name (e.g., 'React')
}

/**
 * Framework configuration
 */
export interface FrameworkConfig<T extends FrameworkType = FrameworkType> {
  id: FrameworkId;
  name: string;
  type: T;
  description: string;
  icon: string; // Icon component name or SVG
  color: string; // Brand color

  // Template configuration
  simpleTemplate: T extends 'frontend' ? SimpleTemplate : undefined;
  advancedTemplate: T extends 'frontend' ? AdvancedTemplate : FileSystemTemplate;

  // Execution configuration
  executor: T extends 'frontend' ? FrameworkExecutor : BackendExecutor;

  // Frontend-specific
  fileExtension?: string; // e.g., '.jsx', '.vue', '.svelte'
  editorLanguage?: string; // Monaco editor language
  cdnLibraries?: CDNLibrary[];

  // Backend-specific
  defaultPort?: number;
  startCommand?: string;
  installCommand?: string;
}

/**
 * Type-safe framework registry
 */
export type FrameworkRegistry = {
  [K in FrontendFrameworkId]: FrameworkConfig<'frontend'>;
} & {
  [K in BackendFrameworkId]: FrameworkConfig<'backend'>;
};

/**
 * Template loader result
 */
export interface LoadedTemplate {
  mode: ViewMode;
  content: SimpleTemplate | AdvancedTemplate | FileSystemTemplate;
}
