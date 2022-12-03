import { Role } from "./role";

export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    role: Role;
    is_active: boolean;
}