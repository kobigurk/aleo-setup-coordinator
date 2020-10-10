
const wasm_module = import('../snarkos-toolkit/snarkos_toolkit');
wasm_module.then(toolkit => {
	const account = new toolkit.Account;
	const key_address = account.to_string();
	const private_key = key_address.substring(key_address.indexOf("private_key") + 13, key_address.indexOf("address") - 2);
	const aleo_address = key_address.substring(key_address.indexOf("address") + 9, key_address.length - 2);
	console.log(`private key: ${private_key}, address: ${aleo_address}`);
        let view_key = toolkit.ViewKey.from_private_key(private_key);
        let signature = view_key.sign('test');
	console.log(`signature: ${signature}`);
})
.catch(console.error);
