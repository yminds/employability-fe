import { Role } from "./Role";

export type User = {
  _id: string;
  email: string;
  role: Role;
  name: string;
};
