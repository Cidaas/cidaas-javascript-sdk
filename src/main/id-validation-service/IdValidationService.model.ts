export interface InvokeIdValidationCaseRequest{
    /** URL to the destination where the user will be redirected to after finishing the cidaas ID Validation process */
    redirect_url: string,
    /** UUID of the cidaas ID Validator setting that shall be used for this case. The value can be fetch from Cidaas Admin UI */
    validation_settings_id: string,
    /** String that can be used to identify a finished case */
    external_reference?: string
}