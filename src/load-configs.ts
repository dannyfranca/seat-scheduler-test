import { checkRequiredEnvs } from './utils/check-required-envs';

/**
 * Depending on the runtime, environment variables might not be the safest place to store some secrets, since it can be inspected by users who have read-only access to the deployed resource. A async function to retrieve the secrets from a secret store at runtime may be desirable.
 */
export async function loadConfigs() {
  // POSTGRES_URI and REDIS_URI could potentially be loaded from a secret store
  return checkRequiredEnvs<AppConfig>(['APP_NAME', 'PORT', 'POSTGRES_URI', 'REDIS_URI']);
}
