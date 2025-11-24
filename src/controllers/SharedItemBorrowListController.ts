import { Request, Response } from "express";
import SharedItemBorrowListServices from "../services/SharedItemBorrowListServices";
import SharedItem from "../models/SharedItem";
import AuthorizationError from "../exceptions/AuthorizationError";

export default class SharedItemBorrowListController {
  private service;

  constructor(service: SharedItemBorrowListServices) {
    this.service = service;
  }

  getLists = async (req: Request, res: Response) => {
    const { page, limit, q, returned } = req.query;

    try {
      const lists = await this.service.getLists({
        page: Number(page),
        limit: Number(limit),
        q: q ? String(q) : "",
        returned: returned === "true",
        options: {
          include: {
            model: SharedItem,
            attributes: ["name", "description"],
            as: "item",
          },
        },
      });
      res.status(200).json({
        status: "success",
        data: {
          records: lists.rows,
          metadata: {
            page: Number(page),
            limit: Number(limit),
            total_records: lists.count,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  };

  getUserLists = async (req: Request, res: Response) => {
    const { page, limit, q } = req.query;

    if (!req.user) return;

    try {
      const lists = await this.service.getUserLists({
        page: Number(page),
        limit: Number(limit),
        user_id: req.user.id,
        q: q ? String(q) : "",
        options: {
          include: {
            model: SharedItem,
            attributes: ["name", "description"],
            as: "item",
          },
        },
      });
      res.status(200).json({
        status: "success",
        data: {
          records: lists.rows,
          metadata: {
            page: Number(page),
            limit: Number(limit),
            total_records: lists.count,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  };

  postList = async (req: Request, res: Response) => {
    const { shared_item_id, borrow_start_date, borrow_end_date } = req.body;

    if (!req.user) return;

    const user_id = req.user.id;
    const name = req.user.username;

    try {
      const id = await this.service.addList({
        shared_item_id,
        name,
        borrow_start_date,
        borrow_end_date,
        user_id,
      });
      res.status(201).json({ status: "success", data: { id } });
    } catch (error) {
      throw error;
    }
  };

  updateList = async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const photo = files[0];
    const { id } = req.params;

    if (!photo) return;

    try {
      await this.service.editList(Number(id), photo);
      res.status(201).json({ status: "success", data: { id } });
    } catch (error) {
      throw error;
    }
  };

  deleteList = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;

    if (!user) return;

    try {
      const list = await this.service.getListById(Number(id));

      if (list.user_id !== user.id) {
        throw new AuthorizationError(
          "You are not authorized to delete this borrow list"
        );
      }

      await list.destroy();
      res.status(200).json({
        status: "success",
        message: "Borrow list deleted successfully",
      });
    } catch (error) {
      throw error;
    }
  };
}
