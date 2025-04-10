<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// State for file upload
const selectedFile = ref(null);
const uploadedImageUrl = ref("");
const imagesList = ref([]);
const helloMessage = ref("");

// random number generator function
const randomNumber = () => Math.floor(Math.random() * 100000);

const handleClickCurrentElement = (e) => {
  const clickedElement = e.currentTarget;
  console.log(clickedElement, "clickedElement");
  alert("You clicked:", clickedElement);
};

// For handling file selection
const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0];
  console.log(selectedFile.value);
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
  img.id = randomNumber();
  // img.addEventListener("click", handleClickCurrentElement);
  img.src = imageUrl;
  img.style.position = "absolute";
  img.style.width = "100px";
  img.style.height = "100px";
  img.style.margin = "10px";
  img.style.top = "50%";
  img.style.left = "50%";
  img.style.transform = "translate(-50%, -50%)";
  img.style.cursor = "move"; // Change cursor to indicate draggable

  // Make the image draggable
  img.setAttribute("draggable", "false"); // Prevent default HTML5 dragging behavior

  // Variables to track dragging
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  // Mouse down event - start dragging
  img.addEventListener("mousedown", (e) => {
    isDragging = true;

    // Calculate offset from the center of the image
    const rect = img.getBoundingClientRect();
    offsetX = e.clientX - (rect.left + rect.width / 2 - 50);
    offsetY = e.clientY - (rect.top + rect.height / 2 - 50);

    // Bring element to front when dragging starts
    img.style.zIndex = 1000;

    // Prevent any default behavior
    e.preventDefault();
  });

  // Mouse move event - handle dragging
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) {
      img.style.border = "none";
      return;
    }

    // Calculate new position relative to the canvas
    const blockRect = block.getBoundingClientRect();
    const newX = e.clientX - blockRect.left - offsetX;
    const newY = e.clientY - blockRect.top - offsetY;

    // Update position
    img.style.left = newX + "px";
    img.style.top = newY + "px";
    img.style.transform = "none"; // Remove the centering transform
    img.style.border = "1px solid red";

    e.preventDefault();
  });

  // Mouse up event - stop dragging
  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      img.style.zIndex = "auto"; // Reset z-index
    }
  });

  // Mouse leave - stop dragging if cursor leaves the window
  document.addEventListener("mouseleave", () => {
    isDragging = false;
  });

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

  p.id = randomNumber();
  p.style.position = "absolute";
  p.style.width = "100px";
  p.style.height = "100px";
  p.style.margin = "10px";
  p.style.top = "50%";
  p.style.left = "50%";
  p.style.transform = "translate(-50%, -50%)";
  p.style.cursor = "move"; // Change cursor to indicate draggable

  // Make the image draggable
  p.setAttribute("draggable", "false"); // Prevent default HTML5 dragging behavior

  // Variables to track dragging
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  // Mouse down event - start dragging
  p.addEventListener("mousedown", (e) => {
    isDragging = true;

    // Calculate offset from the center of the image
    const rect = p.getBoundingClientRect();
    offsetX = e.clientX - (rect.left + rect.width / 2 - 50);
    offsetY = e.clientY - (rect.top + rect.height / 2 - 50);

    // Bring element to front when dragging starts
    p.style.zIndex = 1000;

    // Prevent any default behavior
    e.preventDefault();
  });

  // Mouse move event - handle dragging
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) {
      p.style.border = "none";
      return;
    }

    // Calculate new position relative to the canvas
    const blockRect = block.getBoundingClientRect();
    const newX = e.clientX - blockRect.left - offsetX;
    const newY = e.clientY - blockRect.top - offsetY;

    // Update position
    p.style.left = newX + "px";
    p.style.top = newY + "px";
    p.style.transform = "none"; // Remove the centering transform
    p.style.border = "1px solid red";

    e.preventDefault();
  });

  // Mouse up event - stop dragging
  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      p.style.zIndex = "auto"; // Reset z-index
    }
  });

  // Mouse leave - stop dragging if cursor leaves the window
  document.addEventListener("mouseleave", () => {
    isDragging = false;
  });

  block.appendChild(p);

  textInput.value = "";
};

// Initialize
onMounted(() => {
  fetchImages(); // Load existing images
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
        <div class="block mx-auto mt-3 position-relative">
          <!-- Add images and texts to here -->
        </div>
      </div>
    </div>
  </div>
</template>
