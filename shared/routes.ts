import { z } from 'zod';
import { simulationState } from './schema';

export const api = {
  simulation: {
    get: {
      method: 'GET' as const,
      path: '/api/simulation' as const,
      responses: {
        200: z.custom<typeof simulationState.$inferSelect>(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
