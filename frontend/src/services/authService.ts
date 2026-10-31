import api from "./api";

export interface User {
  id: number;
  username: string;
  email: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
}

export interface AuthResponse {
  user: User;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// REGISTER CUSTOMER
export const registerUser = async (data: RegisterData) => {
  const response = await api.post<AuthResponse>(
    "auth/register/",
    data
  );

  return response.data;
};

// LOGIN
export const loginUser = async (data: LoginData) => {
  const response = await api.post<AuthResponse>(
    "auth/login/",
    data
  );

  return response.data;
};

// REQUEST PASSWORD RESET
export const requestPasswordReset = async (email: string) => {
  const response = await api.post("auth/password-reset/", {
    email,
  });

  return response.data;
};

// CONFIRM PASSWORD RESET
export const confirmPasswordReset = async (
  user_id: number,
  token: string,
  password: string
) => {
  const response = await api.post(
    "auth/password-reset/confirm/",
    {
      user_id,
      token,
      password,
    }
  );

  return response.data;
};

// LOGOUT
// A backend logout endpoint does not currently exist.
// This function will be completed after that endpoint is added.