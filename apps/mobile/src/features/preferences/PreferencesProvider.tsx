import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { preferencesService } from "./services/preferencesService";
import type { UserPreferencesDto } from "./types";

type PreferencesContextValue = {
  preferences: UserPreferencesDto | null;
  isLoading: boolean;
  loadError: Error | null;
  saveFailed: boolean;
  // Applies the change at once and saves it in the background.
  update: (change: (current: UserPreferencesDto) => UserPreferencesDto) => void;
  reload: () => Promise<void>;
  retrySave: () => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

/**
 * Shared preferences state, so a change in Preferencje reaches other tabs (e.g. Mapa) at once.
 * Optimistic updates: the UI changes immediately and a failed save shows an error with
 * a retry, keeping the user's choice on screen.
 */
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferencesDto | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);
  // Latest value, so quick successive changes build on each other.
  const latest = useRef<UserPreferencesDto | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      latest.current = await preferencesService.getPreferences();
      setPreferences(latest.current);
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error
          : new Error("Nie udało się wczytać preferencji."),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const retrySave = useCallback(() => {
    if (!latest.current) {
      return;
    }
    setSaveFailed(false);
    preferencesService
      .savePreferences(latest.current)
      .catch(() => setSaveFailed(true));
  }, []);

  const update = useCallback(
    (change: (current: UserPreferencesDto) => UserPreferencesDto) => {
      if (!latest.current) {
        return;
      }
      latest.current = change(latest.current);
      setPreferences(latest.current);
      retrySave();
    },
    [retrySave],
  );

  const value = useMemo(
    () => ({
      preferences,
      isLoading,
      loadError,
      saveFailed,
      update,
      reload,
      retrySave,
    }),
    [preferences, isLoading, loadError, saveFailed, update, reload, retrySave],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }

  return context;
}
