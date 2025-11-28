export const messages = {
  en: {
    auth: {
      invalidCredentials: 'Invalid email or password.',
      accountInactive: 'Account is inactive.',
      refreshTokenInvalid: 'Refresh token is invalid or expired.',
      loggedOut: 'Logged out successfully.',
    },
  },
  fr: {
    auth: {
      invalidCredentials: 'Email ou mot de passe invalide.',
      accountInactive: 'Le compte est inactif.',
      refreshTokenInvalid:
        'Le jeton de rafraîchissement est invalide ou expiré.',
      loggedOut: 'Déconnexion réussie.',
    },
  },
} as const;

export type SupportedLocale = keyof typeof messages;
