/**
 * Express.js Backend Framework Configuration
 */

import type { FrameworkConfig } from '../../types';
import { webContainerExecutor } from '../../../executors/backend/webcontainer-executor';
import { expressTemplates } from './templates';

export const expressConfig: FrameworkConfig<'backend'> = {
  id: 'express',
  name: 'Express.js',
  type: 'backend',
  description: 'Fast, unopinionated, minimalist web framework for Node.js',
  icon: 'express',
  color: '#000000', // Express black

  // Template configuration (backend uses file system structure)
  simpleTemplate: undefined, // Backend doesn't have simple mode
  advancedTemplate: expressTemplates,

  // Execution configuration
  executor: webContainerExecutor,

  // Backend-specific configuration
  defaultPort: 3001,
  startCommand: 'node server.js',
  installCommand: 'npm install',
};
