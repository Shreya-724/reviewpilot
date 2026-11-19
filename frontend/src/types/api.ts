export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  date_joined: string;
}

export interface AuthResponse {
  access: string;
  user: User;
}