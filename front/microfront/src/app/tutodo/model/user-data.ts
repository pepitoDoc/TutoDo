export interface AllUserData {
  id: string;
  username: string;
  email: string;
  confirmed: boolean;
  completed: string[];
  saved: string[];
  created: string[];
  preferences: string[];
}

export interface UserData {
  id: string;
  username: string;
  saved: string[];
  created: string[];
  preferences: string[];
}