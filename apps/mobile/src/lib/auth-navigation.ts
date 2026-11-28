const RETURN_ROUTES = {
  "/": "/(tabs)",
  "/deals": "/(tabs)/deals",
  "/coupons": "/(tabs)/coupons",
  "/profile": "/(tabs)/profile",
  "/preferences": "/(tabs)/preferences",
} as const;

export type ReturnPath = keyof typeof RETURN_ROUTES;
type ReturnRoute = (typeof RETURN_ROUTES)[ReturnPath];

export function getReturnPath(path: unknown): ReturnPath {
  switch (path) {
    case "/":
    case "/deals":
    case "/coupons":
    case "/profile":
    case "/preferences":
      return path;
    default:
      return "/";
  }
}

export function getReturnRoute(path: unknown) {
  return RETURN_ROUTES[getReturnPath(path)];
}

export function hasAccount(session: unknown): boolean {
  return session != null;
}

export function createAuthReturnController() {
  let openedFromApp = false;

  return {
    markOpened() {
      openedFromApp = true;
    },
    clear() {
      openedFromApp = false;
    },
    returnFromAuth(
      router: {
        canGoBack(): boolean;
        back(): void;
        replace(route: ReturnRoute): void;
      },
      returnTo: unknown,
    ) {
      const goBack = openedFromApp && router.canGoBack();
      openedFromApp = false;
      if (goBack) {
        router.back();
      } else {
        router.replace(getReturnRoute(returnTo));
      }
    },
  };
}
