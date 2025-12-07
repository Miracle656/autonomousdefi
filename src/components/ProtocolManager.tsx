import { useState } from 'react';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID, VAULT_OBJECT_ID } from '../constants/contracts';

export function ProtocolManager() {
    const { mutate: signAndExecute } = useSignAndExecuteTransaction();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handleNaviDeposit = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setStatus('Please enter a valid amount');
            return;
        }

        setLoading(true);
        setStatus('Depositing to Navi...');

        try {
            const tx = new Transaction();
            const amountInMist = Math.floor(parseFloat(amount) * 1e9);

            tx.moveCall({
                target: `${PACKAGE_ID}::vault::deposit_to_navi`,
                arguments: [
                    tx.object(VAULT_OBJECT_ID),
                    tx.pure.u64(amountInMist),
                ],
            });

            signAndExecute(
                { transaction: tx },
                {
                    onSuccess: (result) => {
                        console.log('Navi deposit successful:', result);
                        setStatus(`✅ Deposited ${amount} SUI to Navi!`);
                        setAmount('');
                    },
                    onError: (error) => {
                        console.error('Navi deposit failed:', error);
                        setStatus(`❌ Error: ${error.message}`);
                    },
                }
            );
        } catch (error: any) {
            setStatus(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleNaviWithdraw = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setStatus('Please enter a valid amount');
            return;
        }

        setLoading(true);
        setStatus('Withdrawing from Navi...');

        try {
            const tx = new Transaction();
            const amountInMist = Math.floor(parseFloat(amount) * 1e9);

            tx.moveCall({
                target: `${PACKAGE_ID}::vault::withdraw_from_navi`,
                arguments: [
                    tx.object(VAULT_OBJECT_ID),
                    tx.pure.u64(amountInMist),
                ],
            });

            signAndExecute(
                { transaction: tx },
                {
                    onSuccess: (result) => {
                        console.log('Navi withdrawal successful:', result);
                        setStatus(`✅ Withdrew ${amount} SUI from Navi!`);
                        setAmount('');
                    },
                    onError: (error) => {
                        console.error('Navi withdrawal failed:', error);
                        setStatus(`❌ Error: ${error.message}`);
                    },
                }
            );
        } catch (error: any) {
            setStatus(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCetusDeposit = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setStatus('Please enter a valid amount');
            return;
        }

        setLoading(true);
        setStatus('Adding liquidity to Cetus...');

        try {
            const tx = new Transaction();
            const amountInMist = Math.floor(parseFloat(amount) * 1e9);

            tx.moveCall({
                target: `${PACKAGE_ID}::vault::add_cetus_liquidity`,
                arguments: [
                    tx.object(VAULT_OBJECT_ID),
                    tx.pure.u64(amountInMist),
                ],
            });

            signAndExecute(
                { transaction: tx },
                {
                    onSuccess: (result) => {
                        console.log('Cetus LP successful:', result);
                        setStatus(`✅ Added ${amount} SUI to Cetus LP!`);
                        setAmount('');
                    },
                    onError: (error) => {
                        console.error('Cetus LP failed:', error);
                        setStatus(`❌ Error: ${error.message}`);
                    },
                }
            );
        } catch (error: any) {
            setStatus(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCetusWithdraw = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setStatus('Please enter a valid amount');
            return;
        }

        setLoading(true);
        setStatus('Removing liquidity from Cetus...');

        try {
            const tx = new Transaction();
            const amountInMist = Math.floor(parseFloat(amount) * 1e9);

            tx.moveCall({
                target: `${PACKAGE_ID}::vault::remove_cetus_liquidity`,
                arguments: [
                    tx.object(VAULT_OBJECT_ID),
                    tx.pure.u64(amountInMist),
                ],
            });

            signAndExecute(
                { transaction: tx },
                {
                    onSuccess: (result) => {
                        console.log('Cetus withdrawal successful:', result);
                        setStatus(`✅ Removed ${amount} SUI from Cetus LP!`);
                        setAmount('');
                    },
                    onError: (error) => {
                        console.error('Cetus withdrawal failed:', error);
                        setStatus(`❌ Error: ${error.message}`);
                    },
                }
            );
        } catch (error: any) {
            setStatus(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-bold mb-6 font-doto">Protocol Manager</h2>

            {/* Amount Input */}
            <div className="mb-6">
                <label className="block text-sm font-bold mb-2">Amount (SUI)</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-4 py-3 border-4 border-black font-mono text-lg focus:outline-none focus:ring-4 focus:ring-blue-500"
                    disabled={loading}
                />
            </div>

            {/* Navi Protocol */}
            <div className="mb-6 p-4 border-4 border-black bg-blue-50">
                <h3 className="text-xl font-bold mb-3 text-blue-600">NAVI Protocol</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={handleNaviDeposit}
                        disabled={loading}
                        className="px-4 py-3 bg-blue-500 text-white font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Deposit to Navi
                    </button>
                    <button
                        onClick={handleNaviWithdraw}
                        disabled={loading}
                        className="px-4 py-3 bg-white text-blue-600 font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Withdraw from Navi
                    </button>
                </div>
            </div>

            {/* Cetus DEX */}
            <div className="mb-6 p-4 border-4 border-black bg-green-50">
                <h3 className="text-xl font-bold mb-3 text-green-600">Cetus DEX</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={handleCetusDeposit}
                        disabled={loading}
                        className="px-4 py-3 bg-green-500 text-white font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Add Liquidity
                    </button>
                    <button
                        onClick={handleCetusWithdraw}
                        disabled={loading}
                        className="px-4 py-3 bg-white text-green-600 font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Remove Liquidity
                    </button>
                </div>
            </div>

            {/* Status Message */}
            {status && (
                <div className={`p-4 border-4 border-black font-mono text-sm ${status.includes('✅') ? 'bg-green-100' :
                        status.includes('❌') ? 'bg-red-100' :
                            'bg-yellow-100'
                    }`}>
                    {status}
                </div>
            )}
        </div>
    );
}
