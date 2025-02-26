<template>
  <div
    class="mx-auto max-w-7xl bg-gray-100 rounded lg:flex lg:gap-x-16 lg:px-8"
  >
    <h1 class="sr-only">General Settings</h1>

    <main class="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
      <div
        class="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none"
      >
        <!-- ===== Profile Section ===== -->
        <div>
          <h2 class="text-base font-semibold text-gray-900">Profile</h2>
          <p class="mt-1 text-sm text-gray-500">
            This information will be displayed publicly so be careful what you
            share.
          </p>

          <dl
            class="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm"
          >
            <!-- ============ Full Name ============ -->
            <div class="py-6 sm:flex">
              <dt
                class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6"
              >
                Full name
              </dt>
              <dd
                class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto"
              >
                <!-- Display or Edit Field -->
                <div class="text-gray-900">
                  <template v-if="editingName">
                    <input
                      v-model="newName"
                      type="text"
                      class="w-full max-w-xs rounded border-gray-300"
                      placeholder="Enter new name"
                    />
                  </template>
                  <template v-else>
                    {{ user?.displayName || "N/A" }}
                  </template>
                </div>

                <!-- Update Button / Save & Cancel -->
                <div>
                  <template v-if="editingName">
                    <button
                      @click="saveName"
                      class="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Save
                    </button>
                    <button
                      @click="cancelEditingName"
                      class="ml-4 font-semibold text-gray-500 hover:text-gray-400"
                    >
                      Cancel
                    </button>
                  </template>
                  <template v-else>
                    <button
                      @click="startEditingName"
                      class="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Update
                    </button>
                  </template>
                </div>
              </dd>
            </div>

            <!-- ============ Email ============ -->
            <div class="py-6 sm:flex">
              <dt
                class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6"
              >
                Email address
              </dt>
              <dd
                class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto"
              >
                <!-- Display or Edit Field -->
                <div class="text-gray-900">
                  <template v-if="editingEmail">
                    <input
                      v-model="newEmail"
                      type="email"
                      class="w-full max-w-xs rounded border-gray-300"
                      placeholder="Enter new email"
                    />
                  </template>
                  <template v-else>
                    {{ user?.email || "N/A" }}
                  </template>
                </div>

                <!-- Update Button / Save & Cancel -->
                <div>
                  <template v-if="editingEmail">
                    <button
                      @click="saveEmail"
                      class="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Save
                    </button>
                    <button
                      @click="cancelEditingEmail"
                      class="ml-4 font-semibold text-gray-500 hover:text-gray-400"
                    >
                      Cancel
                    </button>
                  </template>
                  <template v-else>
                    <button
                      @click="startEditingEmail"
                      class="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Update
                    </button>
                  </template>
                </div>
              </dd>
            </div>

            <!-- ============ Profile Photo ============ -->
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

                  <!-- Show file input if editingPhoto is true -->
                  <input
                    v-if="editingPhoto"
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    class="ml-4"
                  />
                </div>

                <div>
                  <template v-if="editingPhoto">
                    <button
                      @click="savePhoto"
                      class="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Save
                    </button>
                    <button
                      @click="cancelEditingPhoto"
                      class="ml-4 font-semibold text-gray-500 hover:text-gray-400"
                    >
                      Cancel
                    </button>
                  </template>
                  <template v-else>
                    <button
                      @click="startEditingPhoto"
                      class="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Update
                    </button>
                  </template>
                </div>
              </dd>
            </div>
          </dl>
        </div>

        <!-- ===== Language & Date Section ===== -->
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
            <!-- ============ Language ============ -->
            <div class="py-6 sm:flex">
              <dt
                class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6"
              >
                Language
              </dt>
              <dd
                class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto"
              >
                <div class="text-gray-900">
                  <!-- For example, store user language in Firestore or local state -->
                  <template v-if="editingLanguage">
                    <select
                      v-model="newLanguage"
                      class="border-gray-300 rounded"
                    >
                      <option>English</option>
                      <option>French</option>
                      <option>Spanish</option>
                    </select>
                  </template>
                  <template v-else>
                    {{ language }}
                  </template>
                </div>

                <div>
                  <template v-if="editingLanguage">
                    <button
                      @click="saveLanguage"
                      class="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Save
                    </button>
                    <button
                      @click="cancelEditingLanguage"
                      class="ml-4 font-semibold text-gray-500 hover:text-gray-400"
                    >
                      Cancel
                    </button>
                  </template>
                  <template v-else>
                    <button
                      @click="startEditingLanguage"
                      class="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Update
                    </button>
                  </template>
                </div>
              </dd>
            </div>

            <!-- ============ Date Format ============ -->
            <div class="py-6 sm:flex">
              <dt
                class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6"
              >
                Date format
              </dt>
              <dd
                class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto"
              >
                <div class="text-gray-900">
                  <template v-if="editingDateFormat">
                    <select
                      v-model="newDateFormat"
                      class="border-gray-300 rounded"
                    >
                      <option>DD-MM-YYYY</option>
                      <option>MM-DD-YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </template>
                  <template v-else>
                    {{ dateFormat }}
                  </template>
                </div>

                <div>
                  <template v-if="editingDateFormat">
                    <button
                      @click="saveDateFormat"
                      class="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Save
                    </button>
                    <button
                      @click="cancelEditingDateFormat"
                      class="ml-4 font-semibold text-gray-500 hover:text-gray-400"
                    >
                      Cancel
                    </button>
                  </template>
                  <template v-else>
                    <button
                      @click="startEditingDateFormat"
                      class="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Update
                    </button>
                  </template>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
/* -------------------------------------------
  Imports
------------------------------------------- */
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app";
import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
  updateEmail,
} from "firebase/auth";
// If uploading profile photo to Storage:
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
// If saving language/date format to Firestore:
import { getFirestore, doc, setDoc, updateDoc } from "firebase/firestore";

definePageMeta({ layout: "admin", middleware: "auth", ssr: false });
/* -------------------------------------------
  Auth State
------------------------------------------- */
const user = ref(null);
const { $auth } = useNuxtApp();

// Track whether we’re editing each field
const editingName = ref(false);
const editingEmail = ref(false);
const editingPhoto = ref(false);
const editingLanguage = ref(false);
const editingDateFormat = ref(false);

// Local fields for updates
const newName = ref("");
const newEmail = ref("");
// We'll store the File object from <input type="file">
const fileInput = ref(null);

// Example: You store these in Firestore or local config
const language = ref("English");
const dateFormat = ref("DD-MM-YYYY");
const newLanguage = ref(language.value);
const newDateFormat = ref(dateFormat.value);

/* -------------------------------------------
  Lifecycle: fetch user
------------------------------------------- */
onMounted(() => {
  if (!$auth) return;
  onAuthStateChanged($auth, (firebaseUser) => {
    user.value = firebaseUser;
  });
});

/* -------------------------------------------
  Name
------------------------------------------- */
function startEditingName() {
  editingName.value = true;
  newName.value = user.value?.displayName || "";
}
function cancelEditingName() {
  editingName.value = false;
}
async function saveName() {
  if (!user.value) return;
  try {
    // Update displayName in Firebase Auth
    await updateProfile(auth.currentUser, {
      displayName: newName.value.trim(),
    });
    // Reflect changes in local user object
    user.value.displayName = newName.value.trim();
  } catch (err) {
    console.error("Error updating name:", err);
  } finally {
    editingName.value = false;
  }
}

/* -------------------------------------------
  Email
------------------------------------------- */
function startEditingEmail() {
  editingEmail.value = true;
  newEmail.value = user.value?.email || "";
}
function cancelEditingEmail() {
  editingEmail.value = false;
}
async function saveEmail() {
  if (!user.value) return;
  try {
    // Update email in Firebase Auth
    // Make sure the user has recently logged in,
    // or it might throw a "requires recent login" error
    await updateEmail(auth.currentUser, newEmail.value.trim());
    user.value.email = newEmail.value.trim();
  } catch (err) {
    console.error("Error updating email:", err);
  } finally {
    editingEmail.value = false;
  }
}

/* -------------------------------------------
  Profile Photo
------------------------------------------- */
function startEditingPhoto() {
  editingPhoto.value = true;
}
function cancelEditingPhoto() {
  editingPhoto.value = false;
  // Clear input if needed
  if (fileInput.value) {
    fileInput.value.value = "";
  }
}
async function savePhoto() {
  if (!user.value) return;
  try {
    // Make sure a file is selected
    const file = fileInput.value?.files[0];
    if (!file) {
      editingPhoto.value = false;
      return;
    }
    // Upload to Firebase Storage (example)
    const storage = getStorage();
    const filename = `${Date.now()}_${file.name}`;
    const imageRef = storageRef(storage, `profilePhotos/${filename}`);
    await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(imageRef);

    // Update user photoURL in Auth
    await updateProfile(auth.currentUser, { photoURL: downloadURL });
    user.value.photoURL = downloadURL;
  } catch (err) {
    console.error("Error updating photo:", err);
  } finally {
    editingPhoto.value = false;
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  }
}

/* -------------------------------------------
  Language
------------------------------------------- */
function startEditingLanguage() {
  editingLanguage.value = true;
  newLanguage.value = language.value;
}
function cancelEditingLanguage() {
  editingLanguage.value = false;
}
async function saveLanguage() {
  try {
    // Example: save to local state
    language.value = newLanguage.value;
    // Or save to Firestore user doc:
    /*
      const db = getFirestore();
      await updateDoc(doc(db, "users", user.value.uid), {
        language: newLanguage.value
      });
    */
  } catch (err) {
    console.error("Error updating language:", err);
  } finally {
    editingLanguage.value = false;
  }
}

/* -------------------------------------------
  Date Format
------------------------------------------- */
function startEditingDateFormat() {
  editingDateFormat.value = true;
  newDateFormat.value = dateFormat.value;
}
function cancelEditingDateFormat() {
  editingDateFormat.value = false;
}
async function saveDateFormat() {
  try {
    dateFormat.value = newDateFormat.value;
    // Or save to Firestore:
    /*
      const db = getFirestore();
      await updateDoc(doc(db, "users", user.value.uid), {
        dateFormat: newDateFormat.value
      });
    */
  } catch (err) {
    console.error("Error updating date format:", err);
  } finally {
    editingDateFormat.value = false;
  }
}
</script>
