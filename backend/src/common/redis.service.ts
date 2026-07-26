import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private isConnected = false;

  onModuleInit() {
    // Connect to the Redis endpoint inside the Docker-Compose network
    const host = process.env.REDIS_HOST || 'localhost';
    const port = parseInt(process.env.REDIS_PORT || '6379', 10);
    const password = process.env.REDIS_PASSWORD;

    this.client = new Redis({
      host,
      port,
      password,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });

    this.client.connect()
      .then(() => {
        this.isConnected = true;
        console.log('Redis Cache connection established successfully (Supabase Proxy Node)');
      })
      .catch((err) => {
        console.warn('Redis Cache failed to connect. Falling back to memory adapter in developer-offline-sandbox:', err.message);
      });
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (this.isConnected) {
      if (ttlSeconds) {
        await this.client.set(key, serialized, 'EX', ttlSeconds);
      } else {
        await this.client.set(key, serialized);
      }
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.isConnected) {
      const data = await this.client.get(key);
      if (data) {
        return JSON.parse(data) as T;
      }
    }
    return null;
  }

  async del(key: string): Promise<void> {
    if (this.isConnected) {
      await this.client.del(key);
    }
  }

  async flushAll(): Promise<void> {
    if (this.isConnected) {
      await this.client.flushall();
    }
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.disconnect();
    }
  }
}
