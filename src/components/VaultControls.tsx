import { useEffect, useRef, useState } from 'react'
import { fadeInUp } from '../utils/animations'
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { PACKAGE_ID, VAULT_OBJECT_ID, VAULT_MODULE, DEPOSIT_SUI_FUNCTION, WITHDRAW_SUI_FUNCTION } from '../constants/contracts'
import toast from 'react-hot-toast'

interface VaultControlsProps {
    onOpenSettings: () => void
    onTransactionSuccess?: () => void
}

export default function VaultControls({ onOpenSettings, onTransactionSuccess }: VaultControlsProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const account = useCurrentAccount()
    const { mutate: signAndExecute } = useSignAndExecuteTransaction()
    const suiClient = useSuiClient()

    const [depositAmount, setDepositAmount] = useState('1000000000') // 1 SUI in MIST
    const [isDepositing, setIsDepositing] = useState(false)
    const [isWithdrawing, setIsWithdrawing] = useState(false)

    useEffect(() => {
        fadeInUp(cardRef.current, 0.4)
    }, [])

    const handleDeposit = async () => {
        if (!account) {
            toast.error('Please connect your wallet first')
            return
        }

        setIsDepositing(true)
        const toastId = toast.loading('Preparing deposit transaction...')

        try {
            const tx = new Transaction()

            // Split coin for deposit amount
            const [coin] = tx.splitCoins(tx.gas, [depositAmount])

            // Call deposit_sui function
            tx.moveCall({
                target: `${PACKAGE_ID}::${VAULT_MODULE}::${DEPOSIT_SUI_FUNCTION}`,
                arguments: [
                    tx.object(VAULT_OBJECT_ID),
                    coin,
                ],
            })

            signAndExecute(
                {
                    transaction: tx,
                },
                {
                    onSuccess: (result) => {
                        console.log('Deposit successful:', result)
                        toast.success(`Deposit successful! ${(parseInt(depositAmount) / 1_000_000_000).toFixed(2)} SUI deposited`, { id: toastId })
                        onTransactionSuccess?.()
                    },
                    onError: (error) => {
                        console.error('Deposit failed:', error)
                        toast.error(`Deposit failed: ${error.message}`, { id: toastId })
                    },
                }
            )
        } catch (error: any) {
            console.error('Error creating deposit transaction:', error)
            toast.error(`Error: ${error.message}`, { id: toastId })
        } finally {
            setIsDepositing(false)
        }
    }

    const handleWithdraw = async () => {
        if (!account) {
            toast.error('Please connect your wallet first')
            return
        }

        setIsWithdrawing(true)
        const toastId = toast.loading('Fetching LP tokens...')

        try {
            // Get user's LP tokens - they are Coin<VAULT> objects
            const objects = await suiClient.getOwnedObjects({
                owner: account.address,
                filter: {
                    StructType: `0x2::coin::Coin<${PACKAGE_ID}::${VAULT_MODULE}::VAULT>`,
                },
                options: {
                    showContent: true,
                },
            })

            console.log('LP tokens found:', objects)

            if (!objects.data || objects.data.length === 0) {
                toast.error('No LP tokens found. Please deposit first.', { id: toastId })
                setIsWithdrawing(false)
                return
            }

            const lpCoinId = objects.data[0].data?.objectId
            if (!lpCoinId) {
                toast.error('Could not find LP token ID', { id: toastId })
                setIsWithdrawing(false)
                return
            }

            toast.loading('Preparing withdrawal transaction...', { id: toastId })

            const tx = new Transaction()

            // Call withdraw_sui function
            tx.moveCall({
                target: `${PACKAGE_ID}::${VAULT_MODULE}::${WITHDRAW_SUI_FUNCTION}`,
                arguments: [
                    tx.object(VAULT_OBJECT_ID),
                    tx.object(lpCoinId),
                ],
            })

            signAndExecute(
                {
                    transaction: tx,
                },
                {
                    onSuccess: (result) => {
                        console.log('Withdrawal successful:', result)
                        toast.success('Withdrawal successful! SUI returned to your wallet', { id: toastId })
                        onTransactionSuccess?.()
                    },
                    onError: (error) => {
                        console.error('Withdrawal failed:', error)
                        toast.error(`Withdrawal failed: ${error.message}`, { id: toastId })
                    },
                }
            )
        } catch (error: any) {
            console.error('Error creating withdrawal transaction:', error)
            toast.error(`Error: ${error.message}`, { id: toastId })
        } finally {
            setIsWithdrawing(false)
        }
    }

    return (
        <div
            ref={cardRef}
            className="bg-white neo-border neo-shadow p-6 hover:neo-shadow-hover transition-all duration-200"
        >
            <h2 className="text-sm font-black uppercase tracking-wide mb-6">VAULT CONTROLS</h2>

            <div className="space-y-4">
                {/* Deposit Amount Input */}
                <div>
                    <label className="block text-xs font-black uppercase mb-2">Deposit Amount (MIST)</label>
                    <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="w-full bg-[#F0F0F0] neo-border-sm py-2 px-4 text-sm font-bold focus:outline-none"
                        placeholder="1000000000"
                    />
                    <p className="text-xs font-bold text-black/60 mt-1">
                        {(parseInt(depositAmount) / 1_000_000_000).toFixed(2)} SUI
                    </p>
                </div>

                {/* Deposit Button */}
                <button
                    onClick={handleDeposit}
                    disabled={!account || isDepositing}
                    className="w-full bg-[#00FF85] neo-button py-4 px-6 text-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center justify-center space-x-2">
                        <span className="text-2xl">+</span>
                        <span>{isDepositing ? 'DEPOSITING...' : 'DEPOSIT SUI'}</span>
                    </div>
                </button>

                {/* Withdraw Button */}
                <button
                    onClick={handleWithdraw}
                    disabled={!account || isWithdrawing}
                    className="w-full bg-[#FFD600] neo-button py-4 px-6 text-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center justify-center space-x-2">
                        <span className="text-2xl">−</span>
                        <span>{isWithdrawing ? 'WITHDRAWING...' : 'WITHDRAW ALL'}</span>
                    </div>
                </button>

                {/* Settings Button */}
                <button
                    onClick={onOpenSettings}
                    className="w-full bg-white neo-button py-3 px-6 text-black"
                >
                    <div className="flex items-center justify-center space-x-2">
                        <span className="text-xl">⚙</span>
                        <span>AI GUARDRAILS</span>
                    </div>
                </button>
            </div>
        </div>
    )
}
