// screeningWorker.ts
 
interface WorkerMessage {
    type: string;
    data: any;
  }
 
  async function pollScreeningProgress(batchId: string, apiBaseUrl: string, jobId: string) {
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/employerMatching/progress/${batchId}`);
      if (!response.ok) {
        throw new Error(`Failed to check progress with status: ${response.status}`);
      }
      const progressData = await response.json();
      self.postMessage({
        type: "SCREENING_PROGRESS",
        data: progressData.data,
      });
      if (!progressData.data.isComplete) {
        setTimeout(() => {
          pollScreeningProgress(batchId, apiBaseUrl, jobId);
        }, 1000);
      } else {
        self.postMessage({
          type: "SCREENING_COMPLETE",
          data: progressData.data,
        });
      }
    } catch (error: any) {
      self.postMessage({
        type: "SCREENING_ERROR",
        data: { error: error instanceof Error ? error.message : "Screening error" },
      });
    }
  }
 
  self.addEventListener("message", (event: MessageEvent<WorkerMessage>) => {
    const { type, data } = event.data;
    switch (type) {
      case "START_SCREENING_PROGRESS":
        // data should include: batchId, apiBaseUrl, jobId
        pollScreeningProgress(data.batchId, data.apiBaseUrl, data.jobId);
        break;
      default:
        console.warn("Unknown message type:", type);
    }
  });
 
  // Let the main thread know the worker is ready
  self.postMessage({ type: "SCREENING_WORKER_READY", data: null });
 
  export {};