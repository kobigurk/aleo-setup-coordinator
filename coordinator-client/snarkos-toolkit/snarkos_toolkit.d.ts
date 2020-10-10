/* tslint:disable */
/* eslint-disable */
/**
*/
export class Account {
  free(): void;
/**
*/
  constructor();
/**
* @param {string} private_key
* @returns {Account}
*/
  static from_private_key(private_key: string): Account;
/**
* @returns {string}
*/
  to_string(): string;
/**
* @returns {string}
*/
  to_signature_public_key(): string;
/**
* Sign a message with the private key `sk_sig`
* @param {string} message
* @returns {string}
*/
  sign(message: string): string;
/**
* Verify a signature signed by the private key
* Returns `true` if the signature is verified correctly. Otherwise, returns `false`.
* @param {string} public_key
* @param {string} message
* @param {string} signature
* @returns {boolean}
*/
  static verify(public_key: string, message: string, signature: string): boolean;
}
/**
*/
export class Address {
  free(): void;
/**
* @param {string} private_key
* @returns {Address}
*/
  static from_private_key(private_key: string): Address;
/**
* @param {string} view_key
* @returns {Address}
*/
  static from_view_key(view_key: string): Address;
/**
* @param {string} address
* @returns {Address}
*/
  static from_string(address: string): Address;
/**
* Verify a signature signed by the view key
* Returns `true` if the signature is verified correctly. Otherwise, returns `false`.
* @param {string} message
* @param {string} signature
* @returns {boolean}
*/
  verify(message: string, signature: string): boolean;
/**
* @returns {string}
*/
  to_string(): string;
}
/**
*/
export class Record {
  free(): void;
/**
* @param {string} record
* @returns {Record}
*/
  static from_string(record: string): Record;
/**
* @param {string} encrypted_record
* @param {string} view_key
* @returns {Record}
*/
  static decrypt(encrypted_record: string, view_key: string): Record;
/**
* @param {string} private_key
* @returns {string}
*/
  to_serial_number(private_key: string): string;
/**
* @returns {string}
*/
  to_string(): string;
}
/**
*/
export class ViewKey {
  free(): void;
/**
* @param {string} private_key
* @returns {ViewKey}
*/
  static from_private_key(private_key: string): ViewKey;
/**
* @param {string} view_key
* @returns {ViewKey}
*/
  static from_string(view_key: string): ViewKey;
/**
* @returns {string}
*/
  to_string(): string;
/**
* Sign a message with the view key
* @param {string} message
* @returns {string}
*/
  sign(message: string): string;
}
