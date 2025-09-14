import { ApiResponse } from "../utils/ApiResponse.js";

export const errorMiddleware = (err, _, res, _) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log the error for debugging purposes
  console.error("Error:", err);

  // Create an ApiResponse instance and send the response
  const apiResponse = new ApiResponse(statusCode, message);
  return apiResponse.send(res);

}