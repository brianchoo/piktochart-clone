import axios from "axios";

const API_URL = "http://localhost:8000";

const uploadImageToServer = async (file) => {
  const formData = new FormData();
  formData.append("upload", file);

  const response = await axios.post(`${API_URL}/uploads`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.file;
};

const fetchUploadedImages = async () => {
  const response = await axios.get(`${API_URL}/images`);
  return response.data;
};

export { uploadImageToServer, fetchUploadedImages };
