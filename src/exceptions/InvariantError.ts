import ClientError from "./ClientError";
import * as z from "zod";

export default class InvariantError extends ClientError {
  public data;

  constructor(message: string, zError: z.ZodError) {
    super(message);
    this.name = "InvariantError";
    this.data = z.flattenError(zError).fieldErrors;
  }
}
