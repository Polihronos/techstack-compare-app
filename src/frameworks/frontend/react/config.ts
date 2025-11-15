/**
 * React Framework Configuration
 */

import type { FrameworkConfig } from '../../types';
import { ReactExecutor } from '../../../executors/frontend/react-executor';
import { reactSimpleTemplate } from './simple';
import { indexHtml, stylesCss, scriptJs } from './advanced';

export const reactConfig: FrameworkConfig<'frontend'> = {
  id: 'react',
  name: 'React',
  type: 'frontend',
  description: 'A JavaScript library for building user interfaces',
  icon: 'react',
  color: '#61DAFB', // React blue

  // Template configuration
  simpleTemplate: {
    code: reactSimpleTemplate,
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
  executor: new ReactExecutor(),

  // Editor configuration
  fileExtension: '.jsx',
  editorLanguage: 'javascript',

  // CDN libraries
  cdnLibraries: [
    {
      url: 'https://unpkg.com/react@18/umd/react.production.min.js',
      global: 'React',
    },
    {
      url: 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
      global: 'ReactDOM',
    },
    {
      url: 'https://unpkg.com/@babel/standalone/babel.min.js',
      global: 'Babel',
    },
  ],
};
