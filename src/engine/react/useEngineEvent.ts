"use client";

import { useEffect } from "react";
import { useEngineContext } from "./EngineProvider";
import type { EngineEvent } from "../types";

/**
 * Subscribe to engine events with automatic cleanup.
 *
 * @example
 * ```tsx
 * useEngineEvent("scene:enter", (event) => {
 *   console.log("Entered scene:", event.sceneId);
 * });
 * ```
 */
export function useEngineEvent<T extends EngineEvent["type"]>(
  type: T,
  handler: (event: Extract<EngineEvent, { type: T }>) => void
) {
  const { onEvent } = useEngineContext();

  useEffect(() => {
    return onEvent((event) => {
      if (event.type === type) {
        handler(event as Extract<EngineEvent, { type: T }>);
      }
    });
  }, [type, handler, onEvent]);
}
