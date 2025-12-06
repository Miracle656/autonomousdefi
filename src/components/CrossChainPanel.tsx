import { useEffect, useRef, useState } from 'react'
import { fadeInUp } from '../utils/animations'
import { IkaClient, type IkaWalletStatus } from '../utils/ika'
import { useSuiClient } from '@mysten/dapp-kit'
import toast from 'react-hot-toast'
import DWalletSetupModal from './DWalletSetupModal'

export default function CrossChainPanel() {
    const cardRef = useRef<HTMLDivElement>(null)
    const suiClient = useSuiClient()
    const [status, setStatus] = useState<IkaWalletStatus | null>(null)
    const [isSigning, setIsSigning] = useState(false)
    const [lastTx, setLastTx] = useState<string | null>(null)
    const [showSetup, setShowSetup] = useState(false)
    const [dWalletId, setDWalletId] = useState<string | null>(null)

    // Initialize Ika Client
    const ikaClient = new IkaClient(suiClient)

    useEffect(() => {
        fadeInUp(cardRef.current, 0.7)

        // Check if user has a dWallet
        const savedDWalletId = localStorage.getItem('userDWalletId')
        if (savedDWalletId) {
            setDWalletId(savedDWalletId)
        }

        fetchStatus()
    }, [])

    const fetchStatus = async () => {
        const s = await ikaClient.getWalletStatus()
        setStatus(s)
    }

    const handleSignBTC = async () => {
        if (isSigning) return
        setIsSigning(true)
        const toastId = toast.loading('Ika MPC: Signing Bitcoin transaction...')

        try {
            const result = await ikaClient.signBitcoinTransaction(0.01, 'tb1q...test')
            toast.success(`BTC Transaction Signed! ID: ${result.txId.slice(0, 8)}...`, { id: toastId })
            setLastTx(`BTC: ${result.txId.slice(0, 16)}...`)
            fetchStatus() // Refresh status
        } catch (error) {
            toast.error('Signing failed', { id: toastId })
        } finally {
            setIsSigning(false)
        }
    }

    const handleSignETH = async () => {
        if (isSigning) return
        setIsSigning(true)
        const toastId = toast.loading('Ika MPC: Signing Ethereum transaction...')

        try {
            const result = await ikaClient.signEthereumTransaction(0.1, '0x123...test')
            toast.success(`ETH Transaction Signed! ID: ${result.txId.slice(0, 8)}...`, { id: toastId })
            setLastTx(`ETH: ${result.txId.slice(0, 16)}...`)
            fetchStatus() // Refresh status
        } catch (error) {
            toast.error('Signing failed', { id: toastId })
        } finally {
            setIsSigning(false)
        }
    }

    if (!status) return null

    return (
        <div
            ref={cardRef}
            className="bg-white neo-border neo-shadow p-6 hover:neo-shadow-hover transition-all duration-200"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-black uppercase tracking-wide">CROSS-CHAIN STATUS (IKA MPC)</h2>
                <div className="flex items-center space-x-4">
                    {!dWalletId && (
                        <button
                            onClick={() => setShowSetup(true)}
                            className="bg-[#FFD600] text-black text-xs font-black py-2 px-4 neo-border-sm hover:bg-[#00FF85] transition-colors uppercase"
                        >
                            Setup dWallet
                        </button>
                    )}
                    <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 neo-border-sm ${status.online ? 'bg-[#00FF85]' : 'bg-[#FF006B]'}`}></div>
                        <span className={`text-sm font-black uppercase ${status.online ? 'text-[#00FF85]' : 'text-[#FF006B]'}`}>
                            {status.online ? 'ONLINE' : 'OFFLINE'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* BTC Balance */}
                <div className="bg-[#FFD600] neo-border-sm p-4 relative overflow-hidden group">
                    <div className="flex items-center space-x-3 mb-2 relative z-10">
                        <div className="w-12 h-12 bg-black text-[#FFD600] neo-border-sm flex items-center justify-center">
                            <span className="font-black text-2xl">₿</span>
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase">Bitcoin Balance</p>
                            <p className="text-2xl font-black">{status.btcBalance} BTC</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignBTC}
                        disabled={isSigning}
                        className="mt-2 w-full bg-black text-white text-xs font-bold py-2 px-2 neo-border-sm hover:bg-white hover:text-black transition-colors disabled:opacity-50"
                    >
                        {isSigning ? 'SIGNING...' : 'TEST SIGN BTC'}
                    </button>
                </div>

                {/* ETH Balance */}
                <div className="bg-[#0052FF] neo-border-sm p-4 relative overflow-hidden group">
                    <div className="flex items-center space-x-3 mb-2 relative z-10">
                        <div className="w-12 h-12 bg-white text-[#0052FF] neo-border-sm flex items-center justify-center">
                            <span className="font-black text-2xl">Ξ</span>
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-white">Ethereum Balance</p>
                            <p className="text-2xl font-black text-white">{status.ethBalance} ETH</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignETH}
                        disabled={isSigning}
                        className="mt-2 w-full bg-white text-[#0052FF] text-xs font-bold py-2 px-2 neo-border-sm hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                    >
                        {isSigning ? 'SIGNING...' : 'TEST SIGN ETH'}
                    </button>
                </div>

                {/* Last Activity */}
                <div className="bg-[#00FF85] neo-border-sm p-4">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-12 h-12 bg-black text-[#00FF85] neo-border-sm flex items-center justify-center">
                            <span className="font-black text-2xl">⏱</span>
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase">Last Activity</p>
                            <p className="text-xl font-black">{status.lastActivity}</p>
                        </div>
                    </div>
                    {lastTx && (
                        <div className="mt-2 p-2 bg-white neo-border-sm">
                            <p className="text-[10px] font-bold truncate">Last Tx: {lastTx}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 bg-[#F0F0F0] neo-border-sm">
                <p className="text-xs font-bold uppercase">
                    <span className="text-[#0052FF] font-black">IKA STATUS:</span> Ready to sign cross-chain transactions.
                    The Talus Agent controls this programmable MPC wallet (dWallet) to execute trades on external chains.
                </p>
            </div>

            {/* dWallet Setup Modal */}
            {showSetup && (
                <DWalletSetupModal
                    onClose={() => setShowSetup(false)}
                    onDWalletCreated={(id) => {
                        setDWalletId(id);
                        toast.success('dWallet setup complete!');
                    }}
                />
            )}
        </div>
    )
}
