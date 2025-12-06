// Seal key server object IDs for testnet (Open mode servers)
export const SEAL_SERVER_OBJECT_IDS = [
    '0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75', // mysten-testnet-1
    '0xf5d14a81a982144ae441cd7d64b09027f116a468bd36e7eca494f750591623c8', // mysten-testnet-2
    '0x6068c0acb197dddbacd4746a9de7f025b2ed5a5b6c1b1ab44dade4426d141da2', // Ruby Nodes
]

// Threshold for decryption (2 out of 3 servers)
export const SEAL_THRESHOLD = 2
