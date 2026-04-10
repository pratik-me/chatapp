import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

type AuthStore = {
    authUser: any;
    isCheckingAuth: boolean;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthStore>(set => ({
    authUser: null,
    isCheckingAuth: true,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser: res.data});
        } catch (error) {
            console.log("Error in authCheck:", error);
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }
    }
}))