/**
 * Full-Stack Template Registry
 * Central registry for all full-stack templates
 */

import type { FullStackTemplateRegistry } from './types';
import { reactExpressTodo } from './react-express-todo';

/**
 * Registry of all available full-stack templates
 */
export const FULLSTACK_TEMPLATES: FullStackTemplateRegistry = {
  [reactExpressTodo.id]: reactExpressTodo,
};

/**
 * Get a fullstack template by ID
 */
export function getFullStackTemplate(id: string) {
  return FULLSTACK_TEMPLATES[id];
}

/**
 * Get all fullstack templates
 */
export function getAllFullStackTemplates() {
  return Object.values(FULLSTACK_TEMPLATES);
}

/**
 * Get templates for a specific framework combination
 */
export function getTemplatesForFrameworks(
  frontendFramework: string,
  backendFramework: string
) {
  return getAllFullStackTemplates().filter(
    (template) =>
      template.frontendFramework === frontendFramework &&
      template.backendFramework === backendFramework
  );
}
