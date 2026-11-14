import { MOCK_PROFILE } from "../data/mockProfile";
import type { MySubmissionDto, ProfileDto, UserProfileDto } from "../types";

export interface IProfileService {
  getProfile(): Promise<ProfileDto>;
  getUserSubmissions(userId?: string): Promise<MySubmissionDto[]>;
  getUser(userId?: string): Promise<UserProfileDto>;
}

/**
 * Serwis dostarczający dane profilu użytkownika.
 *
 * Aktualnie operuje na danych mockowych zgodnych z docelowym schematem DTO.
 * W przyszłości implementacja ta zostanie podmieniona na zapytania do bazy danych Supabase:
 * np. `supabase.from('profiles').select(...)...`
 */
export class ProfileService implements IProfileService {
  /**
   * Pobiera pełny profil użytkownika (dane użytkownika, statystyki, zgłoszenia).
   */
  async getProfile(): Promise<ProfileDto> {
    // Symulacja asynchronicznego pobierania danych z API / bazy
    await new Promise((resolve) => setTimeout(resolve, 300));
    return JSON.parse(JSON.stringify(MOCK_PROFILE));
  }

  /**
   * Pobiera listę zgłoszeń użytkownika.
   */
  async getUserSubmissions(_userId?: string): Promise<MySubmissionDto[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return JSON.parse(JSON.stringify(MOCK_PROFILE.submissions));
  }

  /**
   * Pobiera podstawowe informacje o użytkowniku.
   */
  async getUser(_userId?: string): Promise<UserProfileDto> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return JSON.parse(JSON.stringify(MOCK_PROFILE.user));
  }
}

export const profileService = new ProfileService();
