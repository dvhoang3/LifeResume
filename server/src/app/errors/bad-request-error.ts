import CustomError from "./custom-error";

export default class BadRequestError extends CustomError {
  constructor(message: string = "Bad Request.") {
    super({ message: message, statusCode: 400 });
  }
}