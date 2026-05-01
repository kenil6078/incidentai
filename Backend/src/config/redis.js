/**
 * ============================================================
 * ROLE: Redis client setup using ioredis.
 *
 * WHAT IT DOES:
 *  - Creates a single ioredis client instance (singleton)
 *  - Used for:
 *    1. JWT Access Token Blacklisting (on logout)
 *    2. Refresh Token storage
 *    3. Rate limiting / caching
 *  - connectRedis() is called in server.js boot sequence
 *  - redisClient is exported for use in services/middleware
 * ============================================================
 */

import Redis from 'ioredis';
import { config } from './config.js';

// Singleton Redis client instance
let redisClient = null;

export function getRedisClient() {
    if (!redisClient) {
        redisClient = new Redis({
            host: config.REDIS_HOST || '127.0.0.1',
            port: config.REDIS_PORT || 6379,
            password: config.REDIS_PASSWORD || undefined,
            retryStrategy: (times) => Math.min(times * 50, 2000),
        });

        redisClient.on('error', (err) => {
            console.error('❌ Redis error:', err.message);
        });
    }
    return redisClient;
}

export async function connectRedis() {
    const client = getRedisClient();
    // Ping to verify connection
    const pong = await client.ping();
    if (pong === 'PONG') {
        console.log('✅ Redis connected successfully');
    }
}
