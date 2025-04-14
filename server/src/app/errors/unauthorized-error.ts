import CustomError from "./custom-error";

export default class UnauthorizedError extends CustomError {
  constructor() {
    super({ message: "Unauthorized access.", statusCode: 401 });
  }
}