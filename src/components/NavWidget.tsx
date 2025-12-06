import { useEffect, useRef } from 'react'
import { fadeInUp } from '../utils/animations'
import { useSuiClientQuery } from '@mysten/dapp-kit'
import { VAULT_OBJECT_ID } from '../constants/contracts'

export default function NavWidget() {
    const cardRef = useRef<HTMLDivElement>(null)

    // Fetch vault object to get TVL with auto-refetch
    const { data: vaultData, isLoading, refetch } = useSuiClientQuery('getObject', {
        id: VAULT_OBJECT_ID,
        options: {
            showContent: true,
        },
    }, {
        refetchInterval: 5000, // Refetch every 5 seconds
        gcTime: 0, // Don't cache
    })

    useEffect(() => {
        fadeInUp(cardRef.current, 0.2)
    }, [])

    // Expose refetch function globally for other components
    useEffect(() => {
        (window as any).refetchVaultData = refetch
    }, [refetch])

    // Extract TVL from vault data
    let tvl = 0
    if (vaultData?.data?.content && 'fields' in vaultData.data.content) {
        const fields = vaultData.data.content.fields as any
        if (fields.underlying_balance) {
            tvl = parseInt(fields.underlying_balance) / 1_000_000_000 // Convert MIST to SUI
        }
    }

    // Mock P&L data (would come from historical data in production)
    const dailyPnL = 2450.75
    const pnlPercentage = 2.01

    return (
        <div
            ref={cardRef}
            className="bg-white neo-border neo-shadow p-6 hover:neo-shadow-hover transition-all duration-200"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black uppercase tracking-wide">NET ASSET VALUE</h2>
                <div className="w-4 h-4 bg-[#00FF85] neo-border-sm"></div>
            </div>

            <div className="space-y-4">
                <div>
                    {isLoading ? (
                        <p className="text-3xl font-black text-black mb-1">Loading...</p>
                    ) : (
                        <>
                            <p className="text-5xl font-black text-black mb-1">
                                {tvl.toFixed(2)} SUI
                            </p>
                            <p className="text-xs font-bold uppercase text-black/60">Total Value Locked</p>
                        </>
                    )}
                </div>

                <div className="pt-4 border-t-4 border-black">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-black uppercase">Daily P&L</span>
                        <div className="flex items-center space-x-2">
                            <span className={`text-2xl font-black ${dailyPnL >= 0 ? 'text-[#00FF85]' : 'text-[#FF006B]'}`}>
                                {dailyPnL >= 0 ? '+' : ''}${dailyPnL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                            <span className={`text-sm font-black px-3 py-1 neo-border-sm ${dailyPnL >= 0 ? 'bg-[#00FF85]' : 'bg-[#FF006B]'}`}>
                                {dailyPnL >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
