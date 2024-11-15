import { NEOX_ONEO_CA } from "@/consts";
import { NEOX_MAINNET, wagmiConfig } from "@/wagmi-config";
import { readContract, simulateContract, writeContract } from "@wagmi/core";
import { ethers } from "ethers";
import ONEO_ABI from "./ONEO.json";

export async function getClaimableAmount(address: string): Promise<string> {
  if (!address) return "0";
  const res = (await readContract(wagmiConfig, {
    address: NEOX_ONEO_CA,
    abi: ONEO_ABI,
    functionName: "claimable",
    args: [address],
    chainId: NEOX_MAINNET.id,
  })) as bigint;
  return ethers.formatUnits(res);
}

export const claim = async (): Promise<`0x${string}`> => {
  const { request } = await simulateContract(wagmiConfig, {
    address: NEOX_ONEO_CA,
    abi: ONEO_ABI,
    functionName: "claim",
    chainId: NEOX_MAINNET.id,
  });
  return await writeContract(wagmiConfig, request);
};

export const getRewardsPerBlock = async (): Promise<bigint> => {
  return (await readContract(wagmiConfig, {
    address: NEOX_ONEO_CA,
    abi: ONEO_ABI,
    functionName: "rewardsPerBlock",
    chainId: NEOX_MAINNET.id,
  })) as bigint;
};
