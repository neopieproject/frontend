import { NEO_LINE, NEO_LINE_MOBILE } from ".";

export type IWalletType = typeof NEO_LINE | typeof NEO_LINE_MOBILE;

export interface IConnectedWallet {
  name: string;
  key: IWalletType;
  instance: any;
  account: any;
}

export interface IBalance {
  contract: string;
  symbol: string;
  amount: string;
}

export interface ITransaction {
  invokeScript?: any;
  wallet: IWalletType;
  txid: string;
  contractHash: string;
  method: string;
  args: any;
  createdAt: string;
}

export interface ITxReceipt {
  txid: string;
  nodeUrl: string;
}

export type IContractCallArgs =
  | "String"
  | "Boolean"
  | "Hash160"
  | "Hash256"
  | "Integer"
  | "ByteArray"
  | "Array"
  | "Address";
