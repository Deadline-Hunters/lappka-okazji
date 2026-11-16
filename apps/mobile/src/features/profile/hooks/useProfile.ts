import { useCallback, useEffect, useState } from "react";

import { profileService } from "../services/profileService";
import type { ProfileDto } from "../types";

export interface UseProfileResult {
  profile: ProfileDto | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for managing user profile state, loading status, and errors.
 */
export function useProfile(): UseProfileResult {
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Nie udało się pobrać profilu użytkownika."),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
  };
}
