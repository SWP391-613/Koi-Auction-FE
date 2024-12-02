// userApi.ts

import { handleRequest } from "~/helpers/api.helpers";
import { api } from "./api";

export const userApi = {
  updateAccountBalance: async (userId: number, payment: number) =>
    handleRequest(
      () => api.put(`/users/${userId}/deposit/${payment}`),
      "Failed to update account balance",
    ),

  verifyOtpToVerifyUser: async (email: string, otp: string) =>
    handleRequest(
      () => api.post("/users/verify", { email, otp }),
      "OTP verification failed",
    ),

  updateUserField: async (userId: number, field: string, value: any) =>
    handleRequest(
      () => api.put(`/users/${userId}`, { [field]: value }),
      "Failed to update user information",
    ),

  updateUserRole: async (id: number, roleId: number) =>
    handleRequest(
      () => api.put(`/users/${id}/update-role/${roleId}`),
      "Failed to update user role",
    ),

  softDeleteUser: async (id: number) =>
    handleRequest(() => api.delete(`/users/${id}`), "Failed to delete user"),

  undoDeleteUser: async (id: number) =>
    handleRequest(
      () => api.put(`/users/${id}/restore`),
      "Failed to restore user",
    ),

  fetchUserDetails: async () =>
    handleRequest(
      () => api.post("/users/details"),
      "Failed to fetch user details",
    ),
};
