import { SuiClient } from '@mysten/sui/client';
import {
    IkaClient as RealIkaClient,
    IkaTransaction,
    getNetworkConfig,
    Curve,
    UserShareEncryptionKeys
} from '@ika.xyz/sdk';

// Interfaces
export interface IkaWalletStatus {
    online: boolean;
    btcAddress: string;
    ethAddress: string;
    btcBalance: number;
    ethBalance: number;
    lastActivity: string;
    dWalletId?: string;
}

export interface IkaTransactionResult {
    txId: string;
    status: 'success' | 'failed';
    signature: string;
    timestamp: string;
}

// Mock state (module-level to persist across re-renders)
let mockState = {
    btcBalance: 0.5,
    ethBalance: 1.25,
    lastActivity: '14:25:00'
};

// Ika Client wrapper
export class IkaClient {
    private _suiClient: SuiClient;
    private _realClient?: RealIkaClient;
    private _initialized: boolean = false;

    constructor(suiClient: SuiClient) {
        this._suiClient = suiClient;
    }

    /**
     * Initialize the Ika client (must be called before use)
     */
    async initialize(network: 'testnet' | 'mainnet' = 'testnet'): Promise<void> {
        if (this._initialized) return;

        try {
            this._realClient = new RealIkaClient({
                suiClient: this._suiClient,
                config: getNetworkConfig(network),
            });

            await this._realClient.initialize();
            this._initialized = true;
            console.log('[Ika] Client initialized successfully');
        } catch (error) {
            console.error('[Ika] Failed to initialize client:', error);
            throw error;
        }
    }

    /**
     * Get the real Ika client (for advanced usage)
     */
    getRealClient(): RealIkaClient | undefined {
        return this._realClient;
    }

    /**
     * Set the dWallet to use for signing
     */
    setDWallet(dWalletId: string) {
        console.log('[Ika] dWallet set:', dWalletId);
        localStorage.setItem('userDWalletId', dWalletId);
    }

    async getWalletStatus(): Promise<IkaWalletStatus> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            online: this._initialized,
            btcAddress: 'tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
            ethAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
            btcBalance: mockState.btcBalance,
            ethBalance: mockState.ethBalance,
            lastActivity: mockState.lastActivity,
            dWalletId: localStorage.getItem('userDWalletId') || undefined,
        };
    }

    async signBitcoinTransaction(amount: number, recipient: string): Promise<IkaTransactionResult> {
        console.log(`[Ika] Signing BTC transaction: Send ${amount} BTC to ${recipient}`);

        // Simulate MPC signing delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Update mock state
        mockState.btcBalance = Number((mockState.btcBalance - amount).toFixed(8));
        mockState.lastActivity = new Date().toLocaleTimeString();

        return {
            txId: '7f3a2b1c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2',
            status: 'success',
            signature: '30440220...mock_btc_signature...',
            timestamp: new Date().toISOString(),
        };
    }

    async signEthereumTransaction(amount: number, recipient: string): Promise<IkaTransactionResult> {
        console.log(`[Ika] Signing ETH transaction: Send ${amount} ETH to ${recipient}`);

        // Simulate MPC signing delay
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Update mock state
        mockState.ethBalance = Number((mockState.ethBalance - amount).toFixed(4));
        mockState.lastActivity = new Date().toLocaleTimeString();

        return {
            txId: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
            status: 'success',
            signature: '0x...mock_eth_signature...',
            timestamp: new Date().toISOString(),
        };
    }
}

// Export types for use in components
export { Curve, IkaTransaction, UserShareEncryptionKeys };
