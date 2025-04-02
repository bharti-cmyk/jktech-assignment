export function parseIntSafe(num: string | undefined, fallback: number): number {
  if (!num) return fallback;
  return !isNaN(parseInt(num, 10)) ? parseInt(num) : fallback;
}

export const getConfig = () => ({
  port: 'PORT',
  appEnv: 'APP_ENV',
  redis: {
    host: 'REDIS_HOST',
    port: 'REDIS_PORT',
  },
});

export interface AppConfig {
  port: number;
  appEnv: string;
  redis: RedisConfig;
}

export interface RedisConfig {
  host: string;
  port: number;
}
