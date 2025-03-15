interface WorkerMessage {
  type: string;
  data: any;
}

async function pollInvitationProgress(batchId: string, apiBaseUrl: string, jobId: string) {
  try {
    // Using the correct endpoint from the frontend API
    const response = await fetch(`${apiBaseUrl}/api/v1/employerInterview/progress/${batchId}`);
    if (!response.ok) {
      throw new Error(`Failed to check invitation progress with status: ${response.status}`);
    }
    const progressData = await response.json();
    self.postMessage({
      type: "INVITATION_PROGRESS",
      data: progressData.data,
    });
    if (!progressData.data.isComplete) {
      setTimeout(() => {
        pollInvitationProgress(batchId, apiBaseUrl, jobId);
      }, 1000);
    } else {
      self.postMessage({
        type: "INVITATION_COMPLETE",
        data: progressData.data,
      });
    }
  } catch (error: any) {
    self.postMessage({
      type: "INVITATION_ERROR",
      data: { error: error instanceof Error ? error.message : "Invitation error" },
    });
  }
}

self.addEventListener("message", (event: MessageEvent<WorkerMessage>) => {
  const { type, data } = event.data;
  switch (type) {
    case "START_INVITATION_PROGRESS":
      // data should include: batchId, apiBaseUrl, jobId
      pollInvitationProgress(data.batchId, data.apiBaseUrl, data.jobId);
      break;
    default:
      console.warn("Unknown message type:", type);
  }
});

// Let the main thread know the worker is ready
self.postMessage({ type: "INVITATION_WORKER_READY", data: null });

export {};