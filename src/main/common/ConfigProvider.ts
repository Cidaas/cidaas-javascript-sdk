import { OidcSettings } from "../authentication/Authentication.model";


class ConfigProvider {
    private static config: OidcSettings;

    public static setConfig(config: OidcSettings) {
        this.config = { ...this.config, ...config };
        window.webAuthSettings = this.config;
    }

    public static getConfig(): OidcSettings {
        return this.config;
    }
}

export default ConfigProvider;