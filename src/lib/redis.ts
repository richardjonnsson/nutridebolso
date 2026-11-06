import { Redis } from '@upstash/redis';

// Chaves de fallback caso ainda não tenham sido configuradas no painel da Vercel
const DEFAULT_REDIS_URL = 'https://close-muskrat-189511.upstash.io';
const DEFAULT_REDIS_TOKEN = 'gQAAAAAAAuRHAAIgcDE3MjA2ZDk2ZWE4NDY0MzRiYTYzMTg1NzhkMWMyN2U0Mw';

export function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || DEFAULT_REDIS_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || DEFAULT_REDIS_TOKEN;

  if (!url || !token) {
    console.warn('Upstash Redis credenciais não configuradas.');
    return null;
  }

  return new Redis({
    url,
    token,
  });
}
