import { Request, Response } from "express";
import SharedItemServices from "../services/SharedItemServices";
import SharedItemBorrowList from "../models/SharedItemBorrowList";

export default class SharedItemController {
  private sharedItemServices;

  constructor(sharedItemServices: SharedItemServices) {
    this.sharedItemServices = sharedItemServices;
  }

  getSharedItems = async (req: Request, res: Response) => {
    try {
      const sharedItems = await this.sharedItemServices.getSharedItems();
      res.status(200).json({ status: "success", data: sharedItems });
    } catch (error) {
      throw error;
    }
  };

  getSharedItemById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const sharedItem = await this.sharedItemServices.getSharedItemById(
        Number(id),
        {
          include: {
            model: SharedItemBorrowList,
            as: "borrow_lists",
            attributes: { exclude: ["created_at", "updated_at"] },
          },
        }
      );
      res.status(200).json({ status: "success", data: sharedItem });
    } catch (error) {
      throw error;
    }
  };

  postSharedItem = async (req: Request, res: Response) => {
    const { name, description } = req.body;

    try {
      const id = await this.sharedItemServices.addSharedItem({
        name,
        description,
      });
      res.status(201).json({ status: "success", data: { id } });
    } catch (error) {
      throw error;
    }
  };

  updateSharedItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
      await this.sharedItemServices.editSharedItem(Number(id), {
        name,
        description,
      });
      res.status(200).json({
        status: "success",
        message: "Shared item updated successfully",
      });
    } catch (error) {
      throw error;
    }
  };

  deleteSharedItem = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      await this.sharedItemServices.deleteSharedItem(Number(id));
      res.status(200).json({
        status: "success",
        message: "Shared item deleted successfully",
      });
    } catch (error) {
      throw error;
    }
  };
}
