import { Request, Response } from "express";

export const logoutUser = async (_: Request, res: Response) => {
  const response = {
    success: true,
    message: "Logout successful",
  };

  res.status(200).json(response);
};
