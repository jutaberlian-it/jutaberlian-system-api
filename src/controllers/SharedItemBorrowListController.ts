import { Request, Response } from "express";
import SharedItemBorrowListServices from "../services/SharedItemBorrowListServices";

export default class SharedItemBorrowListController {
  private service;

  constructor(service: SharedItemBorrowListServices) {
    this.service = service;
  }

  getLists = async (req: Request, res: Response) => {
    try {
      const lists = await this.service.getLists();
      res.status(200).json({ status: "success", data: lists });
    } catch (error) {
      throw error;
    }
  };

  postList = async (req: Request, res: Response) => {
    const { shared_item_id, name, borrow_start_date, borrow_end_date } =
      req.body;

    try {
      const id = await this.service.addList({
        shared_item_id,
        name,
        borrow_start_date,
        borrow_end_date,
      });
      res.status(201).json({ status: "success", data: { id } });
    } catch (error) {
      throw error;
    }
  };

  deleteList = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      await this.service.deleteList(Number(id));
      res
        .status(200)
        .json({
          status: "success",
          message: "Borrow list deleted successfully",
        });
    } catch (error) {
      throw error;
    }
  };
}
