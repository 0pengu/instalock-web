/**
 * Custom fetch function that handles authentication errors, and cleares the auth state as needed
 */
export const fetchC = async (
  authStateFn: (auth: boolean) => void,
  input: RequestInfo,
  init?: RequestInit
) => {
  const res = await window.fetch(input, init);
  if (!res.ok) {
    if (res.status === 401) {
      authStateFn(false);
    }
  }
  return res;
};
