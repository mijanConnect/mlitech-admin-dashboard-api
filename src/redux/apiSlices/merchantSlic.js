import { api } from "../api/baseApi";

export const merchantApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET merchant PROFILE
    // ---------------------------------------
    getMerchantProfile: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/admin/merchants?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["Merchant"],
    }),
    // ---------------------------------------
    // DELETE merchant
    // ---------------------------------------
    deleteMerchant: builder.mutation({
      query: (id) => ({
        url: `/admin/merchants/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Merchant"],
    }),
  }),
});

export const { useGetMerchantProfileQuery, useDeleteMerchantMutation } = merchantApi;
