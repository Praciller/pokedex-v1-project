// Simple in-memory cache for API responses
class ApiCache {
  private cache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();

  // Default TTL: 5 minutes
  private defaultTTL = 5 * 60 * 1000;

  set(key: string, data: any, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // Check if cache has expired
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  has(key: string): boolean {
    const cached = this.cache.get(key);

    if (!cached) {
      return false;
    }

    // Check if cache has expired
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  // Remove expired entries
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((value, key) => {
      if (now - value.timestamp > value.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  // Get cache statistics
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Create a singleton instance
export const apiCache = new ApiCache();

// Cleanup expired entries every 10 minutes
setInterval(() => {
  apiCache.cleanup();
}, 10 * 60 * 1000);
