export class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode >= 200 && statusCode < 300;
    if(data !== undefined){
      this.data = data;
    } 
  }

  send(res){
    const response = {
      message: this.message,
      success: this.success
    }

    if(this.data !== undefined){
      response.data = this.data;
    }

    return res.status(this.statusCode).json(response);
  }
}