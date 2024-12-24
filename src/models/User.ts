import { Role } from "./Role";

export type User = {
    id: number;
    email: string;
    role: Role;
    name: string
}