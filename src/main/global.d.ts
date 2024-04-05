/**
 * all the global variables are declared in this file
 */
import { Authentication, OidcManager, OidcSettings } from './authentication';

declare global {
  interface Window {
    /**
     * Configuration used to initialize the OAuthClient
     * */
    webAuthSettings: OidcSettings;

    /***
     * OpenId Client manager
     */
    usermanager: OidcManager;

    /**
     * Locale configured during init
     * **/
    localeSettings: string;

    /**
     * Authentication module abstracting the OIDC authentication related functionalities
     * **/
    authentication: Authentication;
  }
}

