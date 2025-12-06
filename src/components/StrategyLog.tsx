import { useEffect, useRef, useState } from 'react'
import { fadeInUp, staggerFadeIn } from '../utils/animations'
import { uploadToWalrus } from '../utils/walrus'
import { useStrategyEvents } from '../hooks/useStrategyEvents'
import toast from 'react-hot-toast'

interface StrategyEvent {
    id: number
    timestamp: string
    action: string
    proofId: string
    color: string
}

export default function StrategyLog() {
    const cardRef = useRef<HTMLDivElement>(null)
    const logsRef = useRef<HTMLDivElement>(null)
    const [walrusBlobId, setWalrusBlobId] = useState<string | null>(null)
    const [useRealTimeEvents, setUseRealTimeEvents] = useState(false)

    // Real-time events from blockchain
    const realTimeEvents = useStrategyEvents()

    // Mock strategy log data (for demo)
    const mockLogs: StrategyEvent[] = [
        {
            id: 1,
            timestamp: new Date().toLocaleTimeString(),
            action: 'Borrowed 5,000 USDC on Scallop',
            proofId: '0x7f3a...9b2c',
            color: '#FFD600',
        },
        {
            id: 2,
            timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(),
            action: 'Opened Long SUI position on Kriya',
            proofId: '0x4e2d...1a5f',
            color: '#0052FF',
        },
        {
            id: 3,
            timestamp: new Date(Date.now() - 7200000).toLocaleTimeString(),
            action: 'Deposited 10,000 SUI to NAVI',
            proofId: '0x9c1b...6e3d',
            color: '#00FF85',
        },
    ]

    // Combine real-time and mock events
    const displayLogs = useRealTimeEvents ? [...realTimeEvents, ...mockLogs] : mockLogs

    useEffect(() => {
        fadeInUp(cardRef.current, 0.6)
    }, [])

    useEffect(() => {
        if (logsRef.current && displayLogs.length > 0) {
            const logItems = logsRef.current.querySelectorAll('.log-item')
            setTimeout(() => staggerFadeIn(logItems, 0.05), 300)
        }
    }, [displayLogs])

    // Auto-upload to Walrus when new real-time events arrive
    useEffect(() => {
        if (useRealTimeEvents && realTimeEvents.length > 0) {
            console.log('New real-time event detected, auto-uploading to Walrus...')
            uploadLogsToWalrus()
        }
    }, [realTimeEvents.length])

    const uploadLogsToWalrus = async () => {
        const toastId = toast.loading('Uploading strategy log to Walrus...')
        try {
            const logData = JSON.stringify(displayLogs)
            const blobId = await uploadToWalrus(logData)
            setWalrusBlobId(blobId)
            toast.success(`Logs uploaded to Walrus! Blob ID: ${blobId.slice(0, 8)}...`, { id: toastId })
            console.log('Walrus Blob ID:', blobId)
        } catch (error: any) {
            toast.error(`Upload failed: ${error.message}`, { id: toastId })
            console.error('Walrus upload error:', error)
        }
    }

    return (
        <div
            ref={cardRef}
            className="bg-white neo-border neo-shadow p-6 hover:neo-shadow-hover transition-all duration-200"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black uppercase tracking-wide">STRATEGY LOG</h2>
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 neo-border-sm ${useRealTimeEvents ? 'bg-[#00FF85]' : 'bg-[#FFD600]'}`}></div>
                    <span className="text-xs font-black uppercase">
                        {useRealTimeEvents ? 'LIVE EVENTS' : 'DEMO MODE'}
                    </span>
                </div>
            </div>

            {/* Mode Toggle */}
            <div className="mb-4 p-3 bg-[#F0F0F0] neo-border-sm">
                <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={useRealTimeEvents}
                        onChange={(e) => setUseRealTimeEvents(e.target.checked)}
                        className="w-4 h-4"
                    />
                    <span className="text-xs font-black uppercase">
                        {useRealTimeEvents ? '📡 LISTENING TO BLOCKCHAIN EVENTS' : '🎭 SHOWING MOCK DATA'}
                    </span>
                </label>
            </div>

            {walrusBlobId && (
                <div className="mb-4 p-2 bg-[#F0F0F0] neo-border-sm">
                    <p className="text-xs font-bold">
                        <span className="text-[#0052FF]">WALRUS:</span> {walrusBlobId.slice(0, 16)}...
                    </p>
                </div>
            )}

            <div ref={logsRef} className="space-y-3 max-h-80 overflow-y-auto mb-4">
                {displayLogs.length === 0 ? (
                    <p className="text-sm font-bold text-center text-black/60">
                        {useRealTimeEvents ? 'Waiting for strategy events...' : 'No strategy logs yet'}
                    </p>
                ) : (
                    displayLogs.map((log) => (
                        <div
                            key={log.id}
                            className="log-item bg-[#F0F0F0] neo-border-sm p-4 hover:translate-x-1 transition-transform"
                            style={{ borderLeftWidth: '8px', borderLeftColor: log.color }}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <p className="text-sm font-black uppercase flex-1">{log.action}</p>
                                <span className="text-xs font-black bg-black text-white px-2 py-1 ml-2">{log.timestamp}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-xs font-black uppercase">Proof:</span>
                                <code className="text-xs font-bold bg-white neo-border-sm px-2 py-1">
                                    {log.proofId}
                                </code>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <button
                onClick={uploadLogsToWalrus}
                className="w-full bg-[#0052FF] neo-button py-2 px-4 text-white text-xs"
            >
                UPLOAD TO WALRUS
            </button>
        </div>
    )
}
