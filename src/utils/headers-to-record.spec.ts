import { headersToRecord } from './headers-to-record';

describe('http', () => {
  test('should return an empty object when headers is undefined', () => {
    expect(headersToRecord()).toEqual({});
  });

  test('should return an empty object when headers is null', () => {
    expect(headersToRecord(null)).toEqual({});
  });

  test('should convert Headers instance to Record<string, string> with lowercase keys', () => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer token');

    expect(headersToRecord(headers)).toEqual({
      'content-type': 'application/json',
      authorization: 'Bearer token',
    });
  });

  test('should handle empty Headers instance', () => {
    const headers = new Headers();

    expect(headersToRecord(headers)).toEqual({});
  });

  test('should handle Headers instance with duplicate keys', () => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Content-Type', 'text/plain');

    expect(headersToRecord(headers)).toEqual({
      'content-type': 'application/json, text/plain',
    });
  });

  test('should convert array of header tuples to Record<string, string> with lowercase keys', () => {
    const headers: HeadersInit = [
      ['Content-Type', 'application/json'],
      ['Authorization', 'Bearer token'],
    ];

    expect(headersToRecord(headers)).toEqual({
      'content-type': 'application/json',
      authorization: 'Bearer token',
    });
  });

  test('should handle empty array of header tuples', () => {
    const headers: HeadersInit = [];

    expect(headersToRecord(headers)).toEqual({});
  });

  test('should handle array of header tuples with duplicate keys', () => {
    const headers: HeadersInit = [
      ['Content-Type', 'application/json'],
      ['Content-Type', 'text/plain'],
    ];

    expect(headersToRecord(headers)).toEqual({
      'content-type': 'text/plain',
    });
  });

  test('should convert Record<string, string> input to Record<string, string> with lowercase keys', () => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer token',
    };

    expect(headersToRecord(headers)).toEqual({
      'content-type': 'application/json',
      authorization: 'Bearer token',
    });
  });

  test('should handle empty Record<string, string> input', () => {
    const headers: HeadersInit = {};

    expect(headersToRecord(headers)).toEqual({});
  });
});
