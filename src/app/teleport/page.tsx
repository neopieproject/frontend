"use client";
import React, { useEffect } from "react";
import { Button, Card, Space } from "antd";
import SwapInput from "../components/SwapInput";
import { useNeoWallets } from "@/utils/neo/hook";
import { useAccount, useDisconnect } from "wagmi";
import { useApp } from "@/hooks";
import ConnectedWalletInput from "../components/ConnectedWalletInput";
import { lock } from "@/utils/neo/teleport";
import { CONST } from "@cityofzion/neon-core";
import {
  getBalance,
  getLockNoFromNotifications,
  getRawTx,
} from "@/utils/neo/helpers";
import { checkIfMinted } from "@/utils/neox/heimdall";
import Header from "../components/Header";
import Status from "../components/Status";

const Teleport = () => {
  const { openNeoWalletModal, openEvmWalletModal } = useApp();
  const [amount, setAmount] = React.useState("");
  const neoWallet = useNeoWallets();
  const evmWallet = useAccount();
  const { disconnect } = useDisconnect();
  const [balance, setBalance] = React.useState<string | undefined>();

  const [status, setStatus] = React.useState<{
    stage: "teleport" | "minting on Neo X";
    status: "signing" | "processing" | "success" | "error";
    message?: string;
  }>();

  const onTeleport = async () => {
    if (neoWallet.connectedWallet) {
      try {
        setStatus({
          stage: "teleport",
          status: "signing",
        });
        const destinationAddress = evmWallet.address as string;
        const _txid = await lock(
          neoWallet.connectedWallet,
          CONST.NATIVE_CONTRACT_HASH.NeoToken,
          destinationAddress,
          amount
        );

        setStatus({
          stage: "teleport",
          status: "processing",
        });

        const lockNo = getLockNoFromNotifications(await getRawTx(_txid));

        setStatus({
          stage: "minting on Neo X",
          status: "processing",
        });

        const res = await checkIfMinted(lockNo);
        if (res) {
          setStatus({
            stage: "minting on Neo X",
            status: "success",
          });
        }
      } catch (e: any) {
        console.error(e);
        setStatus({
          stage: "teleport",
          status: "error",
          message: e.description
            ? e.description
            : e.message
            ? e.message
            : "Failed to teleport",
        });
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (neoWallet.connectedWallet) {
        try {
          const res = await getBalance(
            neoWallet.connectedWallet.account.address,
            CONST.NATIVE_CONTRACT_HASH.NeoToken
          );
          setBalance(res);
        } catch (e) {
          console.error(e);
        }
      }
    })();
  }, [neoWallet.connectedWallet]);
  return (
    <>
      <Header title="Teleport" description="$NEO: N3 -> Neo X" />
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Card>
            <Space direction="vertical" style={{ width: "100%" }}>
              <SwapInput
                icon={"/neo.svg"}
                title={"N3 chain"}
                tokenIcon={"/neo.svg"}
                tokenTitle={"$NEO"}
                balance={balance}
                value={amount}
                setValue={setAmount}
              />
              {neoWallet.connectedWallet ? (
                <ConnectedWalletInput
                  address={neoWallet.connectedWallet.account.address}
                  walletIcon={`/${neoWallet.connectedWallet.key}.svg`}
                  walletName={neoWallet.connectedWallet.name}
                  onClear={neoWallet.disConnectWallet}
                />
              ) : (
                <Button
                  size="large"
                  type="dashed"
                  style={{
                    width: "100%",
                  }}
                  onClick={openNeoWalletModal}
                >
                  Connect wallet
                </Button>
              )}
            </Space>
          </Card>
          <div style={{ textAlign: "center", color: "white" }}>↓↓↓</div>
          <Card>
            <Space direction="vertical" style={{ width: "100%" }}>
              <SwapInput
                readOnly={true}
                icon={"/neox.svg"}
                title={"Neo X chain"}
                tokenIcon={"/neo.svg"}
                tokenTitle={"$ONEO"}
                value={amount}
                setValue={setAmount}
              />
              {evmWallet.isConnected ? (
                <ConnectedWalletInput
                  address={evmWallet.address ? evmWallet.address : ""}
                  walletIcon={evmWallet.connector?.icon}
                  walletName={
                    evmWallet.connector ? evmWallet.connector.name : ""
                  }
                  onClear={disconnect}
                />
              ) : (
                <Button
                  size="large"
                  type="dashed"
                  style={{
                    width: "100%",
                  }}
                  onClick={openEvmWalletModal}
                >
                  Connect wallet
                </Button>
              )}
            </Space>
          </Card>
        </Space>

        {status ? (
          <Status
            stage={status.stage}
            status={status.status}
            onReset={() => setStatus(undefined)}
          />
        ) : (
          <Button
            size="large"
            type="primary"
            style={{
              width: "100%",
            }}
            disabled={
              !neoWallet.connectedWallet || !evmWallet.isConnected || !amount
            }
            onClick={onTeleport}
          >
            Transfer
          </Button>
        )}
      </Space>
    </>
  );
};

export default Teleport;
