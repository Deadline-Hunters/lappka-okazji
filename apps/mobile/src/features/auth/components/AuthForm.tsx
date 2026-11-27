import type { AuthMode } from "../types";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function AuthForm({
  mode,
  onConfirmEmail,
  onRegistered,
}: {
  mode: AuthMode;
  onConfirmEmail: () => void;
  onRegistered: (email: string) => void;
}) {
  return mode === "login" ? (
    <LoginForm onConfirmEmail={onConfirmEmail} />
  ) : (
    <RegisterForm onRegistered={onRegistered} />
  );
}
