export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidUsername(username: string): boolean {
  return /^[A-Za-z0-9_.]{3,30}$/.test(username);
}

export function isValidRegistrationAge(age: string): boolean {
  return /^(?:1[3-9]|[2-9][0-9]|1[0-4][0-9]|150)$/.test(age);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}
