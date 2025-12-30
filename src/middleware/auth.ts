import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";

// create global type here
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

// create role enum
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await betterAuth.api.getSession({
      headers: req.headers as any,
    });

    if (!session) {
      res.status(401).json({
        success: false,
        message: "You are not authorized",
      });
    }

    if (!session?.user.emailVerified) {
      res.status(403).json({
        success: false,
        message: "Email verifation requried. Please verify your email",
      });
    }

    req.user = {
      id: session?.user.id as string,
      name: session?.user.name as string,
      email: session?.user.email as string,
      role: session?.user.role as string,
      emailVerified: session?.user.emailVerified as boolean,
    };

    if (roles.length && !roles.includes(req.user.role as UserRole)) {
      res.status(403).json({
        success: false,
        message:
          "Forbidden! You don't have permission to access this resources",
      });
    }
    next();
  };
};

export default auth;

/**
 *
 * For Better-auth authentication
 * retrive data using auth.api.getSession method and store session variable inside
 * create golobal tye of user so that can access all palce in application
 * if session data not get then send error status
 * session data has but user email not verified then send error status
 * again session data has but user role not mase this case send unothorize error status
 *
 */
