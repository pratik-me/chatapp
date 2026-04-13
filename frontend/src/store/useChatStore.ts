import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import type { User, Message } from "@prisma/db-types"
import { useAuthStore } from "./useAuthStore";

export type ChatStore = {
    allContacts: User[];
    chats: User[];
    messages: Message[];
    activeTab: "chats" | "contacts";
    selectedUser: User | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    isSoundEnabled: boolean;

    toggleSound: () => void;
    setActiveTab: (tab: "chats" | "contacts") => void;
    setSelectedUser: (user: User | null) => void
    getAllContacts: () => void;
    getChatPartners: () => void;
    getMessagesByUserId: (userId: string) => void;
    sendMessage: (msg: { text?: string; image?: string | null }) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",

    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", `${!get().isSoundEnabled}`)
        set({ isSoundEnabled: !get().isSoundEnabled })
    },

    setActiveTab: (tab) => set({ activeTab: tab }),

    setSelectedUser: (user) => set({ selectedUser: user }),

    getAllContacts: async () => {
        try {
            set({ isUsersLoading: true });
            const res = await axiosInstance.get("/messages/contacts");
            set({ allContacts: res.data });
        } catch (error) {
            if (error instanceof AxiosError)
                toast.error(error.response?.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getChatPartners: async () => {
        try {
            set({ isUsersLoading: true });
            const res = await axiosInstance.get("/messages/chats");
            set({ chats: res.data });
        } catch (error) {
            console.log(error);
            if (error instanceof AxiosError)
                toast.error(error.response?.data.message);
            else toast.error("Something went wrong while fetching chat partners!")
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessagesByUserId: async (userId) => {
        try {
            set({ isMessagesLoading: true });
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data })
        } catch (error) {
            if (error instanceof AxiosError)
                toast.error(error.response?.data.message || "Something went wrong!");
            console.log("Error while fetching partner message:", error);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (msg) => {
        const { selectedUser, messages } = get();
        const { authUser } = useAuthStore.getState();
        try {
            const optimisticMessage: Message = {
                id: `temp-${new Date().toISOString()}`,
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now()),
                senderId: authUser?.id || "",
                receiverId: selectedUser?.id || "",
                text: msg.text || "",
                image: msg.image || "",
            }
            set({ messages: [...messages, optimisticMessage] });

            const res = await axiosInstance.post(`/messages/send/${selectedUser?.id}`, msg);
            set({ messages: messages.concat(res.data) });
        } catch (error) {
            set({ messages: messages })
            if (error instanceof AxiosError)
                toast.error(error.response?.data.message || "Failed to send message!");
            console.log("Error while sending message: \n", error);
        }
    }
}))