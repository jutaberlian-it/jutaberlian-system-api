import z from "zod";

export const postBorrrowListSchema = z.object({
  name: z.string().min(1, "Name is required"),
  borrow_start_date: z.coerce
    .date()
    .min(new Date(), "Start date must be in the future"),
  borrow_end_date: z.coerce
    .date()
    .min(new Date(), "End date must be in the future"),
  shared_item_id: z.number().min(1, "Shared item ID is required"),
});
