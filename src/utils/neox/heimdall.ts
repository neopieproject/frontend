import { NEOX_MAINNET, wagmiConfig } from "@/wagmi-config";
import { readContract, simulateContract, writeContract } from "wagmi/actions";
import HEIMDALL_ABI from "../neox/Heimdall.json";
import { NEOX_HEIMDALL_CA } from "@/consts";
import { ethers, parseUnits } from "ethers";
import { sleep } from "../neo/helpers";

export const burn = async (
  tokenAddress: string,
  receiver: string,
  amount: string
): Promise<string> => {
  const { request } = await simulateContract(wagmiConfig, {
    address: NEOX_HEIMDALL_CA,
    abi: HEIMDALL_ABI,
    functionName: "burn",
    args: [tokenAddress, receiver, parseUnits(amount, 18)],
    chainId: NEOX_MAINNET.id,
  });
  return await writeContract(wagmiConfig, request);
};

export const getBurnNoFromLogs = (logs: any) => {
  let iface = new ethers.Interface(HEIMDALL_ABI);
  let burnNo;
  logs.forEach((log: any) => {
    try {
      const parsedLog = iface.parseLog(log);
      if (parsedLog?.name === "GoodBye") {
        burnNo = parsedLog.args[0].toString();
      }
    } catch (e) {
      throw new Error("Failed to find burn no from the events.");
    }
  });
  return burnNo;
};

export const checkIfMinted = async (no: string | number): Promise<boolean> => {
  let minted: any;
  do {
    try {
      minted = await readContract(wagmiConfig, {
        address: NEOX_HEIMDALL_CA,
        abi: HEIMDALL_ABI,
        functionName: "isMinted",
        args: [no],
        chainId: NEOX_MAINNET.id,
      });
    } catch (e) {
      console.error(e);
      await sleep(3000);
    }
  } while (!minted);

  return true;
};
