import React, { createContext, useContext, useState } from "react";

interface IAppContext {
  sidebarStatus: boolean;
  walletSidebarStatus: boolean;
  neoWalletModalStatus: boolean;
  evmWalletModalStatus: boolean;
  txid?: string;
  refreshCount: number;

  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  toggleWalletSidebar: () => void;
  setTxid: (txid: string) => void;
  resetTxid: () => void;
  increaseRefreshCount: () => void;
  closeWalletSidebar: () => void;
  openNeoWalletModal: () => void;
  closeNeoWalletModal: () => void;
  openEvmWalletModal: () => void;
  closeEvmWalletModal: () => void;
}

export const AppContext = createContext({} as IAppContext);

export const AppContextProvider = (props: { children: React.ReactNode }) => {
  const [refreshCount, setRefreshCount] = useState(0);
  const [txid, setTxid] = useState<string | undefined>();
  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [walletSidebarStatus, setWalletSidebarStatus] = useState(false);
  const [neoWalletModalStatus, setNeoWalletModalStatus] = useState(false);
  const [evmWalletModalStatus, setEvmWalletModalStatus] = useState(false);

  const openSidebar = () => setSidebarStatus(true);
  const closeSidebar = () => setSidebarStatus(false);
  const closeWalletSidebar = () => setWalletSidebarStatus(false);
  const openNeoWalletModal = () => setNeoWalletModalStatus(true);
  const closeNeoWalletModal = () => setNeoWalletModalStatus(false);
  const openEvmWalletModal = () => setEvmWalletModalStatus(true);
  const closeEvmWalletModal = () => setEvmWalletModalStatus(false);

  const resetTxid = () => {
    setTxid(undefined);
    setRefreshCount(refreshCount + 1);
  };
  const toggleSidebar = () => {
    if (walletSidebarStatus) {
      setWalletSidebarStatus(false);
    }
    setSidebarStatus(!sidebarStatus);
  };
  const toggleWalletSidebar = () => {
    if (sidebarStatus) {
      setSidebarStatus(false);
    }
    setWalletSidebarStatus(!walletSidebarStatus);
  };
  const increaseRefreshCount = () => setRefreshCount(refreshCount + 1);

  const contextValue: IAppContext = {
    txid,
    refreshCount,
    walletSidebarStatus,
    sidebarStatus,
    neoWalletModalStatus,
    evmWalletModalStatus,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    toggleWalletSidebar,
    setTxid,
    resetTxid,
    increaseRefreshCount,
    closeWalletSidebar,
    openNeoWalletModal,
    closeNeoWalletModal,
    openEvmWalletModal,
    closeEvmWalletModal,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
