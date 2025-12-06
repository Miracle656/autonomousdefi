import { useEffect, useState } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import { PACKAGE_ID } from '../constants/contracts';

// Export the interface so it can be imported by other components
export interface StrategyEvent {
    id: number;
    timestamp: string;
    action: string;
    proofId: string;
    color: string;
}

export function useStrategyEvents() {
    const [events, setEvents] = useState<StrategyEvent[]>([]);
    const suiClient = useSuiClient();

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const subscribeToEvents = async () => {
            try {
                // Subscribe to RebalanceEvent from strategy module
                unsubscribe = await suiClient.subscribeEvent({
                    filter: {
                        MoveEventType: `${PACKAGE_ID}::strategy::RebalanceEvent`,
                    },
                    onMessage: (event) => {
                        console.log('New strategy event:', event);

                        const parsedJson = event.parsedJson as any;
                        const newEvent: StrategyEvent = {
                            id: Date.now(),
                            timestamp: new Date().toLocaleTimeString(),
                            action: new TextDecoder().decode(new Uint8Array(parsedJson.action)),
                            proofId: parsedJson.proof_id || '0x0000...0000',
                            color: '#0052FF',
                        };

                        setEvents((prev) => [newEvent, ...prev].slice(0, 10)); // Keep last 10 events
                    },
                });

                console.log('Subscribed to strategy events');
            } catch (error) {
                console.error('Error subscribing to events:', error);
            }
        };

        subscribeToEvents();

        // Cleanup subscription on unmount
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [suiClient]);

    return events;
}
