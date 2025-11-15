/**
 * Vue 3 Framework Configuration
 */

import type { FrameworkConfig } from '../../types';
import { VueExecutor } from '../../../executors/frontend/vue-executor';
import { vueSimpleTemplate } from './simple';
import { indexHtml, stylesCss, scriptJs } from './advanced';

export const vueConfig: FrameworkConfig<'frontend'> = {
  id: 'vue',
  name: 'Vue 3',
  type: 'frontend',
  description: 'The Progressive JavaScript Framework',
  icon: 'vue',
  color: '#42b883', // Vue green

  // Template configuration
  simpleTemplate: {
    code: vueSimpleTemplate,
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
  executor: new VueExecutor(),

  // Editor configuration
  fileExtension: '.js',
  editorLanguage: 'javascript',

  // CDN libraries
  cdnLibraries: [
    {
      url: 'https://unpkg.com/vue@3/dist/vue.global.js',
      global: 'Vue',
    },
  ],
};
