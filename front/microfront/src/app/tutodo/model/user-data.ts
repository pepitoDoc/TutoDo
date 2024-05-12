export interface UserData {
  id: string;
  username: string;
  email: string;
  confirmed: boolean;
  completed: string[];
  progress: Progress[];
  creating: string[];
}

interface Progress {
  id: number;
  step: number;
}