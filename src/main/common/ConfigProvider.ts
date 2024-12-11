import { OidcSettings } from "../authentication/Authentication.model";


class ConfigProvider {
    private config: OidcSettings;

    constructor(config: OidcSettings) {
        if (!config.response_type) {
            config.response_type = "code";
        }
        if (!config.scope) {
            config.scope = "email openid profile mobile";
        }
        if (config.authority && config.authority.charAt(config.authority.length - 1) === '/' ) {
            config.authority = config.authority.slice(0, config.authority.length - 1);
        }
        this.config = config;
    }

    public setConfig(config: OidcSettings) {
        this.config = { ...this.config, ...config };
    }

    public getConfig(): OidcSettings {
        return this.config;
    }
}

export default ConfigProvider;