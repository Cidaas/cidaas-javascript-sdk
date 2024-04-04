import { expect } from '@jest/globals';
import * as ConsentService from '../../src/main/web-auth/ConsentService';
import { Helper } from '../../src/main/web-auth/Helper';
import { IConsentAcceptEntity } from '../../src/main/web-auth/Entities';

const authority = 'baseURL';
const serviceBaseUrl: string = `${authority}/consent-management-srv/v2/consent`;
const serviceBaseUrlV1: string = `${authority}/consent-management-srv/consent`;
const httpSpy = jest.spyOn(Helper, 'createHttpPromise');

beforeAll(() => {
  window.webAuthSettings = { authority: authority, client_id: '', redirect_uri: '' };
});

test('getConsentDetails', () => {
  const option = {
    consent_id: 'consent_id',
    consent_version_id: 'consent_version_id',
    sub: 'sub'
  };
  const serviceURL = `${serviceBaseUrl}/usage/public/info`;
  void ConsentService.getConsentDetails(option);
  expect(httpSpy).toHaveBeenCalledWith(option, serviceURL, false, 'POST');
});

test('acceptConsent', () => {
  const option: IConsentAcceptEntity = {
    client_id: 'client_id',
    consent_id: 'consent_id',
    consent_version_id: 'consent_id',
    sub: 'sub',
    scopes: ['scopes'],
    url: 'url',
    matcher: null,
    field_key: 'field_key',
    accepted_fields: ['accepted_fields'],
    accepted_by: 'accepted_by',
    skipped: true,
    action_type: 'action_type',
    action_id: 'action_id',
    q: 'q',
    revoked: false
  };
  const serviceURL = `${serviceBaseUrl}/usage/accept`;
  void ConsentService.acceptConsent(option);
  expect(httpSpy).toHaveBeenCalledWith(option, serviceURL, false, 'POST');
});

test('getConsentVersionDetails', () => {
  const option = {
    consentid: 'consentid',
    locale: 'locale',
    access_token: 'access_token'
  };
  const serviceURL = `${serviceBaseUrl}/versions/details/${option.consentid}?locale=${option.locale}`;
  void ConsentService.getConsentVersionDetails(option);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET', option.access_token);
});

test('acceptScopeConsent', () => {
  const option = {
    client_id: 'client_id',
    sub: 'sub',
    scopes: ['scopes']
  };
  const serviceURL = `${serviceBaseUrlV1}/scope/accept`;
  void ConsentService.acceptScopeConsent(option);
  expect(httpSpy).toHaveBeenCalledWith(option, serviceURL, false, 'POST');
});

test('acceptClaimConsent', () => {
  const option = {
    client_id: 'client_id',
    sub: 'sub',
    accepted_claims: ['accepted_claims']
  };
  const serviceURL = `${serviceBaseUrlV1}/claim/accept`;
  void ConsentService.acceptClaimConsent(option);
  expect(httpSpy).toHaveBeenCalledWith(option, serviceURL, false, 'POST');
});

test('revokeClaimConsent', () => {
  const option = {
    access_token: 'access_token',
    client_id: 'client_id',
    sub: 'sub',
    revoked_claims: ['revoked_claims']
  };
  const serviceURL = `${serviceBaseUrlV1}/claim/revoke`;
  void ConsentService.revokeClaimConsent(option);
  expect(httpSpy).toHaveBeenCalledWith(option, serviceURL, false, 'POST', option.access_token);
});