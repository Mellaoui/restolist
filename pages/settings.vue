<template>
  <div
    class="mx-auto max-w-7xl bg-gray-100 rounded lg:flex lg:gap-x-16 lg:px-8"
  >
    <h1 class="sr-only">General Settings</h1>

    <main class="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
      <div
        class="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none"
      >
        <div>
          <h2 class="text-base font-semibold text-gray-900">Profile</h2>
          <p class="mt-1 text-sm text-gray-500">
            This information will be displayed publicly so be careful what you
            share.
          </p>

          <dl
            class="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm"
          >
            <!-- Full Name -->
            <div class="py-6 sm:flex">
              <dt
                class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6"
              >
                Full name
              </dt>
              <dd
                class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto"
              >
                <div class="text-gray-900">
                  {{ user?.displayName || "N/A" }}
                </div>
                <button
                  type="button"
                  class="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Update
                </button>
              </dd>
            </div>

            <!-- Email Address -->
            <div class="py-6 sm:flex">
              <dt
                class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6"
              >
                Email address
              </dt>
              <dd
                class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto"
              >
                <div class="text-gray-900">{{ user?.email || "N/A" }}</div>
                <button
                  type="button"
                  class="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Update
                </button>
              </dd>
            </div>

            <!-- Profile Photo -->
            <div class="py-6 sm:flex">
              <dt
                class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6"
              >
                Profile Photo
              </dt>
              <dd
                class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto"
              >
                <div class="flex items-center">
                  <img
                    v-if="user?.photoURL"
                    :src="user.photoURL"
                    alt="Profile Picture"
                    class="h-16 w-16 rounded-full object-cover border"
                  />
                  <span v-else class="text-gray-500">No profile photo</span>
                </div>
                <button
                  type="button"
                  class="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Update
                </button>
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 class="text-base font-semibold text-gray-900">
            Language and dates
          </h2>
          <p class="mt-1 text-sm text-gray-500">
            Choose what language and date format to use throughout your account.
          </p>

          <dl
            class="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm"
          >
            <!-- Language -->
            <div class="py-6 sm:flex">
              <dt
                class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6"
              >
                Language
              </dt>
              <dd
                class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto"
              >
                <div class="text-gray-900">English</div>
                <button
                  type="button"
                  class="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Update
                </button>
              </dd>
            </div>

            <!-- Date Format -->
            <div class="py-6 sm:flex">
              <dt
                class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6"
              >
                Date format
              </dt>
              <dd
                class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto"
              >
                <div class="text-gray-900">DD-MM-YYYY</div>
                <button
                  type="button"
                  class="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Update
                </button>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

definePageMeta({ layout: "admin", middleware: "auth" });
// Define user state
const user = ref(null);

// Fetch user data from Firebase Authentication
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      user.value = firebaseUser;
    }
  });
});
</script>
