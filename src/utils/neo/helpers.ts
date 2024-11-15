import { N3_PUBLIC_RPC } from "@/consts";
import { rpc, sc, u, wallet } from "@cityofzion/neon-core";
import { ApplicationLogJson } from "@cityofzion/neon-core/lib/rpc";
import { NeoWallets } from ".";
import { formatUnits } from "viem";

export const getBalance = async (
  address: string,
  tokenHash: string
): Promise<string> => {
  const scripts: any = [];
  const senderHash = wallet.isAddress(address)
    ? wallet.getScriptHashFromAddress(address)
    : address;

  const script1 = {
    scriptHash: tokenHash,
    operation: "balanceOf",
    args: [{ type: "Hash160", value: senderHash }],
  };
  const script2 = {
    scriptHash: tokenHash,
    operation: "decimals",
    args: [],
  };
  scripts.push(script1);
  scripts.push(script2);
  const res = await NeoWallets.readContract(scripts);
  if (res.state === "FAULT") {
    console.error("Failed to fetch the balance.");
    return "0";
  }
  return formatAmount(
    res.stack[0].value as string,
    parseFloat(res.stack[1].value as string)
  );
};

export const getRawTx = async (txid: string): Promise<ApplicationLogJson> => {
  const rpcClient = new rpc.RPCClient(N3_PUBLIC_RPC);
  let rawTx: any;
  do {
    try {
      rawTx = await rpcClient.getApplicationLog(txid);
    } catch (e: any) {
      console.error(e);
      await sleep(6000);
    }
  } while (!rawTx);

  return rawTx;
};

export const sleep = (duration: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

export const getLockNoFromNotifications = (json: any): number => {
  try {
    const mintNotification = json.executions[0].notifications.find(
      (log: any) => log.eventname === "Lock" && log.state?.value?.[0]?.value
    );

    if (mintNotification && mintNotification.state.value) {
      return parseFloat(mintNotification.state.value[0].value as string);
    }

    throw new Error("Can't find mint no from the txid.");
  } catch (e) {
    throw new Error("Can't find mint no from the txid.");
  }
};

export const convertContractCallParam = (param: any) => {
  switch (param.type) {
    case "Address":
      return sc.ContractParam.hash160(
        wallet.getScriptHashFromAddress(param.value)
      );
    case "Hash160":
      return sc.ContractParam.hash160(param.value);
    case "String":
      return sc.ContractParam.string(param.value);
    case "Integer":
      return sc.ContractParam.integer(param.value);
    case "Array":
      return sc.ContractParam.array(
        ...param.value.map((i: any) => convertContractCallParam(i))
      );
    case "ByteArray":
      return sc.ContractParam.byteArray(
        u.hex2base64(u.str2hexstring(param.value))
      );
    default:
      throw new Error("No support param");
  }
};

export const formatAmount = (
  amount: string,
  decimals: string | number
): string => {
  const decimalsNumber = +decimals;

  if (isNaN(decimalsNumber)) {
    throw new Error("Invalid decimals value");
  }

  return formatUnits(BigInt(amount), decimalsNumber);
};

export const neutralizeN3Address = (address: string) => {
  let hash = wallet.getScriptHashFromAddress(address);

  if (!hash.startsWith("0x")) {
    hash = "0x" + hash;
  }

  return hash;
};
