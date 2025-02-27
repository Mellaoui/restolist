<template>
  <TransitionRoot :show="open" as="template" @after-leave="query = ''" appear>
    <Dialog class="relative z-10" @close="emit('update:open', false)">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500/25 transition-opacity" />
      </TransitionChild>

      <div
        class="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20"
      >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel
            class="mx-auto max-w-3xl transform divide-y divide-yellow-800 overflow-hidden rounded-xl bg-yellow-900 shadow-2xl ring-1 ring-black/5 transition-all"
          >
            <Combobox
              v-slot="{ activeOption }"
              @update:modelValue="handleSelect"
            >
              <!-- Search Input -->
              <slot name="header">
                <div class="grid grid-cols-1">
                  <ComboboxInput
                    class="col-start-1 row-start-1 bg-yellow-800 h-12 w-full pl-11 pr-4 text-base text-gray-900 outline-none placeholder:text-gray-200 sm:text-sm"
                    :placeholder="placeholder"
                    @change="query = $event.target.value"
                    @blur="query = ''"
                  />
                  <MagnifyingGlassIcon
                    class="pointer-events-none col-start-1 row-start-1 ml-4 size-5 self-center text-gray-200"
                    aria-hidden="true"
                  />
                </div>
              </slot>

              <ComboboxOptions
                v-if="query === '' || filteredItems.length > 0"
                class="flex transform-gpu divide-x divide-yellow-800"
                as="div"
                static
              >
                <!-- Search Results -->
                <div
                  class="max-h-96 min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4"
                >
                  <h2
                    v-if="query === ''"
                    class="mb-4 mt-2 text-xs font-semibold text-gray-300"
                  >
                    {{ title }}
                  </h2>
                  <div class="-mx-2 text-sm text-gray-200">
                    <ComboboxOption
                      v-for="item in query === '' ? recentItems : filteredItems"
                      :key="item.id"
                      :value="item"
                      as="template"
                      v-slot="{ active }"
                    >
                      <div
                        :class="[
                          'group flex cursor-pointer select-none items-center rounded-md p-2',
                          active && 'bg-gray-100 text-gray-900',
                        ]"
                      >
                        <img
                          :src="item.imageUrl"
                          alt=""
                          class="size-6 flex-none rounded-full"
                        />
                        <span class="ml-3 flex-auto truncate">{{
                          item.name
                        }}</span>
                        <ChevronRightIcon
                          v-if="active"
                          class="ml-3 size-5 flex-none text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                    </ComboboxOption>
                  </div>
                </div>

                <!-- Item Details -->
                <div
                  v-if="activeOption"
                  class="hidden h-96 w-1/2 flex-none flex-col divide-y divide-yellow-800 overflow-y-auto sm:flex"
                >
                  <div class="flex-none p-6 text-center">
                    <img
                      :src="activeOption.imageUrl"
                      alt=""
                      class="mx-auto size-16 rounded-full"
                    />
                    <h2 class="mt-3 font-semibold text-gray-900">
                      {{ activeOption.name }}
                    </h2>
                    <p class="text-sm text-gray-500">{{ activeOption.role }}</p>
                  </div>
                  <div class="flex flex-auto flex-col justify-between p-6">
                    <dl
                      class="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-700"
                    >
                      <dt class="col-end-1 font-semibold text-gray-900">
                        Nom du restaurant
                      </dt>
                      <dd class="text-yellow-600">{{ activeOption.name }}</dd>
                      <dt class="col-end-1 font-semibold text-gray-900">
                        Emplacement
                      </dt>
                      <dd class="truncate">
                        <a
                          :href="activeOption.location"
                          class="text-yellow-600 underline"
                          >{{ activeOption.location }}</a
                        >
                      </dd>
                      <dt class="col-end-1 font-semibold text-gray-900">
                        YouTube
                      </dt>
                      <dd class="truncate">
                        <a
                          :href="`mailto:${activeOption.youtube_link}`"
                          class="text-yellow-600 underline"
                          >{{ activeOption.youtube_link }}</a
                        >
                      </dd>
                    </dl>
                    <!-- <button
                      type="button"
                      class="mt-6 w-full rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-600"
                    >
                      Send message
                    </button> -->
                  </div>
                </div>
              </ComboboxOptions>

              <!-- No Results Found -->
              <div
                v-if="query !== '' && filteredItems.length === 0"
                class="px-6 py-14 text-center text-sm sm:px-14"
              >
                <BuildingStorefrontIcon
                  class="mx-auto size-6 text-gray-400"
                  aria-hidden="true"
                />

                <p class="mt-4 font-semibold text-gray-900">No results found</p>
                <p class="mt-2 text-gray-500">
                  Try searching for something else.
                </p>
              </div>
            </Combobox>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { computed, ref, defineProps, defineEmits } from "vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/20/solid";
import {
  ChevronRightIcon,
  UsersIcon,
  BuildingStorefrontIcon,
} from "@heroicons/vue/24/outline";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

// Props
const props = defineProps({
  open: Boolean,
  items: {
    type: Array,
    required: true,
  },
  recentItems: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: "Recent searches",
  },
  placeholder: {
    type: String,
    default: "Search...",
  },
});

// Emit event to update parent component state
const emit = defineEmits(["select", "update:open"]);

// Reactive states
const query = ref("");

// Computed property for filtering items
const filteredItems = computed(() =>
  query.value === ""
    ? []
    : props.items.filter((item) =>
        item.name.toLowerCase().includes(query.value.toLowerCase())
      )
);

// Handle selection
const handleSelect = (item) => {
  if (item) {
    emit("select", item);
    emit("update:open", false); // Close the modal after selection
  }
};
</script>
