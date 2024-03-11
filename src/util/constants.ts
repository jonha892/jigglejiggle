const Spotify = {
  clientId: 'b8375cf2d4374fe1bc46bb48c054da1a',
  clientSecret: '3807f249a21241f78209b02414f268c1',

  scopes: [
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
  ].join(', '),

  redirectUri: 'http://localhost:5173', // vue dev server
} as const

export { Spotify }
