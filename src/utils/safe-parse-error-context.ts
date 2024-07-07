import { toJson } from './to-json';

/**
 * Safely parse a thrown value, making sure it is type safe by having at least a message property.
 * @param error - The error to parse
 * @returns The parsed error context
 */
export const safeParseErrorContext = (error: unknown): Record<string, unknown> & { message: string } => {
  if (!error) return { message: '' };
  if (typeof error === 'string') return { message: error };
  if (typeof error === 'object') {
    const json = toJson(error) as Record<string, unknown> & { message: string };
    json.message = json.message ?? '';
    return json;
  }

  return { message: error.toString() };
};
