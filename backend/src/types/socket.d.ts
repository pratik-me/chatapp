import { Socket } from "socket.io";
import type { User } from "@prisma/types";

declare module "socket.io" {
    interface Socket {
        userId: string;
        user: Omit<User, "password">;
    }
}