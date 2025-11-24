export type BoundingBox = {
  west?: number;
  south?: number;
  east?: number;
  north?: number;
};

export const DEFAULT_MAP_ZOOM = 5;

export const sanitizeFilters = (filters: Record<string, any>) => {
  const sanitized: Record<string, any> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      return;
    }

    sanitized[key] = value instanceof Date ? value.toISOString() : value;
  });

  return Object.keys(sanitized).length ? sanitized : undefined;
};
