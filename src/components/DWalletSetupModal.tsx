import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import toast from 'react-hot-toast';

interface DWalletSetupModalProps {
    onClose: () => void;
    onDWalletCreated: (dWalletId: string) => void;
}

export default function DWalletSetupModal({ onClose, onDWalletCreated }: DWalletSetupModalProps) {
    const account = useCurrentAccount();
    const [dWalletId, setDWalletId] = useState('');

    const handleSave = () => {
        if (!dWalletId.trim()) {
            toast.error('Please enter a dWallet ID');
            return;
        }

        if (!dWalletId.startsWith('0x')) {
            toast.error('dWallet ID must start with 0x');
            return;
        }

        // Save to localStorage
        localStorage.setItem('userDWalletId', dWalletId);
        localStorage.setItem('dWalletCreatedAt', new Date().toISOString());

        toast.success('dWallet configured!');
        onDWalletCreated(dWalletId);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white neo-border neo-shadow max-w-2xl w-full p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black uppercase">Setup Cross-Chain Wallet</h2>
                    <button
                        onClick={onClose}
                        className="text-2xl font-black hover:text-[#FF006B] transition-colors"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <div className="p-4 bg-[#FFD600] neo-border-sm">
                        <p className="text-sm font-bold uppercase">
                            ⚡ What is a dWallet?
                        </p>
                        <p className="text-sm mt-2">
                            A dWallet is a programmable MPC wallet that lets you sign Bitcoin and Ethereum
                            transactions directly from Sui. It uses threshold cryptography for security.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-black text-white flex items-center justify-center neo-border-sm font-black">
                                1
                            </div>
                            <div className="flex-1">
                                <p className="font-black text-sm uppercase">Create dWallet</p>
                                <p className="text-sm mb-2">
                                    For now, dWallet creation requires the Ika SDK with pre-computed DKG parameters.
                                    This is a complex process that we're working to simplify.
                                </p>
                                <div className="p-3 bg-[#F0F0F0] neo-border-sm">
                                    <p className="text-xs font-bold mb-1">Alternative: Use Mock Mode</p>
                                    <p className="text-xs">
                                        The vault works perfectly in mock mode for testing all features including cross-chain signing simulation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-black text-white flex items-center justify-center neo-border-sm font-black">
                                2
                            </div>
                            <div className="flex-1">
                                <p className="font-black text-sm uppercase">Enter dWallet ID (Optional)</p>
                                <p className="text-sm mb-2">
                                    If you have a dWallet ID from the Ika platform, enter it here:
                                </p>
                                <input
                                    type="text"
                                    value={dWalletId}
                                    onChange={(e) => setDWalletId(e.target.value)}
                                    placeholder="0x..."
                                    className="w-full p-3 neo-border-sm font-mono text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-black text-white flex items-center justify-center neo-border-sm font-black">
                                3
                            </div>
                            <div>
                                <p className="font-black text-sm uppercase">Start Trading</p>
                                <p className="text-sm">
                                    The vault will use your dWallet for cross-chain trades based on your AI Guardrails settings.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-[#0052FF]/10 neo-border-sm">
                        <p className="text-xs font-bold uppercase">
                            � <span className="text-[#0052FF]">Note:</span> The Ika SDK requires complex DKG parameter preparation.
                            We recommend using mock mode for now while we simplify the integration. All other vault features
                            (Seal encryption, Walrus storage, AI Guardrails) are production-ready!
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                        <button
                            onClick={handleSave}
                            disabled={!dWalletId.trim()}
                            className="flex-1 bg-[#00FF85] text-black font-black py-4 px-6 neo-border neo-shadow hover:neo-shadow-hover transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save dWallet ID
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 bg-white text-black font-black py-4 px-6 neo-border hover:bg-[#F0F0F0] transition-all uppercase"
                        >
                            Use Mock Mode
                        </button>
                    </div>

                    {!account && (
                        <div className="p-4 bg-[#FF006B]/10 neo-border-sm">
                            <p className="text-sm font-bold text-[#FF006B] uppercase text-center">
                                ⚠️ Please connect your wallet first
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
