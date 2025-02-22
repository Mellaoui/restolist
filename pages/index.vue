<template>
  <div class="bg-yellow-950">
    <main>
      <palettes
        v-model:open="isSearchOpen"
        :items="restaurants"
        :recentItems="recentRestaurants"
        title="Restaurants récemment consultés"
        placeholder="Rechercher un restaurant..."
        @select="handleRestaurantSelection"
      />

      <Modal
        v-model="showDialog"
        title="Sign In Required"
        message="Please sign in with your Google account to continue."
        confirm-button="Sign in with Google"
        cancel-button="Cancel"
        :icon="CheckIcon"
        @confirm="loginWithGoogle"
      />
      <!-- Hero section -->
      <div class="relative isolate overflow-hidden bg-yellow-950">
        <svg
          class="absolute inset-0 -z-10 size-full stroke-yellow-800 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
              width="200"
              height="200"
              x="50%"
              y="-1"
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            stroke-width="0"
            fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)"
          />
        </svg>
        <div
          class="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40"
        >
          <div class="mx-auto max-w-2xl lg:mx-0 lg:shrink-0 lg:pt-8">
            <div class="mt-24 sm:mt-32 lg:mt-16">
              <a href="#" class="inline-flex space-x-6">
                <span
                  class="rounded-full bg-yellow-600/10 px-3 py-1 text-sm/6 font-semibold text-yellow-600 ring-1 ring-inset ring-yellow-600/10"
                  >What's new</span
                >
                <span
                  class="inline-flex items-center space-x-2 text-sm/6 font-medium text-yellow-600"
                >
                  <span>Just shipped v Beta</span>
                  <ChevronRightIcon
                    class="size-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </a>
            </div>
            <h1
              class="mt-10 text-pretty text-5xl font-semibold tracking-tight text-gray-100 sm:text-6xl"
            >
              Explorez la gastronomie locale avec vos Youtubers préférés
            </h1>
            <p
              class="mt-8 text-pretty text-lg font-medium text-gray-200 sm:text-xl/8"
            >
              Découvrez les meilleures adresses et laissez-vous guider par des
              experts du goût.
            </p>
            <div class="mt-10 flex items-center gap-x-6">
              <button
                @click="isSearchOpen = true"
                class="rounded-md bg-yellow-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
              >
                Commencer
              </button>
              <a href="#" class="text-sm/6 font-semibold text-gray-200"
                >Learn more <span aria-hidden="true">→</span></a
              >
            </div>
          </div>
          <div
            class="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32"
          >
            <div class="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div
                class="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4"
              >
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/fusiongym-5c76b.appspot.com/o/restoList%2Ff995231b-d470-4aad-a174-b2c8542ce98b.jpeg?alt=media&token=2397a580-08a9-46ba-ba16-29f8919e90f1"
                  alt="App screenshot"
                  width="500"
                  height="500"
                  class="w-[45rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Logo cloud -->
      <!-- <div class="mx-auto mt-8 max-w-7xl px-6 sm:mt-16 lg:px-8">
          <h2 class="text-center text-lg/8 font-semibold text-white">The world’s most innovative companies use our app</h2>
          <div class="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
            <img class="col-span-2 max-h-12 w-full object-contain lg:col-span-1" src="https://tailwindui.com/plus/img/logos/158x48/transistor-logo-white.svg" alt="Transistor" width="158" height="48" />
            <img class="col-span-2 max-h-12 w-full object-contain lg:col-span-1" src="https://tailwindui.com/plus/img/logos/158x48/reform-logo-white.svg" alt="Reform" width="158" height="48" />
            <img class="col-span-2 max-h-12 w-full object-contain lg:col-span-1" src="https://tailwindui.com/plus/img/logos/158x48/tuple-logo-white.svg" alt="Tuple" width="158" height="48" />
            <img class="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1" src="https://tailwindui.com/plus/img/logos/158x48/savvycal-logo-white.svg" alt="SavvyCal" width="158" height="48" />
            <img class="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1" src="https://tailwindui.com/plus/img/logos/158x48/statamic-logo-white.svg" alt="Statamic" width="158" height="48" />
          </div>
        </div> -->

      <!-- Feature section -->
      <div class="mx-auto mt-32 max-w-7xl px-6 sm:mt-32 lg:px-8">
        <div class="mx-auto max-w-2xl lg:text-center">
          <h2 class="text-base/7 font-semibold text-yellow-400">
            Commencez Votre Voyage Culinaire
          </h2>
          <p
            class="mt-2 text-pretty text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-balance"
          >
            Les meilleurs restaurants, regroupés en un seul endroit.
          </p>
          <p class="mt-6 text-lg/8 text-gray-300">
            Explorez les restaurants par ville, lisez des avis et faites des
            choix éclairés avec notre guide gastronomique.
          </p>
        </div>
        <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl
            class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3"
          >
            <div
              v-for="feature in primaryFeatures"
              :key="feature.name"
              class="flex flex-col"
            >
              <dt class="text-base/7 font-semibold text-white">
                <div
                  class="mb-6 flex size-10 items-center justify-center rounded-lg bg-yellow-500"
                >
                  <component
                    :is="feature.icon"
                    class="size-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                {{ feature.name }}
              </dt>
              <dd
                class="mt-1 flex flex-auto flex-col text-base/7 text-gray-300"
              >
                <p class="flex-auto">{{ feature.description }}</p>
                <p class="mt-6">
                  <a
                    :href="feature.href"
                    class="text-sm/6 font-semibold text-yellow-400"
                    >Learn more <span aria-hidden="true">→</span></a
                  >
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Feature section -->
      <div class="mt-32 sm:mt-56">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl sm:text-center">
            <h2 class="text-base/7 font-semibold text-yellow-400">
              Tout ce dont vous avez besoin en un seul endroit
            </h2>
            <p
              class="mt-2 text-pretty text-4xl font-semibold tracking-tight text-white sm:text-balance sm:text-5xl"
            >
              Découvrez les meilleurs restaurants pour une expérience culinaire
              unique.
            </p>
            <p class="mt-6 text-lg/8 text-gray-300">
              Recherchez des restaurants par ville, explorez les menus et
              regardez des avis d'experts pour faire le meilleur choix.
            </p>
          </div>
        </div>
        <div class="relative overflow-hidden pt-16">
          <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/fusiongym-5c76b.appspot.com/o/restoList%2Ff3bc6270-b594-4c1b-aab6-268f470f4435.jpeg?alt=media&token=caa3bae9-91cf-4c73-83b8-ddec15e7ff43"
              alt="App screenshot"
              class="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-white/10"
              width="2432"
              height="1442"
            />
            <div class="relative" aria-hidden="true">
              <div
                class="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-yellow-900 pt-[7%]"
              />
            </div>
          </div>
        </div>
        <div class="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
          <dl
            class="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base/7 text-gray-300 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16"
          >
            <div
              v-for="feature in secondaryFeatures"
              :key="feature.name"
              class="relative pl-9"
            >
              <dt class="inline font-semibold text-white">
                <component
                  :is="feature.icon"
                  class="absolute left-1 top-1 size-5 text-yellow-500"
                  aria-hidden="true"
                />
                {{ feature.name }}
              </dt>
              {{ " " }}
              <dd class="inline">{{ feature.description }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Stats -->
      <div class="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
        <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
          <h2 class="text-base/8 font-semibold text-yellow-400">
            Pourquoi Nous Choisir ?
          </h2>
          <p
            class="mt-2 text-pretty text-4xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            Recommandé par les passionnés de gastronomie à travers le pays
          </p>
          <p class="mt-6 text-lg/8 text-gray-300">
            Découvrez les meilleurs restaurants, recommandés par des experts et
            des clients.
          </p>
        </div>
        <dl
          class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 text-white sm:mt-20 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-4"
        >
          <div
            v-for="stat in stats"
            :key="stat.id"
            class="flex flex-col gap-y-3 border-l border-white/10 pl-6"
          >
            <dt class="text-sm/6">{{ stat.name }}</dt>
            <dd class="order-first text-3xl font-semibold tracking-tight">
              {{ stat.value }}
            </dd>
          </div>
        </dl>
      </div>

      <!-- CTA section -->
      <div class="relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8">
        <svg
          class="absolute inset-0 -z-10 size-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="1d4240dd-898f-445f-932d-e2872fd12de3"
              width="200"
              height="200"
              x="50%"
              y="0"
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y="0" class="overflow-visible fill-gray-800/20">
            <path
              d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
              stroke-width="0"
            />
          </svg>
          <rect
            width="100%"
            height="100%"
            stroke-width="0"
            fill="url(#1d4240dd-898f-445f-932d-e2872fd12de3)"
          />
        </svg>
        <div
          class="absolute inset-x-0 top-10 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
          aria-hidden="true"
        >
          <div
            class="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-[#EC8703FF] to-[#CC9B13FF] opacity-20"
            style="
              clip-path: polygon(
                73.6% 51.7%,
                91.7% 11.8%,
                100% 46.4%,
                97.4% 82.2%,
                92.5% 84.9%,
                75.7% 64%,
                55.3% 47.5%,
                46.5% 49.4%,
                45% 62.9%,
                50.3% 87.2%,
                21.3% 64.1%,
                0.1% 100%,
                5.4% 51.1%,
                21.4% 63.9%,
                58.9% 0.2%,
                73.6% 51.7%
              );
            "
          />
        </div>
        <div class="mx-auto max-w-2xl text-center">
          <h2
            class="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl"
          >
            Découvrez les meilleurs restaurants autour de vous !
          </h2>
          <p class="mx-auto mt-6 max-w-xl text-lg/8 text-gray-300">
            Trouvez des adresses recommandées par les meilleurs critiques
            culinaires et YouTubeurs gastronomiques. Explorez, regardez les avis
            et faites votre choix en toute confiance.
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explorer maintenant
            </a>
            <a href="#" class="text-sm/6 font-semibold text-white">
              En savoir plus <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="mx-auto max-w-7xl px-6 lg:px-8">
      <div
        class="border-t border-white/10 py-12 md:flex md:items-center md:justify-between"
      >
        <div class="flex justify-center gap-x-6 md:order-2">
          <a
            v-for="item in footerNavigation.social"
            :key="item.name"
            :href="item.href"
            class="text-gray-400 hover:text-gray-300"
          >
            <span class="sr-only">{{ item.name }}</span>
            <component :is="item.icon" class="size-6" aria-hidden="true" />
          </a>
        </div>
        <p class="mt-8 text-center text-sm/6 text-gray-400 md:order-1 md:mt-0">
          &copy; 2024 Your Company, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { defineComponent, h, ref, onMounted } from "vue";
import {
  ArrowPathIcon,
  ChevronRightIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  FingerPrintIcon,
  LockClosedIcon,
  ServerIcon,
} from "@heroicons/vue/20/solid";
import {
  BoltIcon,
  CalendarDaysIcon,
  UsersIcon,
  CheckIcon,
} from "@heroicons/vue/24/outline";
import palettes from "~/components/palettes.vue";
import Modal from "~/components/Modal.vue";

import { collection, getDocs } from "firebase/firestore";
import { useNuxtApp } from "#app";
import { useRouter } from "vue-router";

const router = useRouter();

// Inject Firestore instance
const { $db } = useNuxtApp();

// Reactive restaurant data
const restaurants = ref([]);
const recentRestaurants = ref([]); // Track recent selections

const selectedRestaurant = ref(null);

// Fetch restaurants from Firestore
const fetchRestaurants = async () => {
  try {
    const querySnapshot = await getDocs(collection($db, "restaurants"));
    restaurants.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des restaurants:", error);
  }
};

// Handle selection from modal
const handleRestaurantSelection = (restaurant) => {
  selectedRestaurant.value = restaurant;

  // Add to recent selections if not already there
  if (!recentRestaurants.value.find((r) => r.id === restaurant.id)) {
    recentRestaurants.value.unshift(restaurant);
  }

  goToRestaurantDetails(restaurant.id);
};

// Navigate to restaurant details page
const goToRestaurantDetails = (restaurantId) => {
  router.push(`/details/${restaurantId}`);
};

// Fetch data when component mounts
onMounted(fetchRestaurants);

const { $signInWithGoogle, $auth } = useNuxtApp();
const showDialog = ref(false);

// Fake people data for search modal
const people = [
  {
    id: 1,
    name: "Leslie Alexander",
    phone: "1-493-747-9031",
    email: "lesliealexander@example.com",
    role: "Chef Gastronomique",
    url: "https://example.com",
    imageUrl: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    name: "John Doe",
    phone: "1-555-987-6543",
    email: "johndoe@example.com",
    role: "Créateur de Contenu",
    url: "https://example.com",
    imageUrl: "https://randomuser.me/api/portraits/men/2.jpg",
  },
];

const recent = [people[0], people[1]];

const isSearchOpen = ref(false);

// Handle search selection
const handleUserSelection = (selectedItem) => {
  console.log("User selected:", selectedItem);
};

const loginWithGoogle = async () => {
  try {
    const result = await $signInWithGoogle();
    console.log("User signed in:", result.user);
    showDialog.value = false;
  } catch (error) {
    console.error("Login failed:", error);
  }
};

const primaryFeatures = [
  {
    name: "Restaurants testés",
    description:
      "Découvrez des établissements testés et recommandés par vos créateurs favoris.",
    href: "#",
    icon: BoltIcon,
  },
  {
    name: "Guides personnalisés",
    description:
      "Filtrez les recommandations selon vos goûts et préférences alimentaires.",
    href: "#",
    icon: UsersIcon,
  },
  {
    name: "Localisation intuitive",
    description: "Repérez les meilleures adresses autour de vous en un clic",
    href: "#",
    icon: CalendarDaysIcon,
  },
];
const secondaryFeatures = [
  {
    name: "Mises à jour continues.",
    description: "Des recommandations actualisées en temps réel.",
    icon: CloudArrowUpIcon,
  },
  {
    name: "Sécurisé et fiable",
    description: "Naviguez en toute sécurité avec notre plateforme optimisée.",
    icon: LockClosedIcon,
  },
  {
    name: "Expérience fluide.",
    description:
      "Trouvez votre prochaine destination gastronomique sans effort.",
    icon: ArrowPathIcon,
  },
  {
    name: "Recommandations vérifiées",
    description:
      "Chaque lieu est testé et validé par nos experts et créateurs de contenu pour garantir la meilleure expérience.",
    icon: FingerPrintIcon,
  },
  {
    name: "Découvertes exclusives",
    description:
      "Accédez à des adresses secrètes et des bons plans partagés uniquement par les Youtubers partenaires.",
    icon: Cog6ToothIcon,
  },
  {
    name: "Favoris et historique",
    description:
      "Sauvegardez vos lieux préférés et retrouvez facilement les restaurants visités.",
    icon: ServerIcon,
  },
];
const stats = [
  { id: 1, name: "Créateurs partenaires", value: "500+ " },
  { id: 2, name: "Utilisateurs satisfaits", value: "900+" },
  { id: 3, name: "Précision des recommandations", value: "99.9%" },
  { id: 4, name: "Restaurants répertoriés", value: "10,000+" },
];
const footerNavigation = {
  solutions: [
    { name: "Hosting", href: "#" },
    { name: "Data Services", href: "#" },
    { name: "Uptime Monitoring", href: "#" },
    { name: "Enterprise Services", href: "#" },
  ],
  support: [
    { name: "Pricing", href: "#" },
    { name: "Documentation", href: "#" },
    { name: "Guides", href: "#" },
    { name: "API Reference", href: "#" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Jobs", href: "#" },
    { name: "Press", href: "#" },
    { name: "Partners", href: "#" },
  ],
  legal: [
    { name: "Claim", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
  ],
  social: [
    {
      name: "Facebook",
      href: "#",
      icon: defineComponent({
        render: () =>
          h("svg", { fill: "currentColor", viewBox: "0 0 24 24" }, [
            h("path", {
              "fill-rule": "evenodd",
              d: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
              "clip-rule": "evenodd",
            }),
          ]),
      }),
    },
    {
      name: "Instagram",
      href: "#",
      icon: defineComponent({
        render: () =>
          h("svg", { fill: "currentColor", viewBox: "0 0 24 24" }, [
            h("path", {
              "fill-rule": "evenodd",
              d: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z",
              "clip-rule": "evenodd",
            }),
          ]),
      }),
    },
    {
      name: "X",
      href: "#",
      icon: defineComponent({
        render: () =>
          h("svg", { fill: "currentColor", viewBox: "0 0 24 24" }, [
            h("path", {
              d: "M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z",
            }),
          ]),
      }),
    },

    {
      name: "YouTube",
      href: "#",
      icon: defineComponent({
        render: () =>
          h("svg", { fill: "currentColor", viewBox: "0 0 24 24" }, [
            h("path", {
              "fill-rule": "evenodd",
              d: "M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z",
              "clip-rule": "evenodd",
            }),
          ]),
      }),
    },
  ],
};
</script>
