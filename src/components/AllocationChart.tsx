import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { useEffect, useRef } from 'react'
import { fadeInUp } from '../utils/animations'
import { useRealAllocations } from '../hooks/useRealAllocations'

export default function AllocationChart() {
    const cardRef = useRef<HTMLDivElement>(null)
    const { allocations: data, isLoading } = useRealAllocations()

    useEffect(() => {
        fadeInUp(cardRef.current, 0.5)
    }, [])

    return (
        <div
            ref={cardRef}
            className="bg-white neo-border neo-shadow p-6 hover:neo-shadow-hover transition-all duration-200"
        >
            <h2 className="text-sm font-black uppercase tracking-wide mb-6">ASSET ALLOCATION</h2>

            {isLoading ? (
                <div className="h-80 mb-6 flex items-center justify-center">
                    <p className="text-lg font-black uppercase">Loading real data...</p>
                </div>
            ) : (
                <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height={320} minHeight={320}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }: any) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                stroke="#000000"
                                strokeWidth={4}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="square"
                                wrapperStyle={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#F0F0F0] neo-border-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 neo-border-sm" style={{ backgroundColor: item.color }}></div>
                            <span className="text-xs font-black uppercase">{item.name}</span>
                        </div>
                        <span className="text-sm font-black">{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
