import { axiosInstance } from "./axios.js";

export const signup = async (signupData) => {
      const response = await axiosInstance.post("/auth/signup", signupData);
      return response.data;
};

export const login = async (loginData) => {
      const response = await axiosInstance.post("/auth/login", loginData);
      return response.data;
};

export const logout = async () => {
      const response = await axiosInstance.post("/auth/logout");
      return response.data;
};

export const getAuthUser = async () => {
      try {
            const response = await axiosInstance.get("/auth/me")
            return response.data;
      } catch (error) {
            console.log("Error fetching authenticated user:", error);

            return null
      }
};

export const completeOnboarding = async (userData) => {
      const response = await axiosInstance.post("/auth/onboarding", userData);
      return response.data;
};

export async function getUserFriends() {
      const response = await axiosInstance.get("/user/friends");
      return response.data.data;
};

export async function getRecommendedUsers() {
      const response = await axiosInstance.get("/user");
      return response.data.data;
};

export async function getoutgoingFriendReqs() {
      const response = await axiosInstance.get("/user/outgoing-friend-requests");
      return response.data.data;
};

export async function sendFriendRequest(userId) {
      const response = await axiosInstance.post(`/user/friend-request/${userId}`);
      return response.data.data;
};

export async function getFriendRequests() {
      const response = await axiosInstance.get("/user/friend-requests");
      return response.data.data;
};

export async function acceptFriendRequest(requestId) {
      const response = await axiosInstance.put(`/user/friend-request/${requestId}/accept`);
      return response.data.data;
};


export async function getStreamToken() {
      const response = await axiosInstance.get("/chat/token");
      // return {token: response.data.token};
      return response.data;
};

