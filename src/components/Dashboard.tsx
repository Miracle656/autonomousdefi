import NavWidget from './NavWidget'
import AlphaIndicator from './AlphaIndicator'
import VaultControls from './VaultControls'
import AllocationChart from './AllocationChart'
import StrategyLog from './StrategyLog'
import SettingsModal from './SettingsModal'
import CrossChainPanel from './CrossChainPanel'
import WalletConnection from './WalletConnection'
import { useState, useEffect, useRef } from 'react'
import { fadeInUp, staggerFadeIn } from '../utils/animations'

export default function Dashboard() {
    const [showSettings, setShowSettings] = useState(false)
    const headerRef = useRef<HTMLDivElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fadeInUp(headerRef.current, 0)

        if (gridRef.current) {
            const gridItems = gridRef.current.querySelectorAll('.grid-item')
            staggerFadeIn(gridItems, 0.1)
        }
    }, [])

    const handleTransactionSuccess = () => {
        // Trigger refetch of vault data
        if ((window as any).refetchVaultData) {
            setTimeout(() => {
                (window as any).refetchVaultData()
            }, 2000) // Wait 2 seconds for blockchain to update
        }
    }

    return (
        <div className="min-h-screen bg-[#F0F0F0] p-6">
            {/* Header with Wallet */}
            <header ref={headerRef} className="mb-8">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-6xl font-black uppercase tracking-tight text-black mb-2">
                            SUI ALPHA VAULT
                        </h1>
                        <p className="text-xl font-bold text-black uppercase">
                            Autonomous DeFi • Powered by Talus & Nautilus
                        </p>
                    </div>
                    <WalletConnection />
                </div>
            </header>

            {/* Main Dashboard Grid */}
            <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top-Left: NAV Widget */}
                <div className="lg:col-span-1 grid-item">
                    <NavWidget />
                </div>

                {/* Top-Center: Alpha Confidence Indicator */}
                <div className="lg:col-span-1 grid-item">
                    <AlphaIndicator />
                </div>

                {/* Top-Right: Vault Controls */}
                <div className="lg:col-span-1 grid-item">
                    <VaultControls
                        onOpenSettings={() => setShowSettings(true)}
                        onTransactionSuccess={handleTransactionSuccess}
                    />
                </div>

                {/* Mid-Left: Asset Allocation Chart */}
                <div className="lg:col-span-2 grid-item">
                    <AllocationChart />
                </div>

                {/* Mid-Right: Strategy Log */}
                <div className="lg:col-span-1 grid-item">
                    <StrategyLog />
                </div>

                {/* Bottom: Cross-Chain Status */}
                <div className="lg:col-span-3 grid-item">
                    <CrossChainPanel />
                </div>
            </div>

            {/* Settings Modal */}
            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        </div>
    )
}
