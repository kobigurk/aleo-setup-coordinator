let imports = {};
imports['__wbindgen_placeholder__'] = module.exports;
let wasm;
const { TextDecoder } = require(String.raw`util`);

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

let cachegetNodeBufferMemory0 = null;
function getNodeBufferMemory0() {
    if (cachegetNodeBufferMemory0 === null || cachegetNodeBufferMemory0.buffer !== wasm.memory.buffer) {
        cachegetNodeBufferMemory0 = Buffer.from(wasm.memory.buffer);
    }
    return cachegetNodeBufferMemory0;
}

function passStringToWasm0(arg, malloc) {

    const len = Buffer.byteLength(arg);
    const ptr = malloc(len);
    getNodeBufferMemory0().write(arg, ptr, len);
    WASM_VECTOR_LEN = len;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function handleError(f) {
    return function () {
        try {
            return f.apply(this, arguments);

        } catch (e) {
            wasm.__wbindgen_exn_store(addHeapObject(e));
        }
    };
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
*/
class Account {

    static __wrap(ptr) {
        const obj = Object.create(Account.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_account_free(ptr);
    }
    /**
    */
    constructor() {
        var ret = wasm.account_new();
        return Account.__wrap(ret);
    }
    /**
    * @param {string} private_key
    * @returns {Account}
    */
    static from_private_key(private_key) {
        var ptr0 = passStringToWasm0(private_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.account_from_private_key(ptr0, len0);
        return Account.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    to_string() {
        try {
            const retptr = wasm.__wbindgen_export_2.value - 16;
            wasm.__wbindgen_export_2.value = retptr;
            wasm.account_to_string(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_2.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    to_signature_public_key() {
        try {
            const retptr = wasm.__wbindgen_export_2.value - 16;
            wasm.__wbindgen_export_2.value = retptr;
            wasm.account_to_signature_public_key(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_2.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Sign a message with the private key `sk_sig`
    * @param {string} message
    * @returns {string}
    */
    sign(message) {
        try {
            const retptr = wasm.__wbindgen_export_2.value - 16;
            wasm.__wbindgen_export_2.value = retptr;
            var ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.account_sign(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_2.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Verify a signature signed by the private key
    * Returns `true` if the signature is verified correctly. Otherwise, returns `false`.
    * @param {string} public_key
    * @param {string} message
    * @param {string} signature
    * @returns {boolean}
    */
    static verify(public_key, message, signature) {
        var ptr0 = passStringToWasm0(public_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = passStringToWasm0(signature, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        var ret = wasm.account_verify(ptr0, len0, ptr1, len1, ptr2, len2);
        return ret !== 0;
    }
}
module.exports.Account = Account;
/**
*/
class Address {

    static __wrap(ptr) {
        const obj = Object.create(Address.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_address_free(ptr);
    }
    /**
    * @param {string} private_key
    * @returns {Address}
    */
    static from_private_key(private_key) {
        var ptr0 = passStringToWasm0(private_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.address_from_private_key(ptr0, len0);
        return Address.__wrap(ret);
    }
    /**
    * @param {string} view_key
    * @returns {Address}
    */
    static from_view_key(view_key) {
        var ptr0 = passStringToWasm0(view_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.address_from_view_key(ptr0, len0);
        return Address.__wrap(ret);
    }
    /**
    * @param {string} address
    * @returns {Address}
    */
    static from_string(address) {
        var ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.address_from_string(ptr0, len0);
        return Address.__wrap(ret);
    }
    /**
    * Verify a signature signed by the view key
    * Returns `true` if the signature is verified correctly. Otherwise, returns `false`.
    * @param {string} message
    * @param {string} signature
    * @returns {boolean}
    */
    verify(message, signature) {
        var ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passStringToWasm0(signature, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.address_verify(this.ptr, ptr0, len0, ptr1, len1);
        return ret !== 0;
    }
    /**
    * @returns {string}
    */
    to_string() {
        try {
            const retptr = wasm.__wbindgen_export_2.value - 16;
            wasm.__wbindgen_export_2.value = retptr;
            wasm.address_to_string(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_2.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
module.exports.Address = Address;
/**
*/
class Record {

    static __wrap(ptr) {
        const obj = Object.create(Record.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_record_free(ptr);
    }
    /**
    * @param {string} record
    * @returns {Record}
    */
    static from_string(record) {
        var ptr0 = passStringToWasm0(record, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.record_from_string(ptr0, len0);
        return Record.__wrap(ret);
    }
    /**
    * @param {string} encrypted_record
    * @param {string} view_key
    * @returns {Record}
    */
    static decrypt(encrypted_record, view_key) {
        var ptr0 = passStringToWasm0(encrypted_record, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passStringToWasm0(view_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.record_decrypt(ptr0, len0, ptr1, len1);
        return Record.__wrap(ret);
    }
    /**
    * @param {string} private_key
    * @returns {string}
    */
    to_serial_number(private_key) {
        try {
            const retptr = wasm.__wbindgen_export_2.value - 16;
            wasm.__wbindgen_export_2.value = retptr;
            var ptr0 = passStringToWasm0(private_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.record_to_serial_number(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_2.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    to_string() {
        try {
            const retptr = wasm.__wbindgen_export_2.value - 16;
            wasm.__wbindgen_export_2.value = retptr;
            wasm.record_to_string(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_2.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
module.exports.Record = Record;
/**
*/
class ViewKey {

    static __wrap(ptr) {
        const obj = Object.create(ViewKey.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_viewkey_free(ptr);
    }
    /**
    * @param {string} private_key
    * @returns {ViewKey}
    */
    static from_private_key(private_key) {
        var ptr0 = passStringToWasm0(private_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.viewkey_from_private_key(ptr0, len0);
        return ViewKey.__wrap(ret);
    }
    /**
    * @param {string} view_key
    * @returns {ViewKey}
    */
    static from_string(view_key) {
        var ptr0 = passStringToWasm0(view_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.viewkey_from_string(ptr0, len0);
        return ViewKey.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    to_string() {
        try {
            const retptr = wasm.__wbindgen_export_2.value - 16;
            wasm.__wbindgen_export_2.value = retptr;
            wasm.viewkey_to_string(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_2.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Sign a message with the view key
    * @param {string} message
    * @returns {string}
    */
    sign(message) {
        try {
            const retptr = wasm.__wbindgen_export_2.value - 16;
            wasm.__wbindgen_export_2.value = retptr;
            var ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.viewkey_sign(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_2.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
module.exports.ViewKey = ViewKey;

module.exports.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

module.exports.__wbg_getRandomValues_f5e14ab7ac8e995d = function(arg0, arg1, arg2) {
    getObject(arg0).getRandomValues(getArrayU8FromWasm0(arg1, arg2));
};

module.exports.__wbg_randomFillSync_d5bd2d655fdf256a = function(arg0, arg1, arg2) {
    getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
};

module.exports.__wbg_self_1b7a39e3a92c949c = handleError(function() {
    var ret = self.self;
    return addHeapObject(ret);
});

module.exports.__wbg_require_604837428532a733 = function(arg0, arg1) {
    var ret = require(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbg_crypto_968f1772287e2df0 = function(arg0) {
    var ret = getObject(arg0).crypto;
    return addHeapObject(ret);
};

module.exports.__wbindgen_is_undefined = function(arg0) {
    var ret = getObject(arg0) === undefined;
    return ret;
};

module.exports.__wbg_getRandomValues_a3d34b4fee3c2869 = function(arg0) {
    var ret = getObject(arg0).getRandomValues;
    return addHeapObject(ret);
};

module.exports.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

const path = require('path').join(__dirname, 'snarkos_toolkit_bg.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;

