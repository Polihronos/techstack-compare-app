/**
 * SvelteKit Backend Framework Configuration
 */

import type { FrameworkConfig } from '../../types';
import { webContainerExecutor } from '../../../executors/backend/webcontainer-executor';
import { sveltekitTemplates } from './templates';

export const sveltekitConfig: FrameworkConfig<'backend'> = {
  id: 'sveltekit',
  name: 'SvelteKit',
  type: 'backend',
  description: 'The fastest way to build Svelte apps',
  icon: 'sveltekit',
  color: '#ff3e00', // SvelteKit orange

  // Template configuration (backend uses file system structure)
  simpleTemplate: undefined, // Backend doesn't have simple mode
  advancedTemplate: sveltekitTemplates,

  // Execution configuration
  executor: webContainerExecutor,

  // Backend-specific configuration
  defaultPort: 3001,
  startCommand: 'npm run dev',
  installCommand: 'npm install',
};
