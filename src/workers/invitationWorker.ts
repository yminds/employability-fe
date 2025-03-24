// interviewWorker.ts

interface WorkerMessage {
  type: string;
  data: any;
}

// Function to send invitations
async function sendInvitations(jobId: string, candidateIds: string[], interviewType: "full" | "screening", applicationDeadline: string, apiBaseUrl: string) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/employerInterviewInvitation/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        job_id: jobId,
        candidate_ids: candidateIds,
        interview_type: interviewType,
        application_deadline: applicationDeadline
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to send invitations with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'API returned unsuccessful response');
    }
    
    self.postMessage({
      type: "BATCH_CREATED",
      data: { batchId: data.data.batch_id }
    });
    
    return data.data.batch_id;
  } catch (error: any) {
    self.postMessage({
      type: "INTERVIEW_ERROR",
      data: { error: error instanceof Error ? error.message : "Failed to send interview invitations" }
    });
    throw error;
  }
}

// Function to check invitation progress
async function pollInvitationProgress(batchId: string, apiBaseUrl: string) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/employerInterviewInvitation/invite/progress/${batchId}`);

    if (!response.ok) {
      throw new Error(`Failed to check progress with status: ${response.status}`);
    }

    const progressResponse = await response.json();
    
    if (!progressResponse.success) {
      throw new Error('API returned unsuccessful progress response');
    }
    
    const progressData = progressResponse.data;
    
    // Calculate if process is complete
    const isComplete = progressData.total > 0 && 
                      (progressData.completed + progressData.failed >= progressData.total);

    const enhancedData = {
      ...progressData,
      isComplete
    };

    self.postMessage({
      type: "INVITATION_PROGRESS",
      data: enhancedData
    });

    if (!isComplete) {
      // Continue polling if not complete
      setTimeout(() => {
        pollInvitationProgress(batchId, apiBaseUrl);
      }, 2000);
    } else {
      // Notify completion
      self.postMessage({
        type: "INVITATION_COMPLETE",
        data: enhancedData
      });
    }
    
    return enhancedData;
  } catch (error: any) {
    self.postMessage({
      type: "INTERVIEW_ERROR",
      data: { error: error instanceof Error ? error.message : "Failed to check invitation progress" }
    });
    throw error;
  }
}

self.addEventListener("message", async (event: MessageEvent<WorkerMessage>) => {
  const { type, data } = event.data;
  
  switch (type) {
    case "SEND_INVITATIONS":
      try {
        const { jobId, candidateIds, interviewType, applicationDeadline, apiBaseUrl } = data;
        
        // Send invitations and get batch ID
        const batchId = await sendInvitations(
          jobId,
          candidateIds,
          interviewType,
          applicationDeadline,
          apiBaseUrl
        );
        
        // Start polling for this batch
        pollInvitationProgress(batchId, apiBaseUrl);
      } catch (error) {
        // Error is already handled in the sendInvitations function
        console.error("Error in worker:", error);
      }
      break;
      
    case "START_INVITATION_PROGRESS":
      // Start polling for an existing batch ID
      pollInvitationProgress(data.batchId, data.apiBaseUrl);
      break;
      
    default:
      console.warn("Unknown message type:", type);
  }
});

// Let the main thread know the worker is ready
self.postMessage({ type: "INTERVIEW_WORKER_READY", data: null });

export {};