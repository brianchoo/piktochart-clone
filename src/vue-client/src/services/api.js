import axios from "axios";

const API_URL = "http://localhost:8000";

const uploadImageToServer = async (file) => {
  try {
    const formData = new FormData();
    formData.append("upload", file);

    const response = await axios.post(`${API_URL}/uploads`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.file;
  } catch (error) {
    console.error("Error in uploadImageToServer:", error);
  }
};

const fetchUploadedImages = async () => {
  try {
    const response = await axios.get(`${API_URL}/images`);
    return response.data;
  } catch (error) {
    console.error("Error in fetchUploadedImages:", error);
  }
};

export { uploadImageToServer, fetchUploadedImages };
