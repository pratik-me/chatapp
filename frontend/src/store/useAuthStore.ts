import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

type AuthStore = {
    authUser: any;
    isCheckingAuth: boolean;
    isSingingUp: boolean;
    checkAuth: () => void;
    signup: (data: any) => void;
}

export const useAuthStore = create<AuthStore>(set => ({
    authUser: null,
    isCheckingAuth: true,
    isSingingUp: false,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error in authCheck:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data: any) => {
        try {
            set({ isSingingUp: true });
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser: res.data})
            toast.success("Account created successfully!");
        } catch (error) {
            if (error instanceof AxiosError)
                toast.error(error.response?.data.message);
            else {
                console.log(error);
                toast.error("Something went wrong. Please try again later");
            }
        } finally {
            set({ isSingingUp: false });
        }
    }
}))