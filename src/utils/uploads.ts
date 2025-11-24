import { NextFunction, Request, Response } from "express";
import ClientError from "../exceptions/ClientError";
import fs from "fs";
import path from "path";

export default async (req: Request, res: Response, next: NextFunction) => {
  const fileData = req.files;

  if (!fileData) {
    throw new ClientError("No file uploaded");
  }

  try {
    // Convert req.files into a unified array of files
    const files: Express.Multer.File[] = Array.isArray(fileData)
      ? fileData
      : (Object.values(fileData).flat() as Express.Multer.File[]);

    if (files.length === 0) {
      throw new ClientError("No file uploaded");
    }

    for (const file of files as Express.Multer.File[]) {
      const originalExt = path.extname(file.originalname);
      const newFileName = `${path.basename(file.filename, path.extname(file.filename))}${originalExt}`;
      const destinationPath = path.resolve(
        __dirname,
        "..",
        "..",
        "uploads",
        newFileName
      );

      // Change original filename to new filename
      file.filename = newFileName;

      // Move or copy file
      fs.renameSync(file.path, destinationPath);
    }

    next();
  } catch (error) {
    throw error;
  }
};
