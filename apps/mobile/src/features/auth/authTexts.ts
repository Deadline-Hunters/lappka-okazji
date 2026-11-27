export const authTexts = {
  fields: {
    email: "E-mail",
    emailPlaceholder: "np. email@gmail.com",
    password: "Hasło",
    passwordPlaceholder: "••••••••",
    confirmPassword: "Powtórz hasło",
    confirmationCode: "Kod potwierdzający z wiadomości",
  },
  actions: {
    login: "Zaloguj się",
    register: "Utwórz darmowe konto",
    confirmEmail: "Potwierdź e-mail",
    resendCode: "Wyślij kod ponownie",
    backToLogin: "Wróć do logowania",
  },
  alertTitles: {
    checkData: "Sprawdź dane",
    checkEmail: "Sprawdź pocztę",
    loginFailed: "Nie udało się zalogować",
    registrationFailed: "Nie udało się utworzyć konta",
    confirmEmailFailed: "Nie udało się potwierdzić e-maila",
    sendCodeFailed: "Nie udało się wysłać kodu",
  },
  validation: {
    email: "Podaj prawidłowy adres e-mail.",
    login: "Podaj prawidłowy e-mail i hasło.",
    emailAndCode: "Podaj e-mail i sześciocyfrowy kod.",
    password: "Hasło musi mieć co najmniej 6 znaków.",
    passwordsMismatch: "Hasła muszą być takie same.",
  },
  notices: {
    registrationConfirmation:
      "Wysłaliśmy kod potwierdzający na podany adres e-mail. Wpisz go, aby aktywować konto.",
    confirmationCodeSent:
      "Jeśli adres wymaga potwierdzenia, otrzymasz kod w wiadomości e-mail.",
  },
  errors: {
    invalidCredentials: "Nieprawidłowy e-mail lub hasło.",
    emailNotConfirmed: "Potwierdź swój adres e-mail przed zalogowaniem.",
    emailExists:
      "Ten adres e-mail jest już zarejestrowany. Zaloguj się lub użyj innego adresu.",
    weakPassword: "Hasło jest zbyt słabe. Użyj co najmniej 6 znaków.",
    invalidEmail: "Podaj prawidłowy adres e-mail.",
    invalidCode: "Kod jest nieprawidłowy lub wygasł. Poproś o nowy kod.",
    rateLimit: "Zbyt wiele prób. Odczekaj chwilę i spróbuj ponownie.",
    network:
      "Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie.",
    unknown:
      "Nie udało się wykonać operacji. Sprawdź połączenie i spróbuj ponownie.",
  },
} as const;
