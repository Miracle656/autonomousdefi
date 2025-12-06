import { useState, useEffect, useRef } from 'react'
import { fadeInUp } from '../utils/animations'
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import { encryptSettings, storeEncryptedSettingsOnChain } from '../utils/seal'
import toast from 'react-hot-toast'

interface SettingsModalProps {
    onClose: () => void
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
    const [riskLevel, setRiskLevel] = useState(1)
    const [stopLoss, setStopLoss] = useState('100000')
    const [isEncrypting, setIsEncrypting] = useState(false)
    const [useRealEncryption, setUseRealEncryption] = useState(false)
    const modalRef = useRef<HTMLDivElement>(null)

    const account = useCurrentAccount()
    const { mutate: signAndExecute } = useSignAndExecuteTransaction()
    const suiClient = useSuiClient()

    const riskLevels = ['Conservative', 'Balanced', 'Aggressive']
    const riskColors = ['#00FF85', '#FFD600', '#FF006B']

    useEffect(() => {
        fadeInUp(modalRef.current, 0)
    }, [])

    const handleSave = async () => {
        if (!account && useRealEncryption) {
            toast.error('Please connect your wallet first')
            return
        }

        setIsEncrypting(true)
        const toastId = toast.loading(
            useRealEncryption ? 'Encrypting with Seal...' : 'Saving settings...'
        )

        try {
            // Prepare settings data
            const settingsData = {
                riskLevel: riskLevels[riskLevel],
                stopLoss: parseInt(stopLoss),
                timestamp: Date.now(),
            }

            if (useRealEncryption) {
                // PRODUCTION: Real Seal encryption
                const { encryptedData, keyId } = await encryptSettings(settingsData, suiClient)

                // Store encrypted data on-chain
                await storeEncryptedSettingsOnChain(encryptedData, keyId, signAndExecute)

                toast.success(
                    `Settings encrypted with Seal! Risk: ${riskLevels[riskLevel]}, Stop-Loss: $${parseInt(stopLoss).toLocaleString()}`,
                    { id: toastId, duration: 5000 }
                )

                console.log('Encrypted data stored on-chain')
            } else {
                // DEMO: Mock encryption
                await new Promise(resolve => setTimeout(resolve, 1500))

                const mockEncryptedData = btoa(JSON.stringify(settingsData))
                localStorage.setItem('vault_settings_encrypted', mockEncryptedData)

                toast.success(
                    `Settings saved (demo mode)! Risk: ${riskLevels[riskLevel]}, Stop-Loss: $${parseInt(stopLoss).toLocaleString()}`,
                    { id: toastId, duration: 5000 }
                )
            }

            setTimeout(() => {
                onClose()
            }, 1000)
        } catch (error: any) {
            toast.error(`${useRealEncryption ? 'Encryption' : 'Save'} failed: ${error.message}`, { id: toastId })
            console.error('Settings save error:', error)
        } finally {
            setIsEncrypting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div
                ref={modalRef}
                className="bg-white neo-border neo-shadow max-w-md w-full p-8"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-black uppercase">AI GUARDRAILS</h2>
                    <button
                        onClick={onClose}
                        className="text-4xl font-black hover:text-[#FF006B] transition-colors"
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Encryption Mode Toggle */}
                    <div className="p-4 bg-[#F0F0F0] neo-border-sm">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={useRealEncryption}
                                onChange={(e) => setUseRealEncryption(e.target.checked)}
                                className="w-5 h-5"
                            />
                            <span className="text-xs font-black uppercase">
                                {useRealEncryption ? '🔒 PRODUCTION MODE (Real Seal Encryption)' : '🎭 DEMO MODE (Mock Encryption)'}
                            </span>
                        </label>
                    </div>

                    {/* Risk Slider */}
                    <div>
                        <label className="block text-sm font-black uppercase mb-3">
                            RISK TOLERANCE
                        </label>
                        <div className="relative">
                            <input
                                type="range"
                                min="0"
                                max="2"
                                value={riskLevel}
                                onChange={(e) => setRiskLevel(parseInt(e.target.value))}
                                className="w-full h-4 bg-[#F0F0F0] neo-border-sm appearance-none cursor-pointer"
                                style={{
                                    accentColor: riskColors[riskLevel]
                                }}
                            />
                            <div className="flex justify-between mt-3">
                                {riskLevels.map((level, index) => (
                                    <span
                                        key={index}
                                        className={`text-xs font-black uppercase ${index === riskLevel ? 'text-black' : 'text-black/40'}`}
                                    >
                                        {level}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stop Loss Input */}
                    <div>
                        <label className="block text-sm font-black uppercase mb-3">
                            <div className="flex items-center space-x-2">
                                <span>STOP-LOSS THRESHOLD</span>
                                <span className="text-xl">🔒</span>
                            </div>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-black">$</span>
                            <input
                                type="number"
                                value={stopLoss}
                                onChange={(e) => setStopLoss(e.target.value)}
                                className="w-full bg-[#F0F0F0] neo-border-sm py-4 pl-12 pr-4 text-xl font-black focus:outline-none focus:bg-white"
                                placeholder="100000"
                            />
                        </div>
                        <p className="text-xs font-bold uppercase text-black/60 mt-2 flex items-center space-x-1">
                            <span>🔒</span>
                            <span>
                                {useRealEncryption
                                    ? 'Encrypted via Seal - Only decryptable by Nautilus TEE'
                                    : 'Demo mode - Stored in localStorage'}
                            </span>
                        </p>
                    </div>

                    {/* Seal Info */}
                    <div className="p-4 bg-[#F0F0F0] neo-border-sm">
                        <p className="text-xs font-bold uppercase">
                            <span className="text-[#0052FF]">
                                {useRealEncryption ? 'SEAL ENCRYPTION:' : 'DEMO MODE:'}
                            </span>{' '}
                            {useRealEncryption
                                ? 'Your settings will be encrypted using threshold cryptography and stored on-chain. Only the Nautilus TEE can decrypt them.'
                                : 'Settings will be stored locally for demo purposes. Enable production mode for real Seal encryption.'}
                        </p>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={isEncrypting || (useRealEncryption && !account)}
                        className="w-full bg-[#0052FF] neo-button py-4 px-6 text-white disabled:opacity-50"
                    >
                        {isEncrypting ? 'ENCRYPTING...' : 'SAVE SETTINGS'}
                    </button>
                </div>
            </div>
        </div>
    )
}
