/**
 * Fastify Backend Framework Configuration
 */

import type { FrameworkConfig } from '../../types';
import { webContainerExecutor } from '../../../executors/backend/webcontainer-executor';
import { fastifyTemplates } from './templates';

export const fastifyConfig: FrameworkConfig<'backend'> = {
  id: 'fastify',
  name: 'Fastify',
  type: 'backend',
  description: 'Fast and low overhead web framework for Node.js',
  icon: 'fastify',
  color: '#000000', // Fastify black

  // Template configuration (backend uses file system structure)
  simpleTemplate: undefined, // Backend doesn't have simple mode
  advancedTemplate: fastifyTemplates,

  // Execution configuration
  executor: webContainerExecutor,

  // Backend-specific configuration
  defaultPort: 3001,
  startCommand: 'node server.js',
  installCommand: 'npm install',
};
