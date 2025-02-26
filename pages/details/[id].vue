<template>
  <div class="overflow-hidden bg-yellow-950 py-24 min-h-screen sm:py-32">
    <div class="mx-auto max-w-7xl md:px-6 lg:px-8">
      <div
        class="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-start"
      >
        <!-- Restaurant Information -->
        <div class="px-6 lg:px-0 lg:pr-4 lg:pt-4">
          <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
            <h2 class="text-base/7 font-semibold text-yellow-600">
              {{ restaurant.name || "Chargement..." }}
            </h2>
            <p
              class="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-100 sm:text-5xl"
            >
              {{ restaurant.cuisine || "..." }}
            </p>
            <p class="mt-6 text-lg/8 text-gray-300">
              📍 {{ restaurant.location || "..." }}
            </p>
            <p class="mt-6 text-lg/8 text-gray-300">
              📧 {{ restaurant.email || "..." }}
            </p>
            <p
              class="mt-6 text-lg/8 text-gray-300"
              v-html="restaurant.description"
            ></p>

            <!-- ✅ Added YouTube Link Below Description -->
            <div v-if="restaurant.youtube_link" class="mt-6">
              <p class="text-lg font-semibold text-yellow-600">🎥 YouTube:</p>
              <!-- <a
                :href="restaurant.youtube_link"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-400 hover:underline"
              >
                {{ restaurant.youtube_link }}
              </a> -->

              <!-- Optional: Embed YouTube Video Instead of Link -->
              <!-- Uncomment this part if you prefer to embed the video instead -->

              <div class="mt-4">
                <iframe
                  :src="youtubeEmbedUrl"
                  width="100%"
                  height="315"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  class="rounded-lg shadow-md"
                ></iframe>
              </div>
            </div>

            <dl
              class="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none"
            >
              <div
                v-if="restaurant.features"
                v-for="feature in restaurant.features"
                :key="feature.name"
                class="relative pl-9"
              >
                <dt class="inline font-semibold text-yellow-600">
                  <component
                    :is="feature.icon"
                    class="absolute left-1 top-1 size-5 text-yellow-600"
                    aria-hidden="true"
                  />
                  {{ feature.name }}
                </dt>
                <dd class="inline text-gray-300">{{ feature.description }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Restaurant Image -->
        <div class="sm:px-6 lg:px-0">
          <div
            class="relative isolate overflow-hidden bg-yellow-900 px-6 pt-8 sm:mx-auto sm:max-w-2xl sm:rounded-3xl sm:pl-16 sm:pr-0 sm:pt-16 lg:mx-0 lg:max-w-none"
          >
            <div
              class="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-[-30deg] bg-yellow-100 opacity-20 ring-1 ring-inset ring-white"
              aria-hidden="true"
            />
            <div class="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
              <img
                :src="restaurant.imageUrl || defaultImage"
                :alt="restaurant.name"
                width="400px"
                height="300px"
                class="-mb-12 w-[32rem] max-w-none rounded-tl-xl bg-gray-800 ring-1 ring-white/10"
              />
            </div>
            <div
              class="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 sm:rounded-3xl"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { doc, getDoc } from "firebase/firestore";
import { useNuxtApp } from "#app";

// Get Firestore instance
const { $db } = useNuxtApp();
const route = useRoute();

// Reactive restaurant details
const restaurant = ref({});
const loading = ref(true);
const error = ref(null);

// Default image if no restaurant image is available
const defaultImage =
  "https://tailwindui.com/plus-assets/img/component-images/project-app-screenshot.png";

// Fetch restaurant details
const fetchRestaurantDetails = async () => {
  loading.value = true;
  try {
    const docRef = doc($db, "restaurants", route.params.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      restaurant.value = docSnap.data();
    } else {
      error.value = "Restaurant introuvable.";
    }
  } catch (err) {
    error.value = "Erreur lors du chargement des données.";
  } finally {
    loading.value = false;
  }
};

// ✅ Compute the embeddable YouTube URL (for iframe embedding)
const youtubeEmbedUrl = computed(() => {
  if (!restaurant.value.youtube_link) return "";
  const url = restaurant.value.youtube_link;
  const videoIdMatch = url.match(
    /(?:youtube\.com\/(?:.*v=|.*\/|.*embed\/|.*shorts\/)|youtu\.be\/)([^#&?]+)/
  );
  return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : "";
});

// Fetch restaurant data on mount
onMounted(fetchRestaurantDetails);
</script>
