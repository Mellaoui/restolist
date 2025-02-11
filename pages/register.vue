<template>
  <div class="flex bg-gray-900 min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl font-bold tracking-tight text-white">Create a new account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="handleRegister">
        <div>
          <label for="email" class="block text-sm font-medium text-white">Email address</label>
          <div class="mt-2">
            <input v-model="email" type="email" id="email" required class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white placeholder:text-gray-500 focus:outline-yellow-500 sm:text-sm" />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-white">Password</label>
          <div class="mt-2">
            <input v-model="password" type="password" id="password" required minlength="6" class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white placeholder:text-gray-500 focus:outline-yellow-500 sm:text-sm" />
          </div>
        </div>

        <div>
          <button type="submit" class="flex w-full justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-400">
            Sign up
          </button>
        </div>
      </form>
      
      <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const { register } = useAuth();
const router = useRouter();

const handleRegister = async () => {
  try {
    console.log("🛠 Attempting registration...");
    const user = await register(email.value, password.value);
    console.log("✅ Registration successful!", user);
    router.push("/admin");
  } catch (error) {
    console.error("❌ Registration failed:", error);
    errorMessage.value = error.message || "Registration failed. Please try again.";
  }
};
</script>
