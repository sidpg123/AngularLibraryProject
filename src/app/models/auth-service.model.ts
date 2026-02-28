import { User } from "./user.model";

export interface AuthResponse {
  token: string;
  user: User; // Assuming you already have a User model
  message?: string;
}

export interface RegisterPayload {
  username:string,
  password:string,
  fullName:string,
  email:string,
  phone?:string,
  address?:string
}

export interface VerifyTokenResponse {
  valid: boolean,
  user: User
}