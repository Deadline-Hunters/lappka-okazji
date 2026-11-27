import { isAuthApiError } from "@supabase/supabase-js";

import { authTexts } from "./authTexts";

export function authErrorMessage(error: unknown): string {
  if (isAuthApiError(error)) {
    switch (error.code) {
      case "invalid_credentials":
        return authTexts.errors.invalidCredentials;
      case "email_not_confirmed":
        return authTexts.errors.emailNotConfirmed;
      case "user_already_exists":
      case "email_exists":
        return authTexts.errors.emailExists;
      case "weak_password":
        return authTexts.errors.weakPassword;
      case "email_address_invalid":
        return authTexts.errors.invalidEmail;
      case "otp_expired":
      case "otp_disabled":
        return authTexts.errors.invalidCode;
      case "over_email_send_rate_limit":
      case "over_request_rate_limit":
        return authTexts.errors.rateLimit;
    }
  }

  if (
    error instanceof TypeError ||
    (error instanceof Error &&
      /network request failed|failed to fetch|fetch failed/i.test(
        error.message,
      ))
  ) {
    return authTexts.errors.network;
  }

  console.error("Authentication request failed", error);
  return authTexts.errors.unknown;
}
