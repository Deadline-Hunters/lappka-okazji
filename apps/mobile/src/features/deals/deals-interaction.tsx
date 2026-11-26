import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { DealVote } from "./types";

type DealsInteractionContextValue = {
  votes: Record<string, DealVote>;
  bookmarkedIds: ReadonlySet<string>;
  isBookmarked: (dealId: string) => boolean;
  toggleBookmark: (dealId: string) => void;
  toggleVote: (dealId: string, vote: DealVote) => void;
};

const DealsInteractionContext =
  createContext<DealsInteractionContextValue | null>(null);

/**
 * Shared in-memory state for deal votes and bookmarks across Map, Deals list,
 * and Deal details until backend persistence (KAN-17) is connected.
 */
export function DealsInteractionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [votes, setVotes] = useState<Record<string, DealVote>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(
    () => new Set(),
  );

  const toggleVote = useCallback((dealId: string, vote: DealVote) => {
    setVotes((previous) => {
      const next = { ...previous };
      if (previous[dealId] === vote) {
        delete next[dealId];
      } else {
        next[dealId] = vote;
      }
      return next;
    });
  }, []);

  const toggleBookmark = useCallback((dealId: string) => {
    setBookmarkedIds((previous) => {
      const next = new Set(previous);
      if (next.has(dealId)) {
        next.delete(dealId);
      } else {
        next.add(dealId);
      }
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (dealId: string) => bookmarkedIds.has(dealId),
    [bookmarkedIds],
  );

  const value = useMemo(
    () => ({
      votes,
      bookmarkedIds,
      isBookmarked,
      toggleBookmark,
      toggleVote,
    }),
    [votes, bookmarkedIds, isBookmarked, toggleBookmark, toggleVote],
  );

  return (
    <DealsInteractionContext.Provider value={value}>
      {children}
    </DealsInteractionContext.Provider>
  );
}

export function useDealsInteraction() {
  const context = useContext(DealsInteractionContext);

  if (!context) {
    throw new Error(
      "useDealsInteraction must be used within DealsInteractionProvider",
    );
  }

  return context;
}
