/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export function __wbg_record_free(a: number): void;
export function record_from_string(a: number, b: number): number;
export function record_decrypt(a: number, b: number, c: number, d: number): number;
export function record_to_serial_number(a: number, b: number, c: number, d: number): void;
export function record_to_string(a: number, b: number): void;
export function __wbg_viewkey_free(a: number): void;
export function viewkey_from_private_key(a: number, b: number): number;
export function viewkey_from_string(a: number, b: number): number;
export function viewkey_to_string(a: number, b: number): void;
export function viewkey_sign(a: number, b: number, c: number, d: number): void;
export function __wbg_address_free(a: number): void;
export function address_from_private_key(a: number, b: number): number;
export function address_from_view_key(a: number, b: number): number;
export function address_from_string(a: number, b: number): number;
export function address_verify(a: number, b: number, c: number, d: number, e: number): number;
export function address_to_string(a: number, b: number): void;
export function __wbg_account_free(a: number): void;
export function account_new(): number;
export function account_from_private_key(a: number, b: number): number;
export function account_to_string(a: number, b: number): void;
export function account_to_signature_public_key(a: number, b: number): void;
export function account_sign(a: number, b: number, c: number, d: number): void;
export function account_verify(a: number, b: number, c: number, d: number, e: number, f: number): number;
export function __wbindgen_malloc(a: number): number;
export function __wbindgen_realloc(a: number, b: number, c: number): number;
export function __wbindgen_free(a: number, b: number): void;
export function __wbindgen_exn_store(a: number): void;
