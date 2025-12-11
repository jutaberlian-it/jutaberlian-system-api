import z from "zod";

export const UpdateReservationSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "SEATED",
    "COMPLETED",
    "CANCELLED",
    "NO_SHOW",
  ]),
});
