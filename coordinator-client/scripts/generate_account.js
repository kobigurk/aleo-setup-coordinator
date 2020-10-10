var wasm_module = Promise.resolve().then(function () { return require('../snarkos-toolkit/snarkos_toolkit'); });
wasm_module.then(function (toolkit) {
    var account = new toolkit.Account;
    var key_address = account.to_string();
    var private_key = key_address.substring(key_address.indexOf("private_key") + 13, key_address.indexOf("address") - 2);
    var aleo_address = key_address.substring(key_address.indexOf("address") + 9, key_address.length - 2);
    console.log("private key: " + private_key + ", address: " + aleo_address);
    var view_key = toolkit.ViewKey.from_private_key(private_key);
    var signature = view_key.sign('test');
    console.log("signature: " + signature);
})["catch"](console.error);
