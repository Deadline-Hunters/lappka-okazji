import AsyncStorage from "@react-native-async-storage/async-storage";

import { DEFAULT_PREFERENCES, type UserPreferencesDto } from "../types";

const STORAGE_KEY = "lappka.preferences.v1";

export interface IPreferencesService {
  getPreferences(): Promise<UserPreferencesDto>;
  savePreferences(preferences: UserPreferencesDto): Promise<void>;
  waitForPendingWrites(): Promise<void>;
}

/**
 * Stores preferences on the device until the Supabase `preferences` table exists.
 * The interface matches the future remote version:
 * `supabase.from('preferences').select().eq('user_id', uid).single()` / `.upsert(...)`.
 */
export class LocalPreferencesService implements IPreferencesService {
  private readonly pendingWrites = new Set<Promise<void>>();

  async getPreferences(): Promise<UserPreferencesDto> {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);

    try {
      const saved = stored
        ? (JSON.parse(stored) as Partial<UserPreferencesDto>)
        : {};
      // Merge over the defaults so fields added in later versions get a value.
      return { ...DEFAULT_PREFERENCES, ...saved };
    } catch {
      // Corrupted entry: start from the defaults instead of failing the screen.
      return DEFAULT_PREFERENCES;
    }
  }

  savePreferences(preferences: UserPreferencesDto): Promise<void> {
    const write = AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(preferences),
    );
    this.pendingWrites.add(write);
    void write.then(
      () => this.pendingWrites.delete(write),
      () => this.pendingWrites.delete(write),
    );
    return write;
  }

  async waitForPendingWrites(): Promise<void> {
    await Promise.allSettled(this.pendingWrites);
  }
}

export const preferencesService: IPreferencesService =
  new LocalPreferencesService();
