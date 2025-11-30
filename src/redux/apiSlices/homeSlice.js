import { api } from "../api/baseApi";

export const homeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET Statistics Data
    // ---------------------------------------
    getStatisticsData: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/overview/admin-statistics?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["Statistics"],
    }),
  }),
});

export const { useGetStatisticsDataQuery } = homeApi;
