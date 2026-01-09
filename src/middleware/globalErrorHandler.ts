import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

const errorHandler = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let errorMessage = "Internal server error!";

  if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You provied incorrect field types or missing fields";
  }

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    details: error,
  });
};

export default errorHandler;
