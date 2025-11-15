/**
 * Angular Framework Configuration
 */

import type { FrameworkConfig } from '../../types';
import { AngularExecutor } from '../../../executors/frontend/angular-executor';
import { angularSimpleTemplate } from './simple';
import { indexHtml, stylesCss, counterComponentTs } from './advanced';

export const angularConfig: FrameworkConfig<'frontend'> = {
  id: 'angular',
  name: 'Angular',
  type: 'frontend',
  description: 'The modern web developer platform',
  icon: 'angular',
  color: '#dd0031', // Angular red

  // Template configuration
  simpleTemplate: {
    code: angularSimpleTemplate,
    language: 'typescript',
  },
  advancedTemplate: {
    files: {
      'index.html': indexHtml,
      'styles.css': stylesCss,
      'counter.component.ts': counterComponentTs,
    },
  },

  // Execution configuration
  executor: new AngularExecutor(),

  // Editor configuration
  fileExtension: '.ts',
  editorLanguage: 'typescript',

  // CDN libraries
  cdnLibraries: [
    {
      url: 'https://unpkg.com/typescript@latest/lib/typescript.js',
      global: 'ts',
    },
  ],
};
