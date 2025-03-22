import { createSlice } from "@reduxjs/toolkit";


interface RecorderState {
  recording: boolean;
  error: string | null;
  recorderObject: {
    screenStream: MediaStream;
    micStream: MediaStream;
    audioContext: AudioContext;
    destination: MediaStreamAudioDestinationNode;
    micSource: MediaStreamAudioSourceNode;
    systemAudioSource: MediaStreamAudioSourceNode;
  } | null;
}

const recorderSlice = createSlice({
  name: "recorder",
  initialState: {
    recording: false,
    error: null,
    recorderObject: null,
  } as RecorderState,
  reducers: {
    setRecordingReference(state, action) {
      state.recording = true;
      console.log('[setting the recording reference]');
      console.log('[action.payload]', action.payload);
      
      
      state.recorderObject = action.payload;
    },
    cleanRecordingReference(state) {
      console.log('[cleaning the recording reference]');
      console.log('[state.recorderObject]', state.recorderObject);
      
      if (!state.recorderObject) return;
      
      try {
        // First set recording to false
        state.recording = false;
        
        // Store references locally before nullifying the object
        const { audioContext, micStream, screenStream, destination, micSource, systemAudioSource } = state.recorderObject;
        
        // Close and disconnect all resources
        if (audioContext) audioContext.close();
        
        if (micStream) {
          micStream.getTracks().forEach((track) => track.stop());
        }
        
        if (screenStream) {
          screenStream.getTracks().forEach((track) => track.stop());
        }
        
        if (destination && destination.stream) {
          destination.stream.getTracks().forEach((track) => track.stop());
        }
        
        if (micSource) micSource.disconnect();
        if (systemAudioSource) systemAudioSource.disconnect();
        
        // Finally, set recorderObject to null
        state.recorderObject = null;
      } catch (err) {
        console.error('Error cleaning up recorder:', err);
        // Make sure state is reset even if cleanup fails
        state.recording = false;
        state.recorderObject = null;
      }
    }
  },
});

export const { setRecordingReference, cleanRecordingReference } = recorderSlice.actions;
export default recorderSlice.reducer;
