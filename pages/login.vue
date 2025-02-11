<template>
  <div class="flex bg-gray-900 min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=black&shade=500" alt="Your Company" />
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Sign in to your account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="login">
        <div>
          <label for="email" class="block text-sm/6 font-medium text-white">Email address</label>
          <div class="mt-2">
            <input 
              v-model="email"
              type="email" 
              id="email" 
              autocomplete="email"
              required
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-500 sm:text-sm/6" 
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-white">Password</label>
            <div class="text-sm">
              <a href="#" class="font-semibold text-yellow-400 hover:text-yellow-300">Forgot password?</a>
            </div>
          </div>
          <div class="mt-2">
            <input 
              v-model="password"
              type="password" 
              id="password" 
              autocomplete="current-password"
              required
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-500 sm:text-sm/6" 
            />
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            :disabled="loading"
            class="flex w-full justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Sign in</span>
            <span v-else>Signing in...</span>
          </button>
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm text-center">
          {{ errorMessage }}
        </div>
      </form>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useNuxtApp, useCookie, navigateTo } from "#app";

const { $loginWithEmail } = useNuxtApp();
const sessionCookie = useCookie("firebase-session");

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

const login = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";

    const userCredential = await $loginWithEmail(email.value, password.value);
    
    // Store the session token for authentication persistence
    const idToken = await userCredential.user.getIdToken();
    sessionCookie.value = idToken;

    // Redirect to protected dashboard after successful login
    await navigateTo("/admin");
  } catch (error) {
    console.error("Login error:", error);
    errorMessage.value = getFriendlyErrorMessage(error.code);
  } finally {
    loading.value = false;
  }
};

// Convert Firebase error codes to user-friendly messages
const getFriendlyErrorMessage = (code) => {
  switch (code) {
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/user-disabled":
      return "This account has been disabled";
    case "auth/user-not-found":
      return "No account found with this email";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later";
    default:
      return "Login failed. Please try again";
  }
};
</script>
