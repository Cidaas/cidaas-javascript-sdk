import { OidcClient } from "oidc-client-ts";

declare global {
  interface Window {
    /**
     * OpenId client
     */
    oidcClient: OidcClient;

    /**
     * Locale configured during init
     */
    localeSettings: string;
  }
}

