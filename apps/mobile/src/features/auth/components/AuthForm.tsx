import type { AuthMode } from "../types";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function AuthForm({ mode }: { mode: AuthMode }) {
  return mode === "login" ? <LoginForm /> : <RegisterForm />;
}
