<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// State for file upload
const selectedFile = ref(null);
const uploadedImageUrl = ref("");
const imagesList = ref([]);
const helloMessage = ref("");

// For handling file selection
const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0];
  console.log(selectedFile.value);
};

// Hello World API call example
const fetchHelloWorld = async () => {
  try {
    // This is a placeholder - in a real app, you'd have this endpoint
    const response = await axios.get("http://localhost:8000/api/hello");
    console.log(response);
    helloMessage.value = response.data.message;
  } catch (error) {
    console.error("Error fetching hello world:", error);
  }
};

// Upload image to the server
const uploadImage = async () => {
  if (!selectedFile.value) {
    alert("Please select a file first!");
    return;
  }

  const formData = new FormData();
  formData.append("upload", selectedFile.value);

  try {
    const response = await axios.post(
      "http://localhost:8000/uploads",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    uploadedImageUrl.value = response.data.file;
    fetchImages(); // Retrieve image after upload
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("Upload failed: " + (error.response?.data?.message || error.message));
  }
};

// Fetch all images
const fetchImages = async () => {
  try {
    const response = await axios.get("http://localhost:8000/images");
    imagesList.value = response.data;
    console.log(imagesList.value, "imagesList.value");
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

// Add an image to the canvas
const addImageToCanvas = (imageUrl) => {
  const block = document.querySelector(".block");
  const img = document.createElement("img");
  img.src = imageUrl;
  img.style.maxWidth = "100%";
  img.style.margin = "10px";
  block.appendChild(img);
};

// Add text to the canvas
const addTextToCanvas = () => {
  const textInput = document.getElementById("addTextInput");
  if (!textInput.value) return;

  const block = document.querySelector(".block");
  const p = document.createElement("p");
  p.textContent = textInput.value;
  p.style.margin = "10px";
  block.appendChild(p);

  textInput.value = "";
};

// Initialize
onMounted(() => {
  fetchHelloWorld(); // Example API call
  fetchImages(); // Load existing images

  // Set up event listener for the "Add Text" button
  // document.getElementById("addText").addEventListener("click", addTextToCanvas);
});
</script>

<template>
  <div class="h-100 w-100">
    <div class="row h-100 w-100 m-0">
      <div class="sidepane h-100 bg-dark text-white col-2">
        <div class="form mt-5">
          <h3>Form</h3>
          <hr />
          <!-- <div class="input-group"> -->
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
          <!-- </div> -->
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
              @click="addTextToCanvas"
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
                  @click="addImageToCanvas(image)"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="canvas col-10">
        <div class="block mx-auto mt-3">
          <!-- Add images and texts to here -->
        </div>
      </div>
    </div>
  </div>
</template>
