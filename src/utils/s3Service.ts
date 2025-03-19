import axios from "axios";

const s3Upload = async (
  formData: any,
  setUploadProgress: (arg0: number) => void
) => {
  try {
    const response = await axios.post(
      `${process.env.VITE_API_BASE_URL}/api/v1/s3/upload`,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || error.message;
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }
};

export const s3ThumbnailUpload = async (formData: any) => {
  try {
    const response = await axios.post(
      `${process.env.VITE_API_BASE_URL}/api/v1/s3/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || error.message;
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }
}

const s3Delete = async (key: any, userId: any, folder: any) => {
  try {
    const response = await axios.delete(
      `${process.env.VITE_API_BASE_URL}/api/v1/s3/delete`,
      {
        data: {
          key,
          userId,
          folder,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || error.message;
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }
};

export { s3Upload, s3Delete };
