import { useNuxtApp } from "#app";
import { ref, onMounted } from "vue";
import type { User } from "firebase/auth";

const user = ref<User | null>(null);

export function useAuth() {
  if (process.server) {
    console.warn("⚠️ Firebase Auth is not available on SSR. Returning empty object.");
    return {
      user,
      register: async () => {},
      login: async () => {},
      logout: async () => {},
    };
  }

  const nuxtApp = useNuxtApp();

  if (!nuxtApp.$auth) {
    console.error("❌ Firebase Auth is not initialized yet. Retrying onMounted...");
    return {
      user,
      register: async () => {},
      login: async () => {},
      logout: async () => {},
    };
  }

  // ✅ Ensure Firebase Auth is Ready Before Accessing
  onMounted(() => {
    if (nuxtApp.$auth) {
      nuxtApp.$auth.onAuthStateChanged((firebaseUser: User | null) => {
        console.log("✅ Auth state changed:", firebaseUser);
        user.value = firebaseUser;
      });
    }
  });

  const register = async (email: string, password: string) => {
    if (!nuxtApp.$registerWithEmail) {
      console.error("❌ Register function is missing.");
      return;
    }
    try {
      const userCredential = await nuxtApp.$registerWithEmail(email, password);
      console.log("✅ User Registered:", userCredential);
      return userCredential;
    } catch (error) {
      console.error("❌ Registration error:", (error as Error).message);
      throw error;
    }
  };

  return { user, register };
}
