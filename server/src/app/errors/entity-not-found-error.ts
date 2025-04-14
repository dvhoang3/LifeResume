import mongoose from "mongoose";
import CustomError from "./custom-error";

export default class EntityNotFoundError extends CustomError {
  constructor(Model: mongoose.Model<any>, criteria?: Record<string, any>) {
    let message = `${Model.modelName} could not be found.`;
    if (criteria && Object.keys(criteria).length > 0) {
      const criteriaString = Object.entries(criteria)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      message = `${Model.modelName} could not be found for ${criteriaString}.`;
    }

    super({ message: message, statusCode: 404 });
  }
}