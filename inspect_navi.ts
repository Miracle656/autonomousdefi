import { WalletClient } from '@naviprotocol/wallet-client';

console.log('WalletClient prototype:', Object.getOwnPropertyNames(WalletClient.prototype));

try {
    const client = new WalletClient();
    console.log('Client keys:', Object.keys(client));
} catch (e) {
    console.log('Constructor error:', e.message);
}
