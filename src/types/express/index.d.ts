import User from "../User";

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface User {
      id: number;
      username: string;
      role_id: number;
    }

    export interface Request {
      user?: User;
    }
  }
}
