<template>
  <div class="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h1 class="text-2xl font-semibold text-gray-900">Modifier le restaurant</h1>

    <!-- Notification Component -->
    <Notification
      v-if="notification.visible"
      :title="notification.title"
      :message="notification.message"
      :type="notification.type"
      :duration="3000"
    />

    <!-- Loading State -->
    <div v-if="loading" class="mt-6">
      <div class="animate-pulse">
        <div class="h-5 w-3/4 bg-gray-300 rounded"></div>
        <div class="h-4 w-1/2 bg-gray-200 rounded mt-2"></div>
        <div class="h-48 bg-gray-200 rounded mt-4"></div>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="mt-4 text-red-500 bg-red-100 p-2 rounded">
      {{ error }}
    </p>

    <!-- Form Section -->
    <form
      v-if="!loading && restaurant"
      @submit.prevent="updateRestaurant"
      class="mt-6 space-y-5"
    >
      <!-- Restaurant Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >Nom du restaurant</label
        >
        <input
          v-model="restaurant.name"
          required
          type="text"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>

      <!-- Cuisine Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >Type de Cuisine</label
        >
        <input
          v-model="restaurant.cuisine"
          required
          type="text"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >Youtube_link</label
        >
        <input
          v-model="restaurant.youtube_link"
          required
          type="url"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>

      <!-- Location -->
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >Emplacement</label
        >
        <input
          v-model="restaurant.location"
          required
          type="text"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>

      <!-- Rich Text Editor for Description -->
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >Description</label
        >

        <!-- Toolbar -->
        <div
          class="flex gap-2 border border-gray-300 p-2 rounded-md bg-gray-100"
        >
          <button
            @click="editor.chain().focus().toggleBold().run()"
            class="editor-btn"
          >
            B
          </button>
          <button
            @click="editor.chain().focus().toggleItalic().run()"
            class="editor-btn"
          >
            I
          </button>
          <button
            @click="editor.chain().focus().toggleUnderline().run()"
            class="editor-btn"
          >
            U
          </button>
          <button
            @click="editor.chain().focus().toggleStrike().run()"
            class="editor-btn"
          >
            S
          </button>
          <button
            @click="editor.chain().focus().toggleBulletList().run()"
            class="editor-btn"
          >
            • List
          </button>
          <button
            @click="editor.chain().focus().toggleOrderedList().run()"
            class="editor-btn"
          >
            1. List
          </button>
          <button @click="addImage" class="editor-btn bg-green-500">
            Image
          </button>
          <button @click="addLink" class="editor-btn bg-blue-500">Lien</button>
        </div>

        <!-- Editor Content -->
        <editor-content
          class="mt-1 border border-gray-300 rounded-md p-2"
          :editor="editor"
        />
      </div>

      <!-- Image Upload Section -->
      <div class="mt-6">
        <label class="block text-sm font-medium text-gray-700"
          >Image du restaurant</label
        >
        <input
          ref="fileInput"
          type="file"
          @change="handleImageUpload"
          accept="image/*"
          class="hidden"
        />
        <div class="mt-2 flex items-center gap-4">
          <button
            @click.prevent="triggerFileInput"
            class="bg-yellow-600 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-500 transition"
          >
            Choisir une image
          </button>
          <div v-if="previewImage || restaurant.imageUrl" class="relative">
            <img
              :src="previewImage || restaurant.imageUrl"
              class="h-24 w-24 object-cover rounded-md shadow"
            />
          </div>
        </div>
        <p v-if="restaurant.imageUrl" class="mt-2 text-sm text-gray-600">
          Image actuelle
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          @click="$router.back()"
          class="bg-gray-300 px-4 py-2 rounded-md text-sm font-semibold shadow hover:bg-gray-400 transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          class="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow hover:bg-yellow-500 transition"
        >
          Enregistrer
        </button>
        <button
          type="button"
          @click="deleteRestaurant"
          class="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow hover:bg-red-500 transition"
        >
          Supprimer
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useNuxtApp } from "#app";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Notification from "@/components/Notification.vue"; // Import Notification Component

definePageMeta({ layout: "admin", middleware: "auth" });

const { $db, $storage } = useNuxtApp();
const route = useRoute();
const router = useRouter();

const restaurant = ref(null);
const loading = ref(true);
const error = ref(null);
const newImage = ref(null);
const previewImage = ref(null);
const fileInput = ref(null);
const editor = ref(null);
const notification = ref({ visible: false, title: "", message: "", type: "" });

// Initialize editor only on the client side
onMounted(() => {
  editor.value = new Editor({
    extensions: [StarterKit, Underline, BulletList, OrderedList],
    content: "<p>Ajoutez une description...</p>",
  });
  fetchRestaurant();
});

const fetchRestaurant = async () => {
  loading.value = true;
  try {
    const docRef = doc($db, "restaurants", route.params.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      restaurant.value = docSnap.data();
      if (restaurant.value.description && editor.value) {
        editor.value.commands.setContent(restaurant.value.description);
      }
    } else {
      error.value = "Restaurant introuvable";
    }
  } catch (err) {
    error.value = "Erreur lors du chargement des données.";
  } finally {
    loading.value = false;
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    newImage.value = file;
    previewImage.value = URL.createObjectURL(file);
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const showNotification = (title, message, type = "success") => {
  notification.value = { visible: true, title, message, type };
  setTimeout(() => (notification.value.visible = false), 3000);
};

const updateRestaurant = async () => {
  try {
    let imageUrl = restaurant.value.imageUrl;
    if (newImage.value) {
      const fileRef = storageRef(
        $storage,
        `restaurants/${newImage.value.name}`
      );
      await uploadBytes(fileRef, newImage.value);
      imageUrl = await getDownloadURL(fileRef);
    }

    await updateDoc(doc($db, "restaurants", route.params.id), {
      ...restaurant.value,
      imageUrl,
      description: editor.value?.getHTML(),
    });

    showNotification(
      "Succès",
      "Le restaurant a été mis à jour avec succès !",
      "success"
    );
  } catch (err) {
    showNotification(
      "Erreur",
      "Échec de la mise à jour du restaurant.",
      "error"
    );
  }
};

const deleteRestaurant = async () => {
  const confirmDelete = confirm(
    "Êtes-vous sûr de vouloir supprimer ce restaurant ?"
  );
  if (!confirmDelete) return;

  try {
    await deleteDoc(doc($db, "restaurants", route.params.id));
    showNotification(
      "Succès",
      "Le restaurant a été supprimé avec succès.",
      "success"
    );
    setTimeout(() => {
      router.push("/admin"); // Redirect after deletion
    }, 2000);
  } catch (err) {
    showNotification(
      "Erreur",
      "Échec de la suppression du restaurant.",
      "error"
    );
  }
};
</script>
<style>
.editor-btn {
  padding: 5px 10px;
  border-radius: 4px;
  background: #eee;
  cursor: pointer;
}
</style>
