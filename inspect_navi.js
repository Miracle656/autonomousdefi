import * as navi from '@naviprotocol/wallet-client';
console.log('Exports:', Object.keys(navi));
if (navi.NAVIClient) {
    console.log('NAVIClient prototype:', Object.getOwnPropertyNames(navi.NAVIClient.prototype));
}
if (navi.NaviClient) {
    console.log('NaviClient prototype:', Object.getOwnPropertyNames(navi.NaviClient.prototype));
}
