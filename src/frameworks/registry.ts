/**
 * Framework Registry
 * Central configuration for all supported frameworks
 */

import type { FrameworkId, FrameworkConfig, FrameworkRegistry } from './types';

// Import frontend framework configs
import { vanillaConfig } from './frontend/vanilla/config';
import { reactConfig } from './frontend/react/config';
import { vueConfig } from './frontend/vue/config';
import { svelteConfig } from './frontend/svelte/config';
import { angularConfig } from './frontend/angular/config';

// Import backend framework configs
import { expressConfig } from './backend/express/config';
import { fastifyConfig } from './backend/fastify/config';
import { nextjsConfig } from './backend/nextjs/config';
import { sveltekitConfig } from './backend/sveltekit/config';

/**
 * Framework registry - single source of truth for all frameworks
 */
export const FRAMEWORKS = {
  // Frontend frameworks
  vanilla: vanillaConfig,
  react: reactConfig,
  vue: vueConfig,
  svelte: svelteConfig,
  angular: angularConfig,

  // Backend frameworks
  express: expressConfig,
  fastify: fastifyConfig,
  nextjs: nextjsConfig,
  sveltekit: sveltekitConfig,
} as const;

/**
 * Get framework by ID
 */
export function getFramework(id: FrameworkId): FrameworkConfig | undefined {
  return FRAMEWORKS[id as keyof typeof FRAMEWORKS];
}

/**
 * Get all frontend frameworks
 */
export function getFrontendFrameworks(): FrameworkConfig<'frontend'>[] {
  return (Object.values(FRAMEWORKS) as FrameworkConfig[]).filter(
    (fw): fw is FrameworkConfig<'frontend'> => fw.type === 'frontend'
  );
}

/**
 * Get all backend frameworks
 */
export function getBackendFrameworks(): FrameworkConfig<'backend'>[] {
  return (Object.values(FRAMEWORKS) as FrameworkConfig[]).filter(
    (fw): fw is FrameworkConfig<'backend'> => fw.type === 'backend'
  );
}

/**
 * Get all framework IDs
 */
export function getAllFrameworkIds(): FrameworkId[] {
  return Object.keys(FRAMEWORKS) as FrameworkId[];
}

/**
 * Check if framework exists
 */
export function hasFramework(id: string): id is FrameworkId {
  return id in FRAMEWORKS;
}
