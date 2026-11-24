import type { AuthMode } from "../types";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function AuthForm({
  mode,
  onForgotPassword,
  onConfirmEmail,
  onRegistered,
}: {
  mode: AuthMode;
  onForgotPassword: () => void;
  onConfirmEmail: () => void;
  onRegistered: (email: string) => void;
}) {
  return mode === "login" ? (
    <LoginForm
      onForgotPassword={onForgotPassword}
      onConfirmEmail={onConfirmEmail}
    />
  ) : (
    <RegisterForm onRegistered={onRegistered} />
  );
}
