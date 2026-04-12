import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import type { SignupFormData } from "../pages/SignupPage";
import type { LoginFormData } from "../pages/LoginPage";
import type { User } from "@prisma/db-types";

type AuthStore = {
    authUser: User | null;
    isCheckingAuth: boolean;
    isSingingUp: boolean;
    isLogginIn: boolean;
    isProfileLoading: boolean;
    checkAuth: () => void;
    signup: (data: SignupFormData) => void;
    login: (data: LoginFormData) => void;
    logout: () => void;
    updateProfile: (data: any) => void;
}

export const useAuthStore = create<AuthStore>(set => ({
    authUser: null,
    isCheckingAuth: true,
    isSingingUp: false,
    isLogginIn: false,
    isProfileLoading: false,

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

    signup: async (data: SignupFormData) => {
        try {
            set({ isSingingUp: true });
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data })
            toast.success("Account created successfully!");
        } catch (error) {
            if (error instanceof AxiosError)
                toast.error(error.response?.data.message);
            else {
                console.log("Signup error:\n", error);
                toast.error("Something went wrong. Please try again later");
            }
        } finally {
            set({ isSingingUp: false });
        }
    },

    login: async (data: LoginFormData) => {
        try {
            set({ isLogginIn: true });
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data })
            toast.success("Logged in successfully!");
        } catch (error) {
            if (error instanceof AxiosError)
                toast.error(error.response?.data);
            else {
                console.log("Login error:\n", error);
                toast.error("Something went wrong. Please try again later");
            }
        } finally {
            set({ isLogginIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Failed to log out");
            console.log("Log Out error:\n", error)
        }
    },

    updateProfile: async (data: {profilePic: string | null}) => {
        try {
            set({isProfileLoading: true});
            const res = await axiosInstance.post("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error in update profile:", error);
            if (error instanceof AxiosError) toast.error(error.response?.data.message);
            else toast.error("Something went wrong while updating profile!")
        } finally {
            set({isProfileLoading: false});
        }
    }
}))