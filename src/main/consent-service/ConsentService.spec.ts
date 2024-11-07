import { expect } from '@jest/globals';
import * as ConsentService from './ConsentService';
import { Helper } from '../common/Helper';
import { AcceptClaimConsentRequest, AcceptConsentRequest, AcceptScopeConsentRequest, GetConsentVersionDetailsRequest, RevokeClaimConsentRequest } from './ConsentService.model';

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
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  ConsentService.getConsentDetails(option, headers);
  expect(httpSpy).toHaveBeenCalledWith(option, serviceURL, false, 'POST', undefined, headers);
});

test('acceptConsent', () => {
  const option: AcceptConsentRequest = {
    client_id: 'client_id',
    consent_id: 'consent_id',
    consent_version_id: 'consent_id',
    sub: 'sub',
    scopes: ['scopes'],
    url: 'url',
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
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  ConsentService.acceptConsent(option, headers);
  expect(httpSpy).toHaveBeenCalledWith(option, serviceURL, false, 'POST', undefined, headers);
});

test('getConsentVersionDetails', () => {
  const option: GetConsentVersionDetailsRequest = {
    consentid: 'consentid',
    locale: 'locale'
  };
  const serviceURL = `${serviceBaseUrl}/versions/details/${option.consentid}?locale=${option.locale}`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  ConsentService.getConsentVersionDetails(option, headers);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, false, 'GET', option.access_token, headers);
});

test('acceptScopeConsent', () => {
  const option: AcceptScopeConsentRequest = {
    client_id: 'client_id',
    sub: 'sub',
    scopes: ['scopes']
  };
  const serviceURL = `${serviceBaseUrlV1}/scope/accept`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  ConsentService.acceptScopeConsent(option, headers);
  expect(httpSpy).toHaveBeenCalledWith(option, serviceURL, false, 'POST', undefined, headers);
});

test('acceptClaimConsent', () => {
  const option: AcceptClaimConsentRequest = {
    client_id: 'client_id',
    sub: 'sub',
    accepted_claims: ['accepted_claims']
  };
  const serviceURL = `${serviceBaseUrlV1}/claim/accept`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  ConsentService.acceptClaimConsent(option, headers);
  expect(httpSpy).toHaveBeenCalledWith(option, serviceURL, false, 'POST', undefined, headers);
});

test('revokeClaimConsent', () => {
  const option: RevokeClaimConsentRequest = {
    access_token: 'access_token',
    client_id: 'client_id',
    sub: 'sub',
    revoked_claims: ['revoked_claims']
  };
  const serviceURL = `${serviceBaseUrlV1}/claim/revoke`;
  ConsentService.revokeClaimConsent(option);
  expect(httpSpy).toHaveBeenCalledWith(option, serviceURL, false, 'POST', option.access_token);
});