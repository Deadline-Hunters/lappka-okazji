import { MOCK_PROFILE } from "../data/mockProfile";
import type { MySubmissionDto, ProfileDto, UserProfileDto } from "../types";

export interface IProfileService {
  getProfile(): Promise<ProfileDto>;
  getUserSubmissions(userId?: string): Promise<MySubmissionDto[]>;
  getUser(userId?: string): Promise<UserProfileDto>;
}

/**
 * Service providing user profile data.
 *
 * Currently operates on mocked data conforming to target DTO schemas.
 * In future iterations, this will be replaced with Supabase queries:
 * e.g. `supabase.from('profiles').select(...)...`
 */
export class ProfileService implements IProfileService {
  /**
   * Fetches full user profile (user info, statistics, submissions).
   */
  async getProfile(): Promise<ProfileDto> {
    // Simulated async network call delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Note: React Native's Hermes engine does not support structuredClone out of the box,
    // so JSON serialization is used here for deep cloning this mock object.
    return JSON.parse(JSON.stringify(MOCK_PROFILE));
  }

  /**
   * Fetches submissions created by the user.
   */
  async getUserSubmissions(_userId?: string): Promise<MySubmissionDto[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return JSON.parse(JSON.stringify(MOCK_PROFILE.submissions));
  }

  /**
   * Fetches basic user information.
   */
  async getUser(_userId?: string): Promise<UserProfileDto> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return JSON.parse(JSON.stringify(MOCK_PROFILE.user));
  }
}

export const profileService = new ProfileService();
