import { defineNuxtRouteMiddleware, navigateTo, useNuxtApp, useCookie } from "#app";

export default defineNuxtRouteMiddleware(async (to) => {
  const { $auth } = useNuxtApp();
  const sessionCookie = useCookie("firebase-session");
  const isAuthenticated = useState('isAuthenticated', () => false);

  // Server-side check (basic validation)
  if (process.server) {
    if (!sessionCookie.value) return navigateTo("/login");
    return; // Deeper validation happens on client side
  }

  // Client-side handling
  const { $logout } = useNuxtApp();
  
  // Wait for Firebase initialization
  await new Promise((resolve) => {
    const unsubscribe = $auth.onAuthStateChanged(async (user) => {
      unsubscribe();
      if (user) {
        // Sync Firebase token with session cookie
        try {
          const token = await user.getIdToken();
          sessionCookie.value = token;
          isAuthenticated.value = true;
        } catch (error) {
          console.error("Token refresh failed:", error);
          await handleLogout();
        }
      }
      resolve(true);
    });
  });

  if (!isAuthenticated.value) {
    return await handleLogout();
  }

  // Token maintenance system
  const currentUser = $auth.currentUser;
  if (currentUser) {
    // Set up token refresh listener
    currentUser.getIdTokenResult().then((tokenResult) => {
      const refreshTime = new Date(tokenResult.expirationTime).getTime() - (5 * 60 * 1000); // Refresh 5 min before expiry
      setTimeout(async () => {
        try {
          const freshToken = await currentUser.getIdToken(true);
          sessionCookie.value = freshToken;
        } catch (error) {
          await handleLogout();
        }
      }, refreshTime - Date.now());
    });
  }

  async function handleLogout() {
    sessionCookie.value = null;
    if (typeof $logout === "function") {
      await $logout();
    }
    return navigateTo("/login");
  }
});