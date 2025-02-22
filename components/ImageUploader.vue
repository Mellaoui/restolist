<template>
  <div class="bg-white shadow-lg rounded-lg p-4">
    <!-- File Input & Drag-and-Drop -->
    <div
      class="relative border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-yellow-600 transition"
      @dragover.prevent
      @drop.prevent="onFileDrop"
    >
      <label class="block text-sm font-medium text-gray-700">
        Glissez et déposez une image ou
      </label>
      <input
        type="file"
        @change="onFileChange"
        accept="image/*"
        class="absolute inset-0 opacity-0 cursor-pointer"
      />
      <p class="text-sm text-gray-500 mt-2">
        Cliquez pour sélectionner une image
      </p>
    </div>

    <!-- Image Preview & Cropper -->
    <div v-if="imagePreview" class="mt-4 relative">
      <img
        ref="imageRef"
        :src="imagePreview"
        class="w-full max-h-80 object-contain border rounded-md shadow"
      />
      <div class="absolute bottom-2 right-2 flex space-x-2">
        <button
          @click="cropImage"
          class="bg-yellow-600 text-white px-3 py-1 text-sm rounded-md shadow hover:bg-yellow-500 transition"
        >
          Recadrer
        </button>
        <button
          @click="resetImage"
          class="bg-red-600 text-white px-3 py-1 text-sm rounded-md shadow hover:bg-red-500 transition"
        >
          Réinitialiser
        </button>
      </div>
    </div>

    <!-- Cropped Image Preview -->
    <div v-if="croppedImage" class="mt-4">
      <p class="text-sm text-gray-700 font-semibold">
        Aperçu de l'image recadrée :
      </p>
      <img
        :src="croppedImage"
        class="w-full max-h-80 object-contain border rounded-md mt-2 shadow"
      />
    </div>

    <!-- Upload Button -->
    <button
      v-if="croppedImage"
      @click="uploadImage"
      class="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-500 transition flex items-center justify-center"
    >
      <span v-if="uploading">Téléchargement...</span>
      <span v-else>Télécharger l'image</span>
    </button>

    <!-- Uploading State -->
    <p v-if="uploading" class="mt-2 text-sm text-gray-500">
      Téléchargement en cours...
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// Refs
const imageRef = ref(null);
const imagePreview = ref(null);
const croppedImage = ref(null);
const selectedFile = ref(null);
const uploading = ref(false);
let cropper = null;

// Emit event to parent
const emit = defineEmits(["image-uploaded"]);

// Handle File Selection
// Handle File Selection
const onFileChange = (event) => {
  const file = event.target.files[0];
  console.log("🎯 Selected File in ImageUploader:", file);

  if (file) {
    console.log("Emitting selected file:", file);
    emit("image-uploaded", file);
    validateAndProcessFile(file);
  } else {
    console.error("No file selected or invalid file.");
  }
};

// Handle Drag & Drop
const onFileDrop = (event) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  validateAndProcessFile(file);
};

// Validate and Process Image
const validateAndProcessFile = (file) => {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert("Veuillez sélectionner un fichier image valide.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
    selectedFile.value = file;

    // Initialize cropper after next DOM update
    nextTick(() => {
      if (cropper) cropper.destroy();
      cropper = new Cropper(imageRef.value, {
        aspectRatio: 1, // Keep square images
        viewMode: 2, // Restricts cropping to image boundaries
        autoCropArea: 1, // Crop occupies most of the image
        zoomable: true, // Allow zoom
        scalable: true, // Allow scale
        rotatable: true, // Allow rotation
      });
    });
  };
  reader.readAsDataURL(file);
};

// Crop the selected image
const cropImage = () => {
  if (!cropper) return;
  croppedImage.value = cropper.getCroppedCanvas().toDataURL("image/webp", 0.8);
};

// Reset Image Selection
const resetImage = () => {
  imagePreview.value = null;
  croppedImage.value = null;
  selectedFile.value = null;
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
};

// Upload cropped image to Firebase Storage
const uploadImage = async () => {
  if (!croppedImage.value) return;

  uploading.value = true;
  try {
    const storage = getStorage();
    const fileName = `restaurant-${Date.now()}.webp`;
    const storageReference = storageRef(
      storage,
      `restaurant_images/${fileName}`
    );

    // Convert base64 to Blob
    const blob = await fetch(croppedImage.value).then((res) => res.blob());

    // Upload to Firebase
    await uploadBytes(storageReference, blob);
    const downloadURL = await getDownloadURL(storageReference);

    // Emit URL to parent
    emit("image-uploaded", downloadURL);
    resetImage(); // Reset uploader after successful upload
  } catch (error) {
    console.error("Erreur d'upload:", error);
  } finally {
    uploading.value = false;
  }
};
</script>

<style>
/* Optional styling improvements */
input[type="file"]::file-selector-button {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background 0.3s;
}

input[type="file"]::file-selector-button:hover {
  background: #4338ca;
}
</style>
