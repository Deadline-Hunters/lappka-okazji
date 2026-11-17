import type { SegmentOption } from "@/components/SegmentedControl";

export type AuthMode = "login" | "register";

export const AUTH_MODES: SegmentOption<AuthMode>[] = [
  { id: "login", label: "Zaloguj się", icon: "log-in-outline" },
  { id: "register", label: "Zarejestruj się", icon: "person-add-outline" },
];
