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
    }),

    updateReportSummary: builder.mutation<any, UpdateReportSummaryPayload>({
      query: (payload) => ({
        url: "/api/v1/reports/update-summary",
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetReportByInterviewIdQuery,
  useUpdateReportSummaryMutation,
} = reportApiSlice;
