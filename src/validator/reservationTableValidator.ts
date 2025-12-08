import z from "zod";

export const postReservationTableSchema = z.object({
  seats: z.coerce.number().min(1, "Seats is required"),
});
