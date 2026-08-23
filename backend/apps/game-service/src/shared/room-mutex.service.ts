import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomMutexService {
  private locks = new Map<string, Promise<unknown>>();

  async runExclusive<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const previous = this.locks.get(key) ?? Promise.resolve();

    let release!: () => void;
    const current = new Promise<void>((resolve) => (release = resolve));

    const chain = previous.then(() => current);
    this.locks.set(key, chain);

    await previous;

    try {
      return await fn();
    } finally {
      release();
      if (this.locks.get(key) === chain) {
        this.locks.delete(key);
      }
    }
  }
}