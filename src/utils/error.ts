export class NoProgramError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string) {
    super(message);
    this.code = "FST_ERR_VALIDATION";
    this.statusCode = 400;
  }
}
