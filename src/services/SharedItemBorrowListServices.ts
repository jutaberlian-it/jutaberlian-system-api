import { FindOptions, ModelStatic, Op, WhereOptions } from "sequelize";
import SharedItemBorrowList from "../models/SharedItemBorrowList";
import NotFoundError from "../exceptions/NotFound";
import ClientError from "../exceptions/ClientError";
import SharedItem from "../models/SharedItem";

export default class SharedItemBorrowListServices {
  private model;

  constructor(model: ModelStatic<SharedItemBorrowList>) {
    this.model = model;
  }

  getLists = async ({
    page = 1,
    limit = 10,
    q,
    returned = false,
    options,
  }: {
    page: number;
    limit: number;
    q?: string;
    returned?: boolean;
    options?: FindOptions;
  }) => {
    try {
      const where: WhereOptions = {};

      if (returned) {
        where.return_photo_url = {
          [Op.not]: null,
        };
      } else {
        where.return_photo_url = {
          [Op.is]: null,
        };
      }

      if (q && q !== "") {
        where.name = {
          [Op.iLike]: `%${q}%`,
        };
      }

      return this.model.findAndCountAll({
        ...options,
        attributes: { exclude: ["created_at", "updated_at"] },
        offset: (page - 1) * limit,
        limit: limit,
        where,
      });
    } catch (error) {
      throw error;
    }
  };

  getUserLists = async ({
    page = 1,
    limit = 10,
    user_id,
    q,
    options,
  }: {
    page: number;
    limit: number;
    user_id: number;
    q?: string;
    options?: FindOptions;
  }) => {
    try {
      const where: WhereOptions = {};

      if (q && q !== "") {
        where.name = {
          [Op.iLike]: `%${q}%`,
        };
      }

      return this.model.findAndCountAll({
        ...options,
        attributes: { exclude: ["created_at", "updated_at"] },
        offset: (page - 1) * limit,
        limit: limit,
        where: {
          return_photo_url: {
            [Op.is]: null,
          },
          user_id,
        },
        include: {
          model: SharedItem,
          as: "item",
          where,
        },
      });
    } catch (error) {
      throw error;
    }
  };

  getListById = async (id: number) => {
    try {
      const list = await this.model.findByPk(id, {
        attributes: { exclude: ["created_at", "updated_at"] },
      });

      if (!list) {
        throw new NotFoundError("Shared item borrow list not found");
      }

      return list;
    } catch (error) {
      throw error;
    }
  };

  getListsByItemId = async (itemId: number) => {
    try {
      return this.model.findAll({
        where: { shared_item_id: itemId },
        attributes: { exclude: ["created_at", "updated_at"] },
      });
    } catch (error) {
      throw error;
    }
  };

  addList = async (data: {
    shared_item_id: number;
    name: string;
    borrow_start_date: Date;
    borrow_end_date: Date;
    user_id: number;
  }) => {
    try {
      const borrowList = await this.model.findOne({
        where: {
          shared_item_id: data.shared_item_id,
          /* 
          Find overlaping condition between two date ranges:
          First think about when two date ranges do NOT overlap
          They do not overlap if one ends before the other starts.
          A = existing borrow, B = new borrow
          A_end <= B_start OR B_end <= A_start
          
          Negating this condition gives us the overlapping condition:
          A_end > B_start AND A_start < B_end 
          */
          borrow_start_date: { [Op.lt]: data.borrow_end_date },
          borrow_end_date: { [Op.gt]: data.borrow_start_date },
        },
      });

      if (borrowList) {
        throw new ClientError("Borrow list conflicts with existing entry");
      }

      const newList = await this.model.create(data);
      return newList.id;
    } catch (error) {
      throw error;
    }
  };

  editList = async (id: number, photo: Express.Multer.File) => {
    try {
      const list = await this.model.findByPk(id);

      if (!list) {
        throw new NotFoundError("Shared item borrow list not found");
      }

      await list.update({
        return_photo_url:
          process.env.API_HOST + "/api/v1/images/" + photo.filename,
      });
    } catch (error) {
      throw error;
    }
  };

  deleteList = async (id: number) => {
    try {
      const list = await this.model.findByPk(id);

      if (!list) {
        throw new NotFoundError("Shared item borrow list not found");
      }

      await list.destroy();
    } catch (error) {
      throw error;
    }
  };
}
