function CustomException(errorMessage, statusCode) {
    this.message = errorMessage;
    this.status = statusCode;
}


module.exports = CustomException;