import { apiSlice } from "./apiSlice";

interface UpdateReportSummaryPayload {
  reportId: string;
  summary: string;
}

export const reportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReportByInterviewId: builder.query<any, string>({
      query: (interviewId: string) => ({
        url: `/api/v1/report/get/${interviewId}`,
        method: "GET",
      }),
      // no cahce for now
      keepUnusedDataFor: 0,
    }),

    updateReportSummary: builder.mutation<any, UpdateReportSummaryPayload>({
      query: (payload) => ({
        url: "/api/v1/reports/update-summary",
        method: "PATCH",
        body: payload,
      }),
    }),

    updateReportRecording: builder.mutation<any, { interview_id: string; s3RecordingUrl: string }>({
      query: ({ interview_id, s3RecordingUrl }) => ({
        url: "/api/v1/report/update-s3-recording-url",
        method: "PUT",
        body: { interview_id, s3_recording_url:s3RecordingUrl },
      }),
    }),
  }),
});

export const {
  useGetReportByInterviewIdQuery,
  useUpdateReportSummaryMutation,
  useUpdateReportRecordingMutation
} = reportApiSlice;
