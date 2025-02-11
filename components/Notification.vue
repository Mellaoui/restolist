
<template>
    <!-- Global notification live region -->
    <div
      v-if="visible"
      aria-live="assertive"
      class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
        <!-- Notification panel -->
        <transition
          enter-active-class="transform ease-out duration-300 transition"
          enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5">
            <div class="p-4 flex items-start">
              <div class="shrink-0">
                <component :is="icon" class="size-6" :class="iconColor" aria-hidden="true" />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">{{ title }}</p>
                <p class="mt-1 text-sm text-gray-500">{{ message }}</p>
              </div>
              <div class="ml-4 flex shrink-0">
                <button
                  type="button"
                  @click="closeNotification"
                  class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="size-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watchEffect } from 'vue';
  import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline';
  import { XMarkIcon } from '@heroicons/vue/20/solid';
  
  // Props to customize the notification
  const props = defineProps({
    title: { type: String, default: 'Notification' },
    message: { type: String, required: true },
    type: { type: String, default: 'success' }, // success, error, warning, info
    duration: { type: Number, default: 3000 }, // Auto-hide after X milliseconds
  });
  
  // Control visibility
  const visible = ref(true);
  
  // Auto-hide after the duration
  watchEffect(() => {
    if (props.duration > 0) {
      setTimeout(() => {
        visible.value = false;
      }, props.duration);
    }
  });
  
  // Close function
  const closeNotification = () => {
    visible.value = false;
  };
  
  // Determine the icon and color based on the type
  const iconMap = {
    success: { icon: CheckCircleIcon, color: 'text-green-400' },
    error: { icon: XCircleIcon, color: 'text-red-400' },
    warning: { icon: ExclamationTriangleIcon, color: 'text-yellow-400' },
    info: { icon: InformationCircleIcon, color: 'text-blue-400' },
  };
  
  const icon = iconMap[props.type]?.icon || CheckCircleIcon;
  const iconColor = iconMap[props.type]?.color || 'text-green-400';
  </script>
  