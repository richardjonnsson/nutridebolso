import { Redis } from '@upstash/redis';

export function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn('Upstash Redis credenciais não configuradas.');
    return null;
  }

  return new Redis({
    url,
    token,
  });
}
