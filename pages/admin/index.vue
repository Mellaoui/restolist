<template>
  <div>
    <!-- Stats Section -->
    <div>
      <h3 class="text-base font-semibold text-gray-900">Derniers 30 jours</h3>
      <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div
          v-for="item in stats"
          :key="item.name"
          class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
        >
          <dt class="truncate text-sm font-medium text-gray-500">
            {{ item.name }}
          </dt>
          <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {{ item.stat }}
          </dd>
        </div>
      </dl>
    </div>

    <!-- Restaurant List Section -->
    <div class="px-4 sm:px-6 mt-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold text-gray-900">
            Liste des Restaurants
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Voici la liste de tous les restaurants enregistrés.
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            @click="openModal"
            type="button"
            class="block rounded-md bg-yellow-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-yellow-500"
          >
            Ajouter un restaurant
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <p v-if="loading" class="mt-4 text-gray-500">
        Chargement des restaurants...
      </p>

      <!-- No Data Message -->
      <p v-if="!loading && restaurants.length === 0" class="mt-4 text-gray-500">
        Aucun restaurant disponible.
      </p>

      <!-- Table Section -->
      <div v-if="!loading && restaurants.length > 0" class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
          >
            <div
              class="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg"
            >
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Nom
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Type de Cuisine
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      E-mail
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Emplacement
                    </th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span class="sr-only">Modifier</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="restaurant in restaurants" :key="restaurant.id">
                    <td
                      class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                    >
                      {{ restaurant.name }}
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      {{ restaurant.cuisine }}
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      {{ restaurant.email }}
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      {{ restaurant.location }}
                    </td>
                    <td
                      class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                    >
                      <NuxtLink
                        :to="`/admin/restaurants/${restaurant.id}`"
                        class="text-yellow-600 hover:text-yellow-900"
                      >
                        Modifier
                      </NuxtLink>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Restaurant Modal -->
    <TransitionRoot as="template" :show="isModalOpen" appear>
      <Dialog as="div" class="relative z-10" @close="closeModal">
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        ></div>
        <div
          class="fixed inset-0 z-10 flex items-center justify-center p-4 sm:p-6"
        >
          <DialogPanel
            class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all"
          >
            <h2 class="text-lg font-semibold text-gray-900">
              Ajouter un Restaurant
            </h2>
            <form @submit.prevent="addRestaurant">
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700"
                  >Nom du restaurant</label
                >
                <input
                  v-model="newRestaurant.name"
                  required
                  type="text"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-600 sm:text-sm/6"
                />
              </div>
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700"
                  >Type de Cuisine</label
                >
                <input
                  v-model="newRestaurant.cuisine"
                  type="text"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-600 sm:text-sm/6"
                  placeholder="Ex: Italienne, Japonaise..."
                />
              </div>
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700"
                  >E-mail</label
                >
                <input
                  v-model="newRestaurant.email"
                  required
                  type="email"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-600 sm:text-sm/6"
                />
              </div>
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700"
                  >Emplacement</label
                >
                <input
                  v-model="newRestaurant.location"
                  required
                  type="text"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-600 sm:text-sm/6"
                />
              </div>
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700"
                  >Image du restaurant</label
                >
                <!-- 
                  Child component that returns a File object.
                  Once the user selects a file, the File object 
                  is passed to handleImageUpload() in the parent.
                -->
                <ImageUploader @image-uploaded="handleImageUpload" />
              </div>

              <div class="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  @click="closeModal"
                  class="rounded-md bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  class="rounded-md bg-yellow-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- ✅ Notification Component -->
    <Notification
      v-if="notification.show"
      :title="notification.title"
      :message="notification.message"
      :type="notification.type"
      :duration="3000"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Dialog, DialogPanel, TransitionRoot } from "@headlessui/vue";
import { useNuxtApp } from "#app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import Notification from "@/components/Notification.vue";
import ImageUploader from "@/components/ImageUploader.vue";

definePageMeta({ layout: "admin", middleware: "auth" });

const { $addRestaurantToFirestore, $getRestaurants } = useNuxtApp(); // Firestore actions
const isModalOpen = ref(false);
const restaurants = ref([]);
const newRestaurant = ref({
  name: "",
  cuisine: "",
  email: "",
  location: "",
  imageUrl: "",
});
const loading = ref(true);
const notification = ref({
  show: false,
  title: "",
  message: "",
  type: "success",
});
const stats = ref([
  {
    name: "Total Restaurants",
    stat: "0",
    previousStat: "0",
    change: "0%",
    changeType: "increase",
  },
  {
    name: "New Restaurants (Last 30 Days)",
    stat: "0",
    previousStat: "0",
    change: "0%",
    changeType: "increase",
  },
  {
    name: "Total Subscriptions",
    stat: "0",
    previousStat: "0",
    change: "0%",
    changeType: "increase",
  },
]);

// Will hold the File object from the image uploader
const restaurantImage = ref(null);
// Tracks if we're currently uploading
const isUploading = ref(false);

// Fetch restaurants + stats
const fetchRestaurants = async () => {
  loading.value = true;
  try {
    restaurants.value = await $getRestaurants();
    await fetchStats();
  } catch (error) {
    notification.value = {
      show: true,
      title: "Erreur",
      message: "Impossible de charger les restaurants.",
      type: "error",
    };
    console.error("❌ Error fetching restaurants:", error);
  }
  loading.value = false;
};

const fetchStats = async () => {
  try {
    const db = getFirestore();
    const restaurantsSnapshot = await getDocs(collection(db, "restaurants"));
    const totalRestaurants = restaurantsSnapshot.size;

    // New restaurants in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newRestaurantsQuery = query(
      collection(db, "restaurants"),
      where("createdAt", ">=", thirtyDaysAgo.toISOString())
    );
    const newRestaurantsSnapshot = await getDocs(newRestaurantsQuery);
    const newRestaurantsCount = newRestaurantsSnapshot.size;

    // Compare to previous 30 days
    const previousMonthStart = new Date(thirtyDaysAgo);
    previousMonthStart.setDate(previousMonthStart.getDate() - 30);

    const previousMonthQuery = query(
      collection(db, "restaurants"),
      where("createdAt", ">=", previousMonthStart.toISOString()),
      where("createdAt", "<", thirtyDaysAgo.toISOString())
    );
    const previousMonthSnapshot = await getDocs(previousMonthQuery);
    const previousMonthCount = previousMonthSnapshot.size;

    // Calculate % change
    const changePercentage = previousMonthCount
      ? (
          ((newRestaurantsCount - previousMonthCount) / previousMonthCount) *
          100
        ).toFixed(2)
      : "N/A";

    stats.value = [
      {
        name: "Total Restaurants",
        stat: totalRestaurants,
        previousStat: previousMonthCount,
        change: changePercentage + "%",
        changeType:
          newRestaurantsCount >= previousMonthCount ? "increase" : "decrease",
      },
      {
        name: "New Restaurants (Last 30 Days)",
        stat: newRestaurantsCount,
        previousStat: previousMonthCount,
        change: changePercentage + "%",
        changeType:
          newRestaurantsCount >= previousMonthCount ? "increase" : "decrease",
      },
      {
        name: "Total Subscriptions",
        stat: totalRestaurants * 2, // Example multiplier
        previousStat: (previousMonthCount || 0) * 2,
        change: changePercentage + "%",
        changeType: "increase",
      },
    ];
  } catch (error) {
    console.error("❌ Error fetching stats:", error);
  }
};

/**
 * Called when the user selects a file in <ImageUploader>.
 * We simply store the File in restaurantImage.value
 */
const handleImageUpload = (file) => {
  if (file instanceof File) {
    console.log("✅ Received valid File:", file);
    restaurantImage.value = file; // ✅ Store only the File object
  } else {
    console.error("❌ Received invalid data:", file);
  }
};

/**
 * Adds a new restaurant to Firestore, including uploading the selected image.
 */
const addRestaurant = async () => {
  try {
    isUploading.value = true;
    let imageUrl = "";

    // Ensure a valid file exists before trying to upload
    if (restaurantImage.value) {
      console.log("Uploading file:", restaurantImage.value);

      const storage = getStorage();
      const fileName = `${Date.now()}_${restaurantImage.value}`;
      const imageRef = storageRef(storage, `restaurants/${fileName}`);

      // Upload file to Firebase Storage
      await uploadBytes(imageRef, restaurantImage.value);

      // Get the file's download URL
      imageUrl = await getDownloadURL(imageRef);
    }

    // Save all restaurant data to Firestore
    await $addRestaurantToFirestore({
      ...newRestaurant.value,
      imageUrl,
      createdAt: new Date().toISOString(),
    });

    // Show success notification
    notification.value = {
      show: true,
      title: "Succès",
      message: "Restaurant ajouté avec succès !",
      type: "success",
    };

    // Reset form fields
    newRestaurant.value = {
      name: "",
      cuisine: "",
      email: "",
      location: "",
      imageUrl: "",
    };
    restaurantImage.value = null;

    // Refresh restaurant list
    await fetchRestaurants();
    closeModal();
  } catch (error) {
    notification.value = {
      show: true,
      title: "Erreur",
      message: "Échec de l'ajout du restaurant.",
      type: "error",
    };
    console.error("❌ Error adding restaurant:", error);
  } finally {
    isUploading.value = false;
  }
};

// Modal controls
const openModal = () => (isModalOpen.value = true);
const closeModal = () => (isModalOpen.value = false);

// Fetch data on mount
onMounted(fetchRestaurants);
</script>
