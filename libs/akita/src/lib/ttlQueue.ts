import { ID } from '@datorama/akita';
import { Subject } from 'rxjs';

export enum TTLType {
  Store = 'STORE',
  Entity = 'ENTITY',
}

export interface TTL {
  /**
   * Optional entity id of the TTL.
   */
  id?: ID;

  /**
   * The ttl type:
   * - {@link TTLType.Store} for the expiration of the store itself.
   * - {@link TTLType.Entity} for the expiration of an entity of the store.
   */
  type: TTLType;

  /**
   * Absolute ttl in milliseconds when it expires.
   */
  when: number;
}

/**
 * Implements a fixed priority scheduler to handle the expiration of objects sequentially within a single event loop.
 */
export class TTLQueue {
  /**
   * A list of all ttl objects
   */
  private _ttls: TTL[] = [];

  /**
   * The current event loop id (timeout id)
   */
  private _loop: number | undefined;

  /**
   * Observable for notifying expired entity ids.
   */
  readonly expired$ = new Subject<{ type: TTLType; id?: ID }>();

  /**
   * Indicates whether the cache has ttl entries and the loop is running.
   */
  get isLooping() {
    return this._loop !== undefined;
  }

  get size() {
    return this._ttls.length;
  }

  peek() {
    return this._ttls[0];
  }

  /**
   * Adds a new ttl object to the cache.
   * @param type The ttl type.
   * @param id The entity id.
   * @param ttl The relative ttl in milliseconds.
   */

  update(ttl: number, type: TTLType.Store, id: undefined): void;
  update(ttl: number, type: TTLType.Entity, id: ID): void;
  update(ttl: number, type: TTLType, id: ID | undefined) {
    this.cancel(type as any, id);

    const newTTL = {
      type,
      id,
      when: ttl + Date.now(),
    };

    if (newTTL.when < +Date.now()) {
      this.expired(newTTL, false);
      return;
    }

    const newTLLIndex = this._ttls.findIndex((oldTTL) => newTTL.when <= oldTTL.when);

    if (newTLLIndex >= 0) {
      this._ttls = [...this._ttls.slice(0, newTLLIndex), newTTL, ...this._ttls.slice(newTLLIndex)];
    } else {
      this._ttls.push(newTTL);
    }

    this.loop();
  }

  /**
   * Cancel a ttl.
   * @param type The ttl type to cancel.
   * @param id The entity id to cancel for the {@link TTLType.Entity} ttl type.
   */
  cancel(type: TTLType.Store, id: undefined, reschedule?: boolean): void;
  cancel(type: TTLType.Entity, id: ID, reschedule?: boolean): void;
  cancel(type: TTLType, id: ID | undefined, reschedule = true) {
    const oldTTLIndex = this._ttls.findIndex((ttl) => ttl.type === type && ttl.id === id);

    if (!!~oldTTLIndex) {
      const oldTTL = this._ttls[oldTTLIndex];
      this._ttls = [...this._ttls.slice(0, oldTTLIndex), ...this._ttls.slice(oldTTLIndex + 1)];

      if (reschedule) {
        this.loop();
      }

      return oldTTL;
    }

    return undefined;
  }

  reset() {
    if (this._loop) {
      clearTimeout(this._loop);
      this._loop = undefined;
    }

    this._ttls = [];
  }

  private expired(ttl: TTL, reschedule: boolean) {
    this.cancel(ttl.type as any, ttl.id, reschedule);
    this.expired$.next({ type: ttl.type, id: ttl.id });
  }

  private loop() {
    if (this._loop) {
      clearTimeout(this._loop);
      this._loop = undefined;
    }

    if (this.size === 0) {
      return;
    }

    const nextTTL = this.peek();
    const timeout = nextTTL.when - Date.now();

    this._loop = setTimeout(() => {
      this.test();
      this.loop();
    }, timeout) as any;
  }

  private test() {
    const now = Date.now();

    // check if there are other ttls
    // that are already expired.
    while (this.size) {
      const next = this.peek();

      if (next.when <= now) {
        this.expired(next, false);
      } else {
        break;
      }
    }
  }
}
