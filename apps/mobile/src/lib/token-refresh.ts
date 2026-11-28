type RefreshClient = {
  startAutoRefresh(): Promise<void>;
  stopAutoRefresh(): Promise<void>;
};

export function createTokenRefreshController(
  auth: RefreshClient,
  onError: () => void,
) {
  let pending = Promise.resolve();

  return {
    update(state: string | null | undefined) {
      pending = pending
        .then(() =>
          state === "active" ? auth.startAutoRefresh() : auth.stopAutoRefresh(),
        )
        .catch(onError);
      return pending;
    },
  };
}
