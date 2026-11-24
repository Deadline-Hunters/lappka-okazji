export const authTexts = {
  fields: {
    email: "E-mail",
    emailPlaceholder: "np. email@gmail.com",
    username: "Nickname",
    usernamePlaceholder: "np. lowca_okazji",
    age: "Wiek",
    agePlaceholder: "np. 18",
    password: "Hasło",
    passwordPlaceholder: "••••••••",
    confirmPassword: "Powtórz hasło",
    newPassword: "Nowe hasło",
    confirmNewPassword: "Powtórz nowe hasło",
    confirmationCode: "Kod potwierdzający z wiadomości",
    recoveryCode: "Kod z wiadomości",
  },
  actions: {
    login: "Zaloguj się",
    register: "Utwórz darmowe konto",
    forgotPassword: "Nie pamiętasz hasła?",
    confirmEmail: "Potwierdź e-mail",
    sendCode: "Wyślij kod",
    resendCode: "Wyślij kod ponownie",
    changePassword: "Zmień hasło",
    backToLogin: "Wróć do logowania",
  },
  alertTitles: {
    checkData: "Sprawdź dane",
    checkEmail: "Sprawdź pocztę",
    loginFailed: "Nie udało się zalogować",
    registrationFailed: "Nie udało się utworzyć konta",
    confirmEmailFailed: "Nie udało się potwierdzić e-maila",
    sendCodeFailed: "Nie udało się wysłać kodu",
    changePasswordFailed: "Nie udało się zmienić hasła",
    logoutFailed: "Nie udało się wylogować",
    passwordChanged: "Hasło zmienione",
  },
  validation: {
    email: "Podaj prawidłowy adres e-mail.",
    login: "Podaj prawidłowy e-mail i hasło.",
    emailAndCode: "Podaj e-mail i sześciocyfrowy kod.",
    code: "Podaj sześciocyfrowy kod z wiadomości.",
    username:
      "Nickname musi mieć 3–30 znaków: litery bez polskich znaków, cyfry, kropki lub podkreślenia.",
    age: "Podaj wiek od 13 do 150 lat.",
    password: "Hasło musi mieć co najmniej 6 znaków.",
    passwordsMismatch: "Hasła muszą być takie same.",
  },
  notices: {
    registrationConfirmation:
      "Jeśli rejestracja wymaga potwierdzenia, otrzymasz kod e-mailem. Jeśli masz już konto, zaloguj się.",
    confirmationCodeSent:
      "Jeśli konto wymaga potwierdzenia, otrzymasz kod w wiadomości e-mail.",
    recoveryCodeSent:
      "Jeśli konto istnieje, otrzymasz wiadomość z kodem resetowania hasła.",
    passwordChanged: "Możesz korzystać z aplikacji.",
  },
  errors: {
    invalidCredentials: "Nieprawidłowy e-mail lub hasło.",
    emailNotConfirmed: "Potwierdź swój adres e-mail przed zalogowaniem.",
    emailExists:
      "Nie udało się utworzyć konta. Sprawdź podane dane lub zaloguj się.",
    invalidCode: "Kod jest nieprawidłowy lub wygasł. Poproś o nowy kod.",
    rateLimit: "Zbyt wiele prób. Odczekaj chwilę i spróbuj ponownie.",
    registration:
      "Sprawdź połączenie i dane. Nickname musi być unikalny. Jeśli problem nie ustąpi, spróbuj ponownie później.",
    unknown:
      "Nie udało się wykonać operacji. Sprawdź połączenie i spróbuj ponownie.",
  },
} as const;
