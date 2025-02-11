import { Auth, User } from "firebase/auth";
import { Firestore } from "firebase/firestore";

export default defineNuxtPlugin((nuxtApp) => {
  return {
    auth: {} as Auth,
    db: {} as Firestore,
    currentUser: () => null as User | null,
    registerWithEmail: (email: string, password: string) => Promise.resolve(null as User | null),
    loginWithEmail: (email: string, password: string) => Promise.resolve(null as User | null),
    logout: () => Promise.resolve(),
  };
});

declare module "#app" {
  interface NuxtApp {
    $auth: Auth;
    $db: Firestore;
    $currentUser: () => User | null;
    $registerWithEmail: (email: string, password: string) => Promise<User | null>;
    $loginWithEmail: (email: string, password: string) => Promise<User | null>;
    $logout: () => Promise<void>;
  }
}
