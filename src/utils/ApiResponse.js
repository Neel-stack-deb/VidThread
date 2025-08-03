export class ApiResponse {
  comstructor(statusCode, success = true, message, data = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = success;
    if(data){
      this.data = data;
    } 
  }

  send(res){
    const response = {
      message: this.message,
      success: this.success
    }

    if(this.data){
      response.data = this.data;
    }

    return res.status(this.statusCode).json(response);
  }
}