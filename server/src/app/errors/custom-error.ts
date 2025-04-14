export default class CustomError extends Error {
  public statusCode: number;

  constructor({ message, statusCode }: { message: string, statusCode: number }) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}