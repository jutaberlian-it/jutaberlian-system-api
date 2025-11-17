import User from "../models/User";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import AuthorizationError from "../exceptions/AuthorizationError";
import { ModelStatic } from "sequelize";
import NotFoundError from "../exceptions/NotFound";
import { JWT_SECRET } from "../constant";
import { AuthenticatedUser } from "../types/AuthenticatedUser";

export default class AuthServices {
  private user;

  constructor(user: ModelStatic<User>) {
    this.user = user;
  }

  validateUser = async (username: string, password: string) => {
    try {
      const user = await this.user.findOne({ where: { username } });

      if (!user) {
        return false;
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password);

      return isPasswordValid;
    } catch (error) {
      throw error;
    }
  };

  generateToken = async (username: string) => {
    try {
      const user = await this.user.findOne({ where: { username } });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      const payload = {
        id: user.id,
        username: user.username,
      };
      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "1h",
      });

      return token;
    } catch (error) {
      throw error;
    }
  };

  verifyToken = async (token: string) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;

      if (!decoded) {
        throw new AuthorizationError("Invalid token");
      }

      return decoded;
    } catch (error) {
      throw error;
    }
  };
}
