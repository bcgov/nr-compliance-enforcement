const parkNameCache: Record<string, string> = {};

/**
 * Get a cached park name by guid.
 * @param guid - The unique identifier of the park.
 * @returns The cached name or undefined if not found.
 */
export function getCachedParkName(guid: string): string | undefined {
  return parkNameCache[guid];
}

/**
 * Store a park name in the cache.
 * @param guid - The unique identifier of the park.
 * @param name - The park name to cache.
 */
export function setCachedParkName(guid: string, name: string): void {
  parkNameCache[guid] = name;
}
