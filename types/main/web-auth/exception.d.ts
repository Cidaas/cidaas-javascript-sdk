export = CustomException;
declare function CustomException(errorMessage: any, statusCode: any): void;
declare class CustomException {
    constructor(errorMessage: any, statusCode: any);
    message: any;
    status: any;
}
