/**
 * Checks if all required environment variables are set.
 * Throws an error if any of them is missing.
 * @param keys - List of environment variables to check.
 * @returns the checked environment variables values in an object.
 */
export const checkRequiredEnvs = <T extends object>(keys: (keyof T)[]): T => {
  const result = {} as T;

  const missingEnvs = keys.filter((key) => {
    result[key] = (process.env as T)[key];
    return !result[key];
  });

  if (missingEnvs.length) {
    throw new Error(`Missing required environment variables: ${missingEnvs.join(', ')}`);
  }

  return result;
};
