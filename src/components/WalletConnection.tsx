import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'

export default function WalletConnection() {
    const account = useCurrentAccount()

    return (
        <div className="bg-white neo-border neo-shadow p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xs font-black uppercase mb-1">WALLET</h3>
                    {account ? (
                        <p className="text-xs font-bold">
                            {account.address.slice(0, 6)}...{account.address.slice(-4)}
                        </p>
                    ) : (
                        <p className="text-xs font-bold text-black/60">Not Connected</p>
                    )}
                </div>
                <ConnectButton className="neo-button !bg-[#0052FF] !text-white !px-4 !py-2 !text-xs" />
            </div>
        </div>
    )
}
