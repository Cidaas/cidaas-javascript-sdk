export declare class Helper {
    /**
   * create form
   * @param form
   * @param options
   * @returns
   */
    static createForm(url: string, options: any, method?: string): HTMLFormElement;
    /**
    * utility function to create and make post request
    * @param options
    * @param serviceurl
    * @param errorResolver
    * @param access_token??
    * @param headers??
    * @returns
    */
    static createPostPromise(options: any, serviceurl: string, errorResolver: boolean, method: string, access_token?: string, headers?: any): Promise<unknown>;
}
export declare class CustomException {
    errorMessage: string;
    statusCode: number;
    constructor(errorMessage: string, statusCode: number);
}
