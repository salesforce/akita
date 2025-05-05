import { AES, enc } from 'crypto-js';
import { PersistStateStorage } from "./persistState";
import { MaybeAsync } from './types';

export class EncryptedPersistStateStorageAdapter implements PersistStateStorage {

  constructor(private encryptionKey: string, private persistStateStorage: PersistStateStorage) { }

  getItem(key: string): MaybeAsync {
    try {
      const data = this.persistStateStorage.getItem(key);
      if (data) {
        const bytes = AES.decrypt(data, this.encryptionKey);
        const originalData = bytes.toString(enc.Utf8);
        return JSON.parse(originalData);
      }
      return null;
    } catch (e) {
      console.error('Failed to get encrypted item from storage:', e);
      return null;
    }
  }

  setItem(key: string, value: any): MaybeAsync {
    try {
      const data = JSON.stringify(value);
      const encryptedData = AES.encrypt(enc.Utf8.parse(data), this.encryptionKey).toString();
      this.persistStateStorage.setItem(key, encryptedData);
    } catch (e) {
      console.error('Failed to set item encrypted:', e);
    }
  }

  clear(): void {
    try {
      this.persistStateStorage.clear();
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
  }
}
