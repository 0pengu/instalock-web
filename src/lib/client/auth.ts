import { create } from "zustand";

type AuthStore = {
  auth: boolean;
  setAuth: (value: boolean) => void;
};

/**
 * A store for managing the authentication state of the client.
 *
 * NOTE: THIS DOES NOT ACTUALLY HANDLE AUTHENTICATION, IT JUST STORES THE STATE.
 * You should use the `useCheckAuth` function to actually check if the user is authenticated.
 * @returns `AuthStore` - The store for managing the authentication state.
 * @example
 * ```tsx
 *  useEffect(() => {
    const auth = authStore.getState().auth;
    if (auth) {
      notifications.show({
        title: "Already logged in",
        message: "Redirecting to dashboard...",
      });
      navigate("/dashboard");
    }
  }, []);
  ```
 *
 */
export const authStore = create<AuthStore>()((set) => ({
  auth: false,
  setAuth: (value) => set({ auth: value }),
}));

/**
 * Makes a network request to the backend to check if the user is authenticated.
 * @returns `boolean` - `true` if the user is authenticated, `false` otherwise.
 * @example
 * ```ts
 * useEffect(() => {
 *   useAuthCheck().then((auth) => {
 *     authStore.getState().setAuth(auth);
 *     if (auth) {
 *       notifications.show({
 *         title: "Already logged in",
 *         message: "Redirecting to dashboard...",
 *       });
 *       navigate("/dashboard");
 *     }
 *   });
 * }, []);
 * ```
 */
export async function useAuthCheck() {
  const res = await fetch("/api/auth/check");
  if (res.status === 200) {
    return true;
  }
  return false;
}
