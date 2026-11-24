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
      case "otp_expired":
      case "otp_disabled":
        return authTexts.errors.invalidCode;
      case "over_email_send_rate_limit":
      case "over_request_rate_limit":
        return authTexts.errors.rateLimit;
    }
  }

  console.error("Authentication request failed", error);
  return authTexts.errors.unknown;
}
