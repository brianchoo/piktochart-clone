<script setup>
import { ref, onMounted } from "vue";
import { randomNumberGenerator } from "@/helpers/randomNumberGenerator";
import { showContextMenu } from "@/utils/contextMenu";
import { makeElementDraggable } from "@/utils/draggableElement";
import { addTextToCanvas, addImageToCanvas } from "@/utils/addItemToCanvas";
import { saveCanvasState } from "@/utils/saveCanvasState";
import { recreateCanvasFromState } from "@/utils/recreateCanvasFromState";
import { handleCanvasClick, handleKeyDown } from "@/utils/handleCanvas";
import { uploadImageToServer, fetchUploadedImages } from "@/services/api";
import axios from "axios";

// State for file upload
const selectedFile = ref(null);
const uploadedImageUrl = ref("");
const imagesList = ref([]);
const activeElement = ref(null);
const canvasItems = ref([]);

// For handling file selection
const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0];
};

const handleAddImage = (imageUrl) => {
  addImageToCanvas(imageUrl, canvasItems, activeElement);
};

const handleAddText = () => {
  addTextToCanvas(canvasItems, activeElement);
};

// Upload image
const uploadImage = async () => {
  if (!selectedFile.value) return;

  try {
    const fileUrl = await uploadImageToServer(selectedFile.value);
    uploadedImageUrl.value = fileUrl;
    selectedFile.value = null;
    await fetchImages(); // Refresh image list
  } catch (error) {
    console.error("Error in uploadImage:", error);
  }
};

// Fetch image list
const fetchImages = async () => {
  try {
    imagesList.value = await fetchUploadedImages();
  } catch (error) {
    console.error("Error in fetchImages:", error);
  }
};

onMounted(() => {
  fetchImages(); // Load existing images

  document.addEventListener("keydown", (e) =>
    handleKeyDown(e, activeElement, canvasItems)
  );

  const savedState = localStorage.getItem("canvasState");
  if (savedState) {
    try {
      canvasItems.value = JSON.parse(savedState);
      recreateCanvasFromState(
        canvasItems,
        activeElement,
        makeElementDraggable,
        handleCanvasClick(activeElement)
      );
    } catch (e) {
      console.error("Error loading saved state:", e);
    }
  }
});
</script>

<template>
  <div class="h-100 w-100">
    <div class="row h-100 w-100 m-0">
      <div class="sidepane h-100 bg-dark text-white col-2">
        <div class="form mt-5">
          <h3>Form</h3>
          <hr />
          <div class="custom-file">
            <input
              id="upload-image-input"
              class="custom-file-input"
              name="upload"
              type="file"
              @change="handleFileSelect"
              accept=".jpg, .jpeg, .png"
            />
            <label class="custom-file-label" for="upload-image-input">{{
              selectedFile ? selectedFile.name : "Choose Image"
            }}</label>
          </div>
          <div class="input-group-append">
            <button
              class="btn btn-info w-100 mt-2"
              type="button"
              id="upload-image"
              @click="uploadImage"
            >
              Upload
            </button>
          </div>
          <!-- Upload Form here -->
        </div>
        <div class="assets w-100 mt-5">
          <h3>Assets</h3>
          <hr />
          <div class="text">
            <h4>Text</h4>
            <input id="addTextInput" type="text" class="form-control" />
            <button
              id="addText"
              class="btn btn-info btn-block mt-2"
              @click="handleAddText"
            >
              Add Text
            </button>
          </div>
          <div class="image">
            <h4>Images</h4>
            <ul class="list-unstyled">
              <!-- List of images here -->
              <li
                v-for="(image, index) in imagesList"
                :key="index"
                class="mb-2"
              >
                <img
                  :src="image"
                  class="img-thumbnail"
                  style="max-width: 50px"
                  @click="handleAddImage(image)"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="canvas col-10">
        <div class="block mx-auto mt-3 position-relative">
          <!-- Add images and texts to here -->
        </div>
      </div>
    </div>
  </div>
</template>
