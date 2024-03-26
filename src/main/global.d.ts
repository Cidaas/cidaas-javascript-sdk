import { UserManager, UserManagerSettings } from "oidc-client-ts";
import { Authentication } from "./authentication";

/**
 * all the global variables are declared in this file
 */
declare global {
  interface Window {
    webAuthSettings: UserManagerSettings;
    usermanager: UserManager;
    localeSettings: string;
    authentication: Authentication;
  }
}