import { SealClient } from '@mysten/seal';
import { SEAL_SERVER_OBJECT_IDS, SEAL_THRESHOLD } from '../constants/seal';
import { PACKAGE_ID } from '../constants/contracts';
import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';

export interface EncryptedSettings {
    encryptedData: Uint8Array;
    keyId: Uint8Array; // Seal SDK returns Uint8Array, not string
}

export async function encryptSettings(
    settingsData: any,
    suiClient: SuiClient
): Promise<EncryptedSettings> {

    try {
        // Initialize Seal client with server object IDs
        const client = new SealClient({
            suiClient,
            serverConfigs: SEAL_SERVER_OBJECT_IDS.map((id) => ({
                objectId: id,
                weight: 1,
            })),
            verifyKeyServers: false, // Skip verification for better performance
        });

        // Convert settings to bytes
        const data = new TextEncoder().encode(JSON.stringify(settingsData));

        // Encrypt with Seal
        // packageId and id should be hex strings without 0x prefix
        const { encryptedObject, key } = await client.encrypt({
            threshold: SEAL_THRESHOLD,
            packageId: PACKAGE_ID.replace('0x', ''),
            id: '0', // Policy object ID (without 0x prefix)
            data,
        });

        return {
            encryptedData: encryptedObject,
            keyId: key, // key is already Uint8Array
        };
    } catch (error: any) {
        console.error('Seal encryption error:', error);
        throw new Error(`Seal encryption failed: ${error.message || error}`);
    }
}

export async function decryptSettings(
    encryptedData: Uint8Array,
    sessionKey: Uint8Array, // Changed to Uint8Array to match Seal SDK
    suiClient: SuiClient
): Promise<any> {

    try {
        const client = new SealClient({
            suiClient,
            serverConfigs: SEAL_SERVER_OBJECT_IDS.map((id) => ({
                objectId: id,
                weight: 1,
            })),
            verifyKeyServers: false,
        });

        // Create transaction for access policy check
        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::access_policy::seal_approve`,
            arguments: [
                tx.pure.vector("u8", [0]), // Policy ID as bytes
            ],
        });

        const txBytes = await tx.build({ client: suiClient, onlyTransactionKind: true });

        // Decrypt with Seal
        const decryptedBytes = await client.decrypt({
            data: encryptedData,
            sessionKey: sessionKey as any, // Cast to satisfy SessionKey type
            txBytes,
        });

        return JSON.parse(new TextDecoder().decode(decryptedBytes));
    } catch (error: any) {
        console.error('Seal decryption error:', error);
        throw new Error(`Decryption failed: ${error.message || error}`);
    }
}

// Helper function to store encrypted settings on-chain
export async function storeEncryptedSettingsOnChain(
    encryptedData: Uint8Array,
    keyId: Uint8Array, // Changed to Uint8Array
    signAndExecute: any
): Promise<void> {
    const tx = new Transaction();

    tx.moveCall({
        target: `${PACKAGE_ID}::user_settings::store_encrypted_settings`,
        arguments: [
            tx.pure.vector("u8", Array.from(encryptedData)),
            tx.pure.vector("u8", Array.from(keyId)), // Already Uint8Array
        ],
    });

    return new Promise((resolve, reject) => {
        signAndExecute(
            { transaction: tx },
            {
                onSuccess: () => resolve(),
                onError: (error: any) => reject(error),
            }
        );
    });
}
