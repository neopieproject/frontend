import { NEOX_MAINNET, wagmiConfig } from "@/wagmi-config";
import { readContract, simulateContract, writeContract } from "wagmi/actions";
import { erc20Abi } from "viem";
import { ethers } from "ethers";
export const getAllowances = async (
  address: string,
  tokenAddresses: string[],
  spender: string
) => {
  // An array to hold the promises for each readContract call
  const promises = tokenAddresses.map((ca) =>
    readContract(wagmiConfig, {
      address: ca as any,
      abi: erc20Abi,
      functionName: "allowance",
      args: [address as any, spender as any],
      chainId: NEOX_MAINNET.id,
    })
  );

  // Wait for all promises to resolve
  const results = await Promise.all(promises);

  // Return the results directly, assuming results contain the allowance data
  return results.map((r) => {
    return r;
  });
};

export const approve = async (
  ca: any,
  spenderAddress: any
): Promise<string> => {
  const { request } = await simulateContract(wagmiConfig, {
    address: ca,
    abi: erc20Abi,
    functionName: "approve",
    args: [spenderAddress, ethers.MaxUint256],
    chainId: NEOX_MAINNET.id,
  });
  return await writeContract(wagmiConfig, request);
};

