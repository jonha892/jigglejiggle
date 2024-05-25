const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI

const Spotify = {
  clientId: 'b8375cf2d4374fe1bc46bb48c054da1a',

  scopes: [
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
  ].join(', '),

  redirectUri: redirectUri, // vue dev server
} as const

export { Spotify }
