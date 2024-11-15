import React, { createContext, useContext, useState } from "react";

import { message } from "antd";
import { IConnectedWallet, IWalletType } from "./interfaces";
import { NeoWallets } from ".";

export interface IWalletStates {
  list: {
    key: IWalletType;
    label: string;
  }[];
  connectedWallet?: IConnectedWallet;
  connectWallet: (wallet: IWalletType, onSuccess: () => void) => void;
  disConnectWallet: () => void;
}

const NeoWalletContext = createContext({} as IWalletStates);
export const NeoWalletProvider = (props: { children: any }) => {
  const [connectedWallet, setConnectedWallet] = useState<
    IConnectedWallet | undefined
  >(undefined);

  const connectWallet = async (
    walletType: IWalletType,
    onSuccess: () => void
  ) => {
    try {
      const res = await NeoWallets.init(walletType);
      setConnectedWallet(res);
      message.success("Connected!");
      onSuccess();
    } catch (e: any) {
      message.error(
        e && e.message ? e.message : `Failed to connect ${walletType}.`
      );
    }
  };

  const disConnectWallet = () => {
    setConnectedWallet(undefined);
    // message.error("Wallet disconnected");
  };

  const contextValue: IWalletStates = {
    list: NeoWallets.list,
    connectedWallet,
    connectWallet,
    disConnectWallet,
  };

  return (
    <NeoWalletContext.Provider value={contextValue}>
      {props.children}
    </NeoWalletContext.Provider>
  );
};
export const useNeoWallets = () => useContext(NeoWalletContext);
