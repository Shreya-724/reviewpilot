// The access token lives only in memory. It disappears on page reload,
// and the app restores it from the HttpOnly refresh cookie on startup.
let accessToken: string | null = null;

export const tokenStore = {
  get: () => accessToken,
  set: (token: string | null) => {
    accessToken = token;
  },
};