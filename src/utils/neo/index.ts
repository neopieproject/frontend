import { rpc, sc, u } from "@cityofzion/neon-core";
import { IConnectedWallet, IWalletType } from "./interfaces";
import { initNeoLine } from "./wallets/neoline";
import { initNeoLineMobile } from "./wallets/neoline-mobile";
import { InvokeResult } from "@cityofzion/neon-core/lib/rpc";
import { N3_PUBLIC_RPC } from "@/consts";
import { convertContractCallParam } from "./helpers";

export const O3 = "O3";
export const NEON = "NEON";
export const NEO_LINE = "NEO_LINE";
export const NEO_LINE_MOBILE = "NEO_LINE_MOBILE";
export const ONE_GATE = "ONE_GATE";

const WALLET_LIST: {
  label: string;
  key: IWalletType;
}[] = [
  {
    label: "NeoLine",
    key: NEO_LINE,
  },
  {
    label: "NeoLine Mobile",
    key: NEO_LINE_MOBILE,
  },
];

export class NeoWallets {
  static list = WALLET_LIST;

  static init = async (walletType: IWalletType): Promise<IConnectedWallet> => {
    let instance;
    switch (walletType) {
      case NEO_LINE:
        instance = await initNeoLine();
        break;
      case NEO_LINE_MOBILE:
        instance = await initNeoLineMobile();
        break;
    }
    return {
      key: walletType,
      ...instance,
    };
  };

  /* Control signing and send transaction. TODO:Need to improve type hardcoding later */
  static invoke = async (
    connectedWallet: IConnectedWallet,
    invokeScript: any,
    extraSystemFee?: string
  ): Promise<string> => {
    if (extraSystemFee) {
      invokeScript.extraSystemFee = extraSystemFee;
    }

    const instance = connectedWallet.instance;

    const res = await instance.invoke(invokeScript);
    return res.txid;
  };

  // static getBalance = async (
  //   connectedWallet: IConnectedWallet,
  //   tokenHash: string
  // ): Promise<string> => {
  //   const res = await connectedWallet.instance.getBalance();
  // };

  static readContract = async (
    scripts: sc.ContractCallJson[]
  ): Promise<any | undefined> => {
    const rpcClient = new rpc.RPCClient(N3_PUBLIC_RPC);
    const sb = new sc.ScriptBuilder();
    scripts.map((script) => {
      let params: unknown[] = [];
      if (script.args) {
        params = script.args.map((arg) => convertContractCallParam(arg));
      }
      sb.emitAppCall(script.scriptHash, script.operation, params);
    });
    return await rpcClient.invokeScript(u.HexString.fromHex(sb.build()));
  };
}
