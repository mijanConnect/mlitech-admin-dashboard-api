import { api } from "../api/baseApi";

export const customerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET customer PROFILE
    // ---------------------------------------
    getCustomerProfile: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/admin/customers?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["Customer"],
    }),
  }),
});

export const { useGetCustomerProfileQuery } = customerApi;
