export type UserRole = "tenant" | "admin";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}
