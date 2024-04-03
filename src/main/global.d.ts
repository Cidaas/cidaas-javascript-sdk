import { OidcClient, UserManager, UserManagerSettings } from "oidc-client-ts";
import { Authentication } from "./authentication";

/**
 * all the global variables are declared in this file
 */
declare global {
  interface Window {
    webAuthSettings: UserManagerSettings;
    usermanager: UserManager;
    oidcClient: OidcClient;
    localeSettings: string;
    authentication: Authentication;
  }
}