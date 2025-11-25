import { api } from "../api/baseApi";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // OTP VERIFY
    // ---------------------------------------
    otpVerify: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
    }),

    // ---------------------------------------
    // LOGIN
    // ---------------------------------------
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: {
          identifier: credentials.identifier,
          password: credentials.password,
        },
      }),
      transformResponse: (data) => data,
    }),

    // ---------------------------------------
    // FORGOT PASSWORD
    // ---------------------------------------
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    // ---------------------------------------
    // RESET PASSWORD
    // Accepts: { body, headers } OR just body
    // ---------------------------------------
    resetPassword: builder.mutation({
      query: (value) => {
        const body = value?.body ?? value;
        const headers = value?.headers;

        return {
          url: "/auth/reset-password",
          method: "POST",
          body,
          ...(headers && { headers }),
        };
      },
    }),

    // ---------------------------------------
    // CHANGE PASSWORD
    // ---------------------------------------
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),

    // ---------------------------------------
    // UPDATE PROFILE
    // ---------------------------------------
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/user",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    // ---------------------------------------
    // GET PROFILE
    // ---------------------------------------
    profile: builder.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),

      transformResponse: (response) =>
        response?.data ?? response?.user ?? response,

      providesTags: ["Profile"],
    }),
  }),
});

export const {
  useOtpVerifyMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useProfileQuery,
} = authApi;
