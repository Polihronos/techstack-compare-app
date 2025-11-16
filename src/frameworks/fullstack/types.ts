/**
 * Full-Stack Template Types
 */

import type { FrontendFrameworkId, BackendFrameworkId } from '../types';

/**
 * Full-stack template configuration
 */
export interface FullStackTemplate {
  id: string;
  name: string;
  description: string;
  frontendFramework: FrontendFrameworkId;
  backendFramework: BackendFrameworkId;

  // File structure
  files: {
    // Frontend files (will be injected with backend URL)
    frontend: Record<string, string>;

    // Backend files
    backend: Record<string, string>;
  };
}

/**
 * Full-stack template registry
 */
export type FullStackTemplateRegistry = Record<string, FullStackTemplate>;
