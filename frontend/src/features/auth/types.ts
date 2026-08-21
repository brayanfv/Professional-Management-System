export type UserRole = "ADMIN";

export type AuthenticatedUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: AuthenticatedUser;
};
