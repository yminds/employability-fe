// hooks/useS3Upload.ts
import { useState } from 'react';
import axios from 'axios';

interface UploadProgress {
  [key: string]: number;
}

export const useS3Upload = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});

  const uploadToS3 = async (file: File, projectId: string, fileType: 'thumbnail' | 'synopsisDoc' | 'images') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', `projects/${projectId}/${fileType}`);

    try {
      const response = await axios.post('/api/v1/s3/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total 
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: progress
          }));
        }
      });

      return response.data.data.fileUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const deleteFromS3 = async (key: string) => {
    try {
      await axios.delete('/api/v1/s3/delete', { data: { key } });
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  };

  return { uploadToS3, deleteFromS3, uploadProgress };
};