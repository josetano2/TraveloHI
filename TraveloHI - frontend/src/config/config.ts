import { Cloudinary } from "@cloudinary/url-gen";

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
export const PREDICT_API_URL = import.meta.env.VITE_PREDICT_API_URL || "http://localhost:5000";

export const cld = new Cloudinary({
  cloud: { 
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }
});

export async function uploadImage(file: File, onLoading: (loading: boolean) => void) {
  onLoading(true);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string);

  const response = await fetch(import.meta.env.VITE_CLOUDINARY_API_URL as string, {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    const data = await response.json();
    onLoading(false);
    return data.secure_url;
  } else {
    onLoading(false);
    throw new Error("Upload failed");
  }
}
