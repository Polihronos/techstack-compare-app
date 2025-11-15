/**
 * Vanilla JS Framework Configuration
 */

import type { FrameworkConfig } from '../../types';
import { VanillaExecutor } from '../../../executors/frontend/vanilla-executor';
import { vanillaSimpleTemplate } from './simple';
import { indexHtml, stylesCss, scriptJs } from './advanced';

export const vanillaConfig: FrameworkConfig<'frontend'> = {
  id: 'vanilla',
  name: 'Vanilla JS',
  type: 'frontend',
  description: 'Pure JavaScript without any framework',
  icon: 'vanilla', // Will be mapped to icon component
  color: '#f7df1e', // JavaScript yellow

  // Template configuration
  simpleTemplate: {
    code: vanillaSimpleTemplate,
    language: 'javascript',
  },
  advancedTemplate: {
    files: {
      'index.html': indexHtml,
      'styles.css': stylesCss,
      'script.js': scriptJs,
    },
  },

  // Execution configuration
  executor: new VanillaExecutor(),

  // Editor configuration
  fileExtension: '.js',
  editorLanguage: 'javascript',
};
