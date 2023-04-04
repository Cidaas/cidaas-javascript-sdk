export class CustomException {
    message: string;
    status: number;
    constructor(errorMessage: string, statusCode: number) {
        this.message = errorMessage;
        this.status = statusCode;
    }
}
