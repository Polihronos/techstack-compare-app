/**
 * Next.js Backend Framework Configuration
 */

import type { FrameworkConfig } from '../../types';
import { webContainerExecutor } from '../../../executors/backend/webcontainer-executor';
import { nextjsTemplates } from './templates';

export const nextjsConfig: FrameworkConfig<'backend'> = {
  id: 'nextjs',
  name: 'Next.js API Routes',
  type: 'backend',
  description: 'The React Framework for the Web - API Routes',
  icon: 'nextjs',
  color: '#000000', // Next.js black

  // Template configuration (backend uses file system structure)
  simpleTemplate: undefined, // Backend doesn't have simple mode
  advancedTemplate: nextjsTemplates,

  // Execution configuration
  executor: webContainerExecutor,

  // Backend-specific configuration
  defaultPort: 3001,
  startCommand: 'npm run dev',
  installCommand: 'npm install',
};
