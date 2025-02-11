// middleware/auth.ts
import { defineNuxtRouteMiddleware, navigateTo, useNuxtApp } from "#app";

export default defineNuxtRouteMiddleware(async (to) => {
  const { $auth, $logout } = useNuxtApp();
  const sessionCookie = useCookie("firebase-session");

  if (process.server) {
    if (!sessionCookie.value) return navigateTo("/login");

    // Verify session with backend
    const valid = await $fetch("/api/auth/verify", {
      headers: { Authorization: `Bearer ${sessionCookie.value}` },
    });

    if (!valid) {
      await $logout(); // Ensure logout is triggered
      return navigateTo("/login");
    }
  }

  if (process.client) {
    if (!$auth.currentUser) {
      await $logout(); // Ensure session is cleared
      return navigateTo("/login");
    }

    try {
      await $auth.currentUser.getIdToken(true); // Force token refresh
    } catch (error) {
      console.error("Token refresh failed:", error);
      await $logout();
      return navigateTo("/login");
    }
  }
});
