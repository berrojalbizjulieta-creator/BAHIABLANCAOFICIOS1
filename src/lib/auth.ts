// lib/auth.ts
export const ADMIN_EMAIL = "berrojalbizjulieta@gmail.com";

export function esAdmin(userEmail?: string) {
  if (!userEmail) return false;
  return userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
