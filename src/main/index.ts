import { Authentication } from "./authentication";
import { WebAuth } from "./web-auth/webauth";

const { version: Version } = require('../../package.json');

export {
  WebAuth,
  Authentication,
  Version
};
