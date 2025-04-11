// For handling file selection
const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0];
};

// Upload image
const uploadImage = async () => {
  if (!selectedFile.value) return;

  try {
    const fileUrl = await uploadImageToServer(selectedFile.value);
    uploadedImageUrl.value = fileUrl;
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

export { handleFileSelect, uploadImage, fetchImages };
