export interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  { id: 'length', label: 'Mínimo de 6 caracteres', test: (p) => p.length >= 6 },
  { id: 'uppercase', label: 'Uma letra maiúscula', test: (p) => /[A-Z]/.test(p) },
  { id: 'number', label: 'Um número', test: (p) => /[0-9]/.test(p) },
  {
    id: 'special',
    label: 'Um caractere especial',
    test: (p) => /[^A-Za-z0-9]/.test(p)
  }
];

export function isPasswordValid(password: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

export function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
