export interface UserData {
  id: string;
  username: string;
  email: string;
  confirmed: boolean;
  completed: string[];
  saved: string[];
  created: string[];
}

interface Progress {
  id: number;
  step: number;
}