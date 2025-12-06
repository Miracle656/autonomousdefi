import { useEffect, useRef } from 'react'
import { fadeInUp } from '../utils/animations'

export default function AlphaIndicator() {
    const cardRef = useRef<HTMLDivElement>(null)

    // Mock data
    const confidenceScore = 87
    const currentStrategy = "Long SUI / Short Kriya Perps"

    useEffect(() => {
        fadeInUp(cardRef.current, 0.3)
    }, [])

    return (
        <div
            ref={cardRef}
            className="bg-[#0052FF] neo-border neo-shadow p-6 hover:neo-shadow-hover transition-all duration-200"
        >
            <h2 className="text-sm font-black uppercase tracking-wide text-white mb-6">ALPHA CONFIDENCE</h2>

            <div className="flex flex-col items-center">
                {/* Score Display */}
                <div className="relative w-48 h-48 bg-white neo-border flex items-center justify-center mb-6">
                    <div className="text-center">
                        <p className="text-7xl font-black text-black">{confidenceScore}</p>
                        <p className="text-xl font-black text-black/60">/ 100</p>
                    </div>
                </div>

                {/* Current Strategy */}
                <div className="w-full bg-white neo-border-sm p-4 text-center">
                    <p className="text-xs font-black uppercase text-black/60 mb-1">Current Strategy</p>
                    <p className="text-sm font-black uppercase text-black">{currentStrategy}</p>
                </div>
            </div>
        </div>
    )
}
