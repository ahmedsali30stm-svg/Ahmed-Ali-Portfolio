"use client";

import { useEngineContext } from "./EngineProvider";

/**
 * Access the ExperienceEngine instance and navigation controls.
 *
 * @example
 * ```tsx
 * const { navigateTo, currentScene, fps } = useEngine();
 * ```
 */
export function useEngine() {
  return useEngineContext();
}
