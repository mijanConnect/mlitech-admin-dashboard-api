import { api } from "../api/baseApi";

export const salesRepApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET Sales Rep data
    // ---------------------------------------
    getSalesRepData: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);

        return {
          url: `/sales-rep?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["SalesRep"],
    }),
  }),
});

export const { useGetSalesRepDataQuery } = salesRepApi;
