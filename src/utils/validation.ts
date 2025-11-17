import * as z from "zod";
import InvariantError from "../exceptions/InvariantError";

export const validate = (
  input: Object,
  validator: z.ZodObject | z.ZodArray
) => {
  const result = validator.safeParse(input);
  if (!result.success) {
    throw new InvariantError("Validation failed", result.error);
  }
  return result.data;
};
