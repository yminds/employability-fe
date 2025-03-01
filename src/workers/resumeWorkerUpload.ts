// resumeWorker.ts
/* eslint-disable no-restricted-globals */

// Type definitions
interface UploadProgress {
  completed: number;
  total: number;
  failed: number;
  isParsingDone: boolean;
  processingStartTime?: number;
  processingEndTime?: number;
  message?: string;
}

interface WorkerMessage {
  type: string;
  data: any;
}

// Function to upload resumes
async function uploadResumes(files: File[], apiBaseUrl: string) {
  try {
      // Create FormData
      const formData = new FormData();
      files.forEach(file => {
          formData.append('resumes', file);
      });

      // Make the upload request
      const response = await fetch(`${apiBaseUrl}/api/v1/resume/bulkUpload-resumes`, {
          method: 'POST',
          body: formData
      });

      if (!response.ok) {
          throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      const uploadId = data.data.uploadId;

      // Post successful upload message
      self.postMessage({
          type: 'UPLOAD_COMPLETE',
          data: {
              uploadId,
              message: 'Upload completed successfully'
          }
      });

      // Start polling for progress
      pollProgress(uploadId, apiBaseUrl);
  } catch (error) {
      // Send error message back to main thread
      self.postMessage({
          type: 'UPLOAD_ERROR',
          data: {
              error: error instanceof Error ? error.message : 'Upload failed'
          }
      });
  }
}

// Function to poll for upload progress
async function pollProgress(uploadId: string, apiBaseUrl: string) {
  try {
      const response = await fetch(`${apiBaseUrl}/api/v1/resume/upload-status/${uploadId}`);

      if (!response.ok) {
          throw new Error(`Failed to check progress with status: ${response.status}`);
      }

      const progress: UploadProgress = await response.json();

      // Send progress update to main thread
      self.postMessage({
          type: 'UPLOAD_PROGRESS',
          data: progress
      });

      // Continue polling if not done
      if (!progress.isParsingDone) {
          setTimeout(() => pollProgress(uploadId, apiBaseUrl), 1000);
      } else {
          // When done, fetch the processed resumes
          fetchProcessedResumes(apiBaseUrl);
      }
  } catch (error) {
      self.postMessage({
          type: 'UPLOAD_ERROR',
          data: {
              error: error instanceof Error ? error.message : 'Failed to check progress'
          }
      });
  }
}

// Function to fetch processed resumes
async function fetchProcessedResumes(apiBaseUrl: string) {
  try {
      const response = await fetch(`${apiBaseUrl}/api/v1/resume/getAll-resumes`);

      if (!response.ok) {
          throw new Error(`Failed to fetch resumes with status: ${response.status}`);
      }

      const data = await response.json();

      // Send processed resumes to main thread
      self.postMessage({
          type: 'PROCESSED_RESUMES',
          data: data.data || []
      });
  } catch (error) {
      self.postMessage({
          type: 'UPLOAD_ERROR',
          data: {
              error: error instanceof Error ? error.message : 'Failed to fetch processed resumes'
          }
      });
  }
}

// Listen for messages from the main thread
self.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
  const { type, data } = event.data;

  switch (type) {
      case 'UPLOAD_RESUMES':
          uploadResumes(data.files, data.apiBaseUrl);
          break;
      case 'FETCH_RESUMES':
          fetchProcessedResumes(data.apiBaseUrl);
          break;
      case 'FETCH_PROGRESS':
          // Used when resuming an upload after page navigation
          pollProgress(data.uploadId, data.apiBaseUrl);
          break;
      default:
          console.warn('Unknown message type:', type);
  }
});

// Let the main thread know the worker is ready
self.postMessage({ type: 'WORKER_READY', data: null });

export {}; // This export is needed to make TypeScript treat this as a module