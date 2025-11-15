/**
 * Svelte Framework Configuration
 */

import type { FrameworkConfig } from '../../types';
import { SvelteExecutor } from '../../../executors/frontend/svelte-executor';
import { svelteSimpleTemplate } from './simple';
import { indexHtml, stylesCss, appSvelte } from './advanced';

export const svelteConfig: FrameworkConfig<'frontend'> = {
  id: 'svelte',
  name: 'Svelte',
  type: 'frontend',
  description: 'Cybernetically enhanced web apps',
  icon: 'svelte',
  color: '#ff3e00', // Svelte orange

  // Template configuration
  simpleTemplate: {
    code: svelteSimpleTemplate,
    language: 'html', // Monaco treats Svelte as HTML
  },
  advancedTemplate: {
    files: {
      'index.html': indexHtml,
      'styles.css': stylesCss,
      'App.svelte': appSvelte,
    },
  },

  // Execution configuration
  executor: new SvelteExecutor(),

  // Editor configuration
  fileExtension: '.svelte',
  editorLanguage: 'html',
};
