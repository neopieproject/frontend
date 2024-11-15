import { http, createConfig } from "wagmi";

export const NEOX_MAINNET: any = {
  id: 47763,
  name: "Neo X",
  nativeCurrency: {
    name: "GAS",
    symbol: "GAS",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet-1.rpc.banelabs.org"],
    },
    public: {
      http: ["https://mainnet-1.rpc.banelabs.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Neo x Explorer",
      url: "https://xexplorer.neo.org",
    },
  },
  contracts: {
    multicall3: {
      address: "0xD6010D102015fEa9cB3a9AbFBB51994c0Fd6E672" as `0x${string}`,
      blockCreated: 4299,
    },
  },
};

export const wagmiConfig = createConfig({
  chains: [NEOX_MAINNET],
  connectors: [],
  transports: {
    [NEOX_MAINNET.id]: http(NEOX_MAINNET.rpcUrls.default.http[0]),
  },
});
